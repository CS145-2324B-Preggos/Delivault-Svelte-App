// TODO: Add a helper to send a message to unlock the box

import { error } from "@sveltejs/kit";
import type { MqttClient } from "mqtt";

export enum HardwareState {
    locked,
    unlocked
}

export type MQTTResponse = {
    success: boolean,
    new_state: HardwareState,
    error: string | null
}

// helper for when any control message needs to be sent to a box
export function sendControlMessage(mqtt: MqttClient, box_id: string, message: 'lock' | 'unlock' | 'valid' | 'invalid'): MQTTResponse {
    mqtt.publish(`ident/${box_id}/in`, message);
    return {success: true, new_state: HardwareState.locked, error: null};
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