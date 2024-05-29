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

    if (pgError) {
        error(400, `${pgError.code}: ${pgError.details}`);
    }

    if (data.length == 0 || data[0].status) {
        error(401, 'pass invalid');
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