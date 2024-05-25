import { Order } from "$lib/classes/Order";
import { json } from "@sveltejs/kit";
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from "$env/static/public";
import { SupabaseClient } from "@supabase/supabase-js";
import { match } from "assert";

export async function GET({ locals, passcode }) {
    try{
        // getting the order with a matching passcode
        const { data, error } = await locals.supabase
            .from('order')
            .select()
            .eq('password', passcode);

        const matchingOrder = data;

        // check if the passcode is valid, i.e., it has not been delivered yet

        if(matchingOrder.status){ // if status == true, it has been delivered/passcode has been consumed
            return {
                success: false,
                orderConsumed: null, 
                error: "Passcode has been consumed"
            }
        } else {
            return {
                success: true,
                orderConsumed: matchingOrder.order_id, // order_id of the order with a consumed passcode 
                error: null
            }
        }
    } catch (error) {
        console.log(error);
    }
}

export async function POST({ request, locals }) {
    // request should contain the order_id of the order with passcode that is to be invalidated
    const order = await request.json();

    try {
        // update the status of the order in supabase
        const { data, error } = locals.supabase
            .from('order')
            .update({status: true}) // decideable: do we delete the order with a used passcode?
            .eq('order_id', order.order_id);

    } catch (error) {
        console.log(error);
    }
    
  }
