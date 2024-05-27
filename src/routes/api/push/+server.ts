import { error } from '@sveltejs/kit'

// for retrieving an existing push subscription
export async function GET({ locals: { supabase, user } }) {
    
}

// for adding a new push subscription to the database
export async function POST({ request, locals : { supabase, user } }) {
    const pushSubscription: PushSubscriptionJSON = await request.json()

    console.log(pushSubscription)

    if (!user) return new Response( null, {status: 401, statusText: "User unauthenticated"} )

    const {error} = await supabase.from("pushSubscription").upsert({
        'user_uid' : user?.id,
        'subscription': pushSubscription
    }, {onConflict: 'user_uid'})

    return new Response( null, { 
        status: error ? 500 : 200, 
        statusText: error ? `Something went wrong uploading the push subscription: ${error.code} ${error.message}` : "OK" 
    })
}