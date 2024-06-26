// TODO: add POST handler to toggle lock invoking MQTT methods from $lib/server/MQTT.ts

// import { Box } from "$lib/classes/Box";
import { initializeMQTTClient, sendControlMessage } from "$lib/server/MQTT.js";
import { json } from "@sveltejs/kit";

// FOR TESTING PURPOSES ONLY
export async function GET({ url, locals }) {
    try {
        const box_id = url.searchParams.get('box_id');
        
        const { data, error } = await locals.supabase
            .from('boxes')
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

export async function PATCH({ request, locals } ) {
	// this now should send a signal to the broker to lock and unlock, and should update the box in supabase
    const mqttClient = await initializeMQTTClient()
    
    try {
        const boxResponse = await request.json();
        const box = boxResponse[0];
        console.log("locked status: ", box.locked);

        // // Send control message via MQTT
        const action = box.locked ? "lock" : "unlock";
        const mqTTResponse = await sendControlMessage(mqttClient, box.box_id, action);

        if (!mqTTResponse.success) {
            throw new Error(mqTTResponse.error);
        }
        // Update the box in Supabase
        const supaResponse = await locals.supabase
            .from('boxes')
            .update({locked: box.locked}) 
            .eq('box_id', box.box_id)
            .select();
        if (supaResponse.error) {
            throw supaResponse.error;
        }

        return json({
            success: true,
            lockStatus: box.locked,
            error: supaResponse.error
        });

        
    } catch (error) {
        return json({
            success: false,
            lockStatus: null,
            error: error
        }); 
    }
}