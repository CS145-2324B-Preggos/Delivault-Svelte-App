import { error, json } from '@sveltejs/kit'

// check an 8-character passcode to see if it is valid
export async function POST({ request, locals: { supabase } }) {

    const requestObject: { hash_passcode: string, box_id: string } = await request.json()
    
    const {data, error: pgError} = await supabase
        .from("orders")
        .select()
        .eq(
            'hash_passcode', requestObject.hash_passcode
        ).eq(
            'box_id', requestObject.box_id
        )

    if(pgError) error(400, `${pgError.code}: ${pgError.details}`)
    if(data.length == 0) error(400, 'invalid code')

    return json(`valid code`)
}