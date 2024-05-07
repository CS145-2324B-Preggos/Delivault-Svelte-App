import { SupabaseClient, createClient } from "@supabase/supabase-js";
import { type BoxDBObj, type BoxFilter, type BoxResponse } from "$lib/classes/Box";

export async function selectBoxDB(filter: BoxFilter, supabase: SupabaseClient): Promise<BoxResponse> {
    let query = supabase
    .from('box')
    .select('box_id, user_id');

    if (filter.box_id != null){
        query = query.eq('box_id',filter.box_id);
    }

    if (filter.user_id != null) {
        query = query.eq('box_id',filter.box_id);
    }

    // execute query
    const { data, error } = await query;

    // error catch
    if (error){
        return {
            success: false,
            boxRawObjs: null,
            error: error.message
        };
    }

    // format query into BoxDBObj

    const formattedData: BoxDBObj[] = [];

    if (data != null) {
        for (const row of data){
            
        }
    }
}