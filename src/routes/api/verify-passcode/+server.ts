import { sendControlMessage } from '$lib/server/MQTT.js'
import { error, json } from '@sveltejs/kit'

// check an 8-character passcode to see if it is valid
export async function POST({ request, locals: { supabase, mqttClient } }) {

    const requestObject: { hash_passcode: string, box_id: string } = await request.json()
    
    let {data, error: pgError} = await supabase
        .from("orders")
        .select()
        .eq(
            'hash_passcode', requestObject.hash_passcode
        ).eq(
            'box_id', requestObject.box_id
        )

    if (pgError) error(400, `${pgError.code}: ${pgError.details}`)
    if (data.length == 0) error(400, 'invalid code')

    const boxResponse = await sendControlMessage(mqttClient, requestObject.box_id, "unlock")

    if (boxResponse.success) {
        let {error: pgError} = await supabase
            .from("orders")
            .update({status: true})
            .select()
        
        if (pgError) error(500, 'db update failed')
    }

    return json(`valid code`)
}