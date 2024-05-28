import { sendControlMessage } from '$lib/server/MQTT.js'
import { error, json } from '@sveltejs/kit'

// check an 8-character passcode to see if it is valid
export async function POST({ request, locals: { supabase, mqttClient } }) {

    // console.log(request)
    const requestArray: { hash_passcode: string, box_id: string }[] = await request.json()
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

    if (pgError) error(400, `${pgError.code}: ${pgError.details}`)
    if (data.length == 0) error(400, 'invalid code')

    const boxResponse = sendControlMessage(mqttClient, requestObject.box_id, "unlock").then(
        (boxResponse) => {
            if (boxResponse.success) {
                const {error: pgError} = supabase
                    .from("public_orders")
                    .update({status: true})
                    .select()
            
            if (pgError) {console.log("db update error"); error(500, 'db update failed')}
            console.log("Box response successful")
        }}
    )
    

    return json(`valid code`)
}