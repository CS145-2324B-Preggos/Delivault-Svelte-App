// TODO: Add a helper to send a message to unlock the box

import { error } from "@sveltejs/kit";
import type { MqttClient, IClientOptions, IClientPublishOptions } from "mqtt";
import mqtt from "mqtt";
import { EventEmitter } from "node:events";
import { MQTT_BROKER_URL, MQTT_BROKER_PRT, MQTT_USERNAME, MQTT_PASSWORD } from '$env/static/private'

export enum HardwareState {
    locked,
    unlocked
}

export type MQTTResponse = {
    success: boolean,
    new_state: HardwareState,
    error: string
}

// this function initializes an MQTT client
export async function initializeMQTTClient() {
    const crt = await fetch("https://assets.emqx.com/data/emqxsl-ca.crt").then(async (response) => await response.blob().then( (blob) => blob.text() ))

    const options: IClientOptions = {
    host: MQTT_BROKER_URL,
    port: parseInt(MQTT_BROKER_PRT),
    protocol: 'mqtts',
    username: MQTT_USERNAME,
    password: MQTT_PASSWORD,
    keepalive: 0,
    ca: crt,
    }

    // Initialize and connect the mqtt client
    const client = mqtt.connect(options);

    client.on('connect', () => {
    console.log("Connected the server to the broker!");

    // Subscribe with QoS level 2
    client.subscribe('ident/+/out', { qos: 2 }, (err, granted) => {
        if (err) {
            console.error('Subscription error:', err.message);
        } else {
            console.log('Subscribed to:', granted?.map(grant => `${grant.topic} with QoS ${grant.qos}`).join(', '));
        }
    });

    // Send initial message
    client.publish("sys/log", "Hello, world!", { qos: 2 }, (err) => {
            if (err) {
            console.error('Publish error:', err.message);
            }
        });
    });

    client.on(
        'error',
        (mqtt_err) => error(500, mqtt_err.message)
    )

    return client
}

// TODO: implement this based on the obvious integrated eventEmitter solution + basti's fucking article https://dev.to/somedood/promises-and-events-some-pitfalls-and-workarounds-elp
// wait until an acknowledgement for the message comes in
async function waitForAck(target: EventEmitter) {
    console.log("Waiting for ack")
    return new Promise((resolve, reject) => {
        // listen for the ack, when heard, resolve
        target.once(
            'receivedack',
            resolve
        )

        // if no ack heard, reject
        setTimeout(
            () => { reject("ACKTIMEOUT"); console.log("ACKTIMEOUT"); },
            8000
        )
    })
}

// prepare the appropriate events and handlers, then start awaiting ack
async function prepareForAck(mqtt: MqttClient, expected_topic: string, expected_message: string) {
    const notifier = new EventEmitter();
    const detectorCallback = (topic: string, ackPayload: Buffer) => { 
        if (topic == expected_topic && ackPayload.toString() == expected_message) {
            notifier.emit('receivedack');
            console.log('received ack');
            mqtt.off('message', detectorCallback);
        } 
    }
    mqtt.on(
        'message',
        detectorCallback
    )
    return waitForAck(notifier);
}

// helper for when any control message needs to be sent to a box
export async function sendControlMessage(mqtt: MqttClient, box_id: string, message: 'lock' | 'unlock' | 'pass valid' | 'pass invalid'): Promise<MQTTResponse> {
    const topic = `ident/${box_id}/in`;
    const options: IClientPublishOptions = { qos: 2 }; // Define QoS level

    mqtt.publish(topic, message, options, (err) => {
        if (err) {
            console.error('Publish error: ', err);
            // Handle the error appropriately
        }
    });

    let mqttResponse = {
        success: true, 
        new_state: HardwareState.locked, 
        error: "OK"
    };
    await prepareForAck(mqtt, `ident/${box_id}/out`, `ack ${message}`).catch(
        ( reason ) => mqttResponse = {
            success: false, 
            new_state: HardwareState.unlocked, 
            error: `${reason}: No acknowledgement received`}
    );
    return mqttResponse;
}

// helper for sending the designated masterkey to a box
export async function sendMasterkey(mqtt: MqttClient, box_id: string, key: string): Promise<MQTTResponse> {
    const topic = `ident/${box_id}/in`; 
    const message = `masterkey ${key}`;
    const options: IClientPublishOptions = { qos: 2 }; // Define QoS level


    mqtt.publish(topic, message, options, (err) => {
        if (err) {
            console.error('Publish error: ', err);
        }
    });

    let mqttResponse = {
        success: true, 
        new_state: HardwareState.unlocked, 
        error: "OK"
    };

    await prepareForAck(mqtt, `ident/${box_id}/out`, 'ack masterkey').catch(
        ( reason ) => mqttResponse = {success: false, new_state: HardwareState.locked, error: `${reason}: No acknowledgement received`}
    );
    return mqttResponse;
}

export async function toggleLockMQTT(mqtt: MqttClient, box_id: string, box_status: boolean): Promise<MQTTResponse> {
    if (box_status){
        return sendControlMessage(mqtt, box_id, 
            "unlock");
    } else {
        return sendControlMessage(mqtt, box_id, "lock");
    } 
}