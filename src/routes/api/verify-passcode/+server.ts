import { sendControlMessage, type MQTTResponse } from '$lib/server/MQTT.js'
import { error, json } from '@sveltejs/kit'

// check an 8-character passcode to see if it is valid
export async function POST({ request, locals: { supabase, mqttClient } }) {

    // console.log(request)
    const requestArray: { 
        hash_passcode: string, 
        box_id: string
                        }[] = await request.json()
    const requestObject = requestArray[0]
    
    // preprocess requestObject.hash_passcode, truncate to first 16 bytes
    requestObject.hash_passcode = requestObject.hash_passcode.substring(0, 16)
    
    // console.log(requestObject)
    const {data, error: pgError} = await supabase
        .from("public_orders")
        .select()
        .eq(
            'hash_passcode', requestObject.hash_passcode
        )

    if (pgError) {
        error(400, `${pgError.code}: ${pgError.details}`);
    }

    if (data.length == 0 || data[0].status) {
        sendControlMessage(mqttClient, requestObject.box_id, "pass invalid");
        error(400, 'invalid code');
    }

    async function delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    sendControlMessage(mqttClient, requestObject.box_id, "pass valid").then(
        (boxResponse) => resolveValidPasscode(boxResponse, data[0])
    )

    return json({ message: 'valid code' })

    async function resolveValidPasscode(boxResponse: MQTTResponse, data: { hash_passcode: string, box_id: string, order_id: string }) {
        if (boxResponse.success) {
            const { error: updateError } = await supabase
                .from("public_orders")
                .update({ status: true })
                .eq("order_id", data.order_id)
                .select();
    
            if (updateError) {
                console.error("db update error", updateError);
                throw error(501, 'db update failed');
            }
            console.log("Box response successful");
    
            await delay(5000); // wait 5 seconds
    
            // Lock it again
            sendControlMessage(mqttClient, requestObject.box_id, "lock");
        }
    }
}