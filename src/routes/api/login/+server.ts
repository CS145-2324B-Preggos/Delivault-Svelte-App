import { User } from "$lib/classes/User";
import { UserFilterStore } from "$lib/stores/Filters";
import { json } from "@sveltejs/kit";

export async function POST({request}, locals: {supabase}) {
    //login verification

    const { userID, box_id } = await request.json();

    return json(
        await User.selectUsers({
            user_id: userID,
            box_id: box_id
        }, supabase)
    );
}