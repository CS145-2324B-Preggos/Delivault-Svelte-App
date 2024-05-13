import { SupabaseClient, createClient } from "@supabase/supabase-js";
import { type UserDBObj, type UserFilter, type UserResponse } from "$lib/classes/User";
import { format } from "path";

const success: UserResponse = {
	success: true,
	userRawObjs: null,
	error: null
};

export async function selectUserDB(filter: UserFilter, supabase: SupabaseClient): Promise<UserResponse> {
    let query = supabase
    .from('user')
    .select('user_id, box_id');

    if (filter.box_id != null){
        query = query.eq('box_id',filter.box_id);
    }

    if (filter.user_id != null) {
        query = query.eq('user_id',filter.user_id);
    }

    // execute query
    const { data, error } = await query;

    // error catch
    if (error){
        return {
            success: false,
            userRawObjs: null,
            error: error.message
        };
    }

    // format query into UserDBObj

    const formattedData: UserDBObj[] = [];

    if (data != null) {
        for (const row of data){
            formattedData.push({
                user_id: row.user_id,
                last_name: row.last_name,
                first_name: row.first_name,
                box_id: row.box_id
            })
        }
    }
    return {
        success: true,
        userRawObjs: formattedData,
        error: null
    };
}

export async function insertUserDB(user: UserDBObj, supabase: SupabaseClient): Promise<UserResponse> {
    const { error } = await supabase.from('user').insert(user);

    if (error) {
        return {
            success: false,
            userRawObjs: null,
            error: error.message
        }
    }

    return success;
}

// only works for checking a single user
async function checkUserExistsDB(filter: UserFilter, supabase: SupabaseClient): Promise<UserResponse> {
    const userDB = await selectUserDB(filter, supabase);

    if (userDB.success && userDB.userRawObjs?.length == 1){
        return success;
    } else{
        return {
            success: false,
            userRawObjs: null,
            error: 'Error: User does not exist'
        };
    }
}

export async function updateUserDB(user: UserDBObj, supabase: SupabaseClient): Promise<UserResponse> {
    // updates a user entry based on their user_id
    // user_id should not be updated
    const userCheck = await checkUserExistsDB({
        user_id: user.user_id,
        box_id: 0
    }, supabase);

    if (!userCheck.success) {
        return userCheck;
    }

    // only permitted types to be updated (for now)
	const updateObj: { [key: string]: number } = {};

    for (const [key, value] of Object.entries(user)) {
        if (value && key != 'user_id'){ // prevents user_id to be updated
            updateObj[key] = value;
        }
    }

    const { error } = await supabase
        .from('user')
        .update(updateObj)
        .eq('user_id', user.user_id)

    if (error) {
        return {
            success: false,
            userRawObjs: null,
            error: error.message
        };
    }
    return success;
}

export async function deleteUserDB(userID: number, supabase: SupabaseClient): Promise<UserResponse> {
    const userCheck = await checkUserExistsDB({
        user_id: userID,
        box_id: 0
    }, supabase);

    if (!userCheck.success) {
		return userCheck;
	}

    const { error } = await supabase.from('user').delete().eq('user_id', userID);

    if (error) {
        return {
            success: false,
            userRawObjs: null,
            error: error.message
        }
    }

    return success;
}