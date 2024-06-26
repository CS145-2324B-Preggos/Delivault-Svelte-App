import { sendNotification } from '$lib/server/Webpush.js'

// for retrieving an existing push subscription
export async function GET({ locals: { supabase, user } }) {
    
    if (!user) return new Response( JSON.stringify(null), {status: 401, statusText: "User unauthenticated"} )
    
    const {data, error} = await supabase.from("push_subscriptions").select().eq('user_uid', user.id)

    if (!data) return new Response( JSON.stringify(null), {status: 404, statusText: "Push subscription not found"} )

    return new Response( JSON.stringify(data[0].subscription), { 
        status: error ? 500 : 200, 
        statusText: error ? `Something went wrong finding the push subscription: ${error.code} ${error.message}` : "OK" 
    })
}

// for adding a new push subscription to the database
export async function POST({ request, locals : { supabase, user } }) {
    const pushSubscription: PushSubscriptionJSON = await request.json()

    if (!user) return new Response( JSON.stringify(null), {status: 401, statusText: "User unauthenticated"} )

    const {error} = await supabase.from("pushSubscription").upsert({
        'user_uid' : user.id,
        'subscription': pushSubscription
    }, {onConflict: 'user_uid'})

    sendNotification(
        pushSubscription
    )

    return new Response( JSON.stringify(null), { 
        status: error ? 500 : 200, 
        statusText: error ? `Something went wrong uploading the push subscription: ${error.code} ${error.message}` : "OK" 
    })
}