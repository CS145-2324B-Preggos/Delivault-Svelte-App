// TODO: add POST handler to toggle lock invoking MQTT methods from $lib/server/MQTT.ts

// import { Box } from "$lib/classes/Box";
import { sendControlMessage } from "$lib/server/MQTT.js";
import { json } from "@sveltejs/kit";

// FOR TESTING PURPOSES ONLY
export async function GET({ url, locals }) {
    try {
        const box_id = url.searchParams.get('box_id');
        
        const { data, error } = await locals.supabase
            .from('box')
            .select()
            .eq('box_id', box_id);

        if (error) {
            throw error;
        }

        const box = data;

        return json({
            success: true,
            box: box,
            error: error
        });
    } catch (error) {
        return json({
            success: false,
            box: null,
            error: error
        });
    }
}

export async function POST({ request, locals } ) {
	// this now should send a signal to the broker to lock and unlock, and should update the box in supabase
    try {
        const boxResponse = await request.json();
        const { box_id, locked } = boxResponse;

        // Send control message via MQTT
        const action = locked ? "unlock" : "lock";
        // const mqTTResponse = await sendControlMessage(locals.mqttClient, box_id, action);

        // if (!mqTTResponse.success) {
        //     throw new Error(mqTTResponse.error);
        // }
        // Update the box in Supabase
        const { data, error } = locals.supabase
            .from('box')
            .update({
                locked: !locked
            })
            .eq('box_id', box_id);

        if (error) {
            throw error;
        }

        return json({
            success: true,
            lockStatus: locked,
            error: null
        });

        
    } catch (error) {
        const boxResponse = await request.json();
        const { locked } = boxResponse;
        return json({
            success: false,
            lockStatus: locked,
            error: error
        }); 
    }
}