import { PRIVATE_VAPID_KEY } from '$env/static/private';
import { PUBLIC_VAPID_KEY } from '$env/static/public';
import webpush, { type SendResult } from 'web-push';

export async function sendNotification(subscription: PushSubscriptionJSON, title: string = "Hello, world!", body: string = "Hello from DeliVault!") {
    webpush.setVapidDetails(
        'mailto:vereyes2+push-notifs@up.edu.ph',
        PUBLIC_VAPID_KEY,
        PRIVATE_VAPID_KEY
    )

    const notification = JSON.stringify({
        title,
        options: {
            body
        }
    })

    // ignore the error that arises here
    await webpush.sendNotification(
        subscription,
        notification
    ).then(
        (sendResult: SendResult) => {
            console.log(`${sendResult.statusCode} ${sendResult.body}`)
        }
    ).catch(
        (notifError) => { throw new Error(notifError) }
    )
}