// TODO: Add a helper to send a message to unlock the box

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

// helper for when a lock message needs to be sent
export async function sendLockMessage(mqtt: MqttClient, box_id: string): Promise<MQTTResponse|never> {
    mqtt.publish(`ident/${box_id}/in`, 'lock');
    return {success: true, new_state: HardwareState.locked, error: null};
}

// helper for when an unlock message needs to be sent
export async function sendUnlockMessage(mqtt: MqttClient, box_id: string) {
    mqtt.publish(`ident/${box_id}/in`, 'unlock');
    return {success: true, new_state: HardwareState.unlocked, error: null};
}

// callback for when a message is received from any hardware
export function onReceived(topic: string, message: Buffer) {
    console.log(`Received from ${topic}: ${message.toString()}`);
}