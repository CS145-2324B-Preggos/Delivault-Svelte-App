import { sendNotification } from '$lib/server/Webpush.js'
import { error, json } from '@sveltejs/kit'

// check an 8-character passcode to see if it is valid
export async function POST({ request, locals: { supabase } }) {

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
    
    const {data: subscriptionData, error: subError} = await supabase
        .from("boxes_subscriptions")
        .select()
        .eq("box_id", requestObject.box_id)

    if (subError) {
        error(502, `subError ${subError.code}: ${subError.details}`)
    }

    if (pgError) {
        error(400, `${pgError.code}: ${pgError.details}`);
    }

    let pushSubscription : PushSubscriptionJSON | null = null;

    if (subscriptionData.length > 0) {
        pushSubscription = subscriptionData[0].subscription
    }

    console.log(pushSubscription)

    if (data.length == 0 || data[0].status) {
        if(pushSubscription) sendNotification(pushSubscription, "Delivault Unlock Attempt Failed!", "Someone attempted to open your box")
        error(401, 'pass invalid');
    }

    if (pushSubscription) {
        sendNotification(pushSubscription, "DeliVault Unlocked!", `Your order ${data[0].order_id} has arrived!`)
    }

    const { error: updateError } = await supabase
        .from("public_orders")
        .update({ status: true })
        .eq("order_id", data[0].order_id)
        .select();

    if (updateError) {
        return error(501, 'update failed')
    }

    return json({ message: 'valid code' }, { status: 200, statusText: 'pass valid' })
}