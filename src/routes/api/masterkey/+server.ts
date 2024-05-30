import { initializeMQTTClient, sendMasterkey } from "$lib/server/MQTT.js";
import { json } from "@sveltejs/kit";

// publishing masterkey via supabase

export async function PATCH({ request } ) {
	// this now should send a signal to the broker to lock and unlock, and should update the box in supabase
    const mqttClient = await initializeMQTTClient();
    try {
        const passcodeResponse = await request.json();
        const boxMasterkey = passcodeResponse[0];

        // Send control message via MQTT
        const sendMasterkeyResponse = await sendMasterkey(mqttClient, boxMasterkey.box_id, boxMasterkey.masterkey);

        if (!sendMasterkeyResponse.success) {
            throw new Error(sendMasterkeyResponse.error);
        }

        return json({
            success: true,
            error: sendMasterkeyResponse.error
        });

    } catch (error) {
        return json({
            success: false,
            error: error
        });
    }
}