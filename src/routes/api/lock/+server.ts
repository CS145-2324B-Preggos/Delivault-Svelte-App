// TODO: add POST handler to toggle lock invoking MQTT methods from $lib/server/MQTT.ts

// import { Box } from "$lib/classes/Box";
import { sendControlMessage } from "$lib/server/MQTT.js";
import { json } from "@sveltejs/kit";

// Requests for viewing all boxes (perhaps of a certain user, can be tweaked in the filters)

// export async function POST({ request, locals } ) {
// 	/* Handles Select requests for admin records. */
// 	const filter = await request.json();

//     // access filter
//     // select box
//     //if box id of filter matches user uid of selected box, request goes thru
//         // do something, i.e., negate the state of the box, mqtt shit
//     // else, return fail

// 	return json(await Box.selectBoxes(filter, locals.supabase));
// }

// FOR TESTING PURPOSES ONLY
export async function GET({ locals }) { // "get" lock status of actual box/supabase
    const boxState = await sendControlMessage(locals.mqttClient, "0000000000000000", "lock");

    return json(boxState, {status: 200});
}

// POST toggleLockMQTT(mqttClient, boxOfUser.box_id, isLocked); (toggleLocked)