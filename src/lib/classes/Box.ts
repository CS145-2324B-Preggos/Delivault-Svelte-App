import type { BoxProcessed } from "$lib/utils/types";
import type { SupabaseClient } from "@supabase/supabase-js"; 
// parameters for insertion and update
export type BoxDBObj = {
    box_id: string;
    user_id: number;
    locked: boolean;
}

// database response of Box functions
export type BoxResponse = {
    success: boolean;
    boxRawObjs: BoxDBObj[] | null;
    error: string | null;
}

// for selecting Boxes e.g., box/es of certain user/s
export type BoxFilter = {
    box_id: string;
    user_id: number;
    locked: boolean;
}

export class Box {

    public static toBoxObject(box: BoxProcessed): BoxDBObj {
        return {
			box_id: box.box_id,
            user_id: box.user_id,
            locked: box.locked
		};
    }

    // public static async selectBoxes(
    //     filter: BoxFilter = {
    //         box_id: "",
    //         user_id: 0,
    //         locked: false
    //     }, supabase: SupabaseClient): Promise<BoxResponse> {
    //     return selectBoxDB(filter, supabase);
    // }

    // public static async insertBox(box: BoxDBObj, supabase: SupabaseClient): Promise<BoxResponse> {
    //     return insertBoxDB(box, supabase);
    // }

    // public static async updateBox(box: BoxDBObj, supabase: SupabaseClient): Promise<BoxResponse> {
    //     return updateBoxDB(box, supabase);
    // }

    // public static async deleteBox(box: BoxDBObj, supabase: SupabaseClient): Promise<BoxResponse> {
    //     return deleteBoxDB(box.box_id, supabase);
    // }
    
}