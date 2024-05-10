import { insertUserDB, deleteUserDB, selectUserDB, updateUserDB } from "$lib/server/UserDB";
import type { SupabaseClient } from "@supabase/supabase-js"; 
// parameters for insertion and update
export type UserDBObj = {
    user_id: number;
    last_name: string;
    first_name: string;
    box_id: number;
}

// database response of User functions
export type UserResponse = {
    success: boolean;
    userRawObjs: UserDBObj[] | null;
    error: string | null;
}

// for selecting Users e.g., user/s of certain user/s
export type UserFilter = {
    user_id: number;
    box_id: number;
}

export class User {
    public static async selectUsers(
        filter: UserFilter = {
            user_id: 0,
            box_id: 0
        }, supabase: SupabaseClient
    ): Promise<UserResponse> {
        return selectUserDB(filter, supabase);
    }

    public static async insertUser(user: UserDBObj, supabase: SupabaseClient): Promise<UserResponse> {
        return insertUserDB(user, supabase);
    }

    public static async updateUser(user: UserDBObj, supabase: SupabaseClient): Promise<UserResponse> {
        return updateUserDB(user, supabase);
    }

    public static async deleteUser(user: UserDBObj, supabase: SupabaseClient): Promise<UserResponse> {
        return deleteUserDB(user.user_id, supabase);
    }
    
}