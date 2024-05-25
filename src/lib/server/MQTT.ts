// TODO: Add a helper to send a message to unlock the box

import { error } from "@sveltejs/kit";
import type { MqttClient } from "mqtt";
import { EventEmitter } from "node:events";
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from "$env/static/public";

export enum HardwareState {
    locked,
    unlocked
}

export type MQTTResponse = {
    success: boolean,
    new_state: HardwareState,
    error: string
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
            5000
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
export async function sendControlMessage(mqtt: MqttClient, box_id: string, message: 'lock' | 'unlock' | 'valid' | 'invalid'): Promise<MQTTResponse> {
    mqtt.publish(`ident/${box_id}/in`, message);
    let mqttResponse = {success: true, new_state: HardwareState.locked, error: "OK"};
    await prepareForAck(mqtt, `ident/${box_id}/out`, `ack ${message}`).catch(
        ( reason ) => mqttResponse = {success: false, new_state: HardwareState.unlocked, error: `${reason}: No acknowledgement received`}
    );
    return mqttResponse;
}

// helper for sending the designated masterkey to a box
export async function sendMasterkey(mqtt: MqttClient, box_id: string, key: string): Promise<MQTTResponse> {
    mqtt.publish(`ident/${box_id}/in`, `masterkey ${key}`);
    let mqttResponse = {success: true, new_state: HardwareState.unlocked, error: "OK"};
    await prepareForAck(mqtt, `ident/${box_id}/out`, 'ack masterkey').catch(
        ( reason ) => mqttResponse = {success: false, new_state: HardwareState.locked, error: `${reason}: No acknowledgement received`}
    );
    return mqttResponse;
}

function verifyPasscode(passcode: string | null): boolean {
    return passcode !== null && passcode.length == 6;
}

// helper for when a pass <code> message is received
function receivedPasscode(mqtt: MqttClient, message: string, box_id: string) {

    const passcode = (/^pass (\d*)$/.exec(message) ?? [null, null])[1];

    // verify the passcode, otherwise true for now
    const isPasscodeCorrect = verifyPasscode(passcode);

    return sendControlMessage(mqtt, box_id, isPasscodeCorrect ? "valid" : "invalid");
}

// helper for destructuring an /out topic from which we might receive a message and getting the identifier
function topicDestructor(topic: string): string {
    const identifier = (/\/(\d)*\//.exec(topic) ?? ['a', 'b'])[1];
    if(identifier.length != 16) throw error(500, "Topic not properly destructured into box_id");
    return identifier;
}

// callback for when a message is received from any hardware
export function onReceived(mqtt: MqttClient, topic: string, message: Buffer) {
    const messageString = message.toString();
    console.log(`Received from ${topic}: ${messageString}`);
    
    // if pass <code>
    if(messageString.includes('pass')) {
        receivedPasscode(mqtt, messageString, topicDestructor(topic));
    }

    // if others ...
}


export async function toggleLockMQTT(mqtt: MqttClient, box_id: string, box_status: boolean): Promise<MQTTResponse> {
    if (box_status){
        return sendControlMessage(mqtt, box_id, "unlock");
    } else {
        return sendControlMessage(mqtt, box_id, "lock");
    } 
}