// TODO: add POST handler to toggle lock invoking MQTT methods from $lib/server/MQTT.ts

import { SupabaseClient } from "@supabase/supabase-js";

import { Box } from "$lib/classes/Box";
import { json } from "@sveltejs/kit";

// Requests for viewing all boxes (perhaps of a certain user, can be tweaked in the filters)

export async function POST({ request }, locals: { supabase } ) {
	/* Handles Select requests for admin records. */
	const filter = await request.json();

    // access filter
    // select box
    //if box id of filter matches user uid of selected box, request goes thru
        // do something, i.e., negate the state of the box, mqtt shit
    // else, return fail

	return json(await Box.selectBoxes(filter, supabase));
}