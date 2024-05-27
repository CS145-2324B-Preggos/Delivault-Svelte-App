// for retrieving an existing push subscription
export async function GET({ locals: { supabase, user } }) {
    if (!user) return new Response( null, {status: 401, statusText: "User unauthenticated"} )
    
    const {data, error} = await supabase.from("pushSubscription").select().eq('user_uid', user.id)

    if (!data) return new Response( null, {status: 404, statusText: "Push subscription not found"} )

    return new Response( JSON.stringify(data[0].subscription), { 
        status: error ? 500 : 200, 
        statusText: error ? `Something went wrong finding the push subscription: ${error.code} ${error.message}` : "OK" 
    })
}

// for adding a new push subscription to the database
export async function POST({ request, locals : { supabase, user } }) {
    const pushSubscription: PushSubscriptionJSON = await request.json()

    console.log(pushSubscription)

    if (!user) return new Response( null, {status: 401, statusText: "User unauthenticated"} )

    const {error} = await supabase.from("pushSubscription").upsert({
        'user_uid' : user.id,
        'subscription': pushSubscription
    }, {onConflict: 'user_uid'})

    return new Response( null, { 
        status: error ? 500 : 200, 
        statusText: error ? `Something went wrong uploading the push subscription: ${error.code} ${error.message}` : "OK" 
    })
}