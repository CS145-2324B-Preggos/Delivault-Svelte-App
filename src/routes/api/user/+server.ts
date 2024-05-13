import { User } from "$lib/classes/User";
import { json } from "@sveltejs/kit";

export async function POST({ request }, locals: { supabase }) {
	/* Handles Select requests for admin records. */
	const filter = await request.json();
	return json(await User.selectUsers(filter, supabase));
}

export async function PATCH({ request }, locals: { supabase }) {
	/* Handles Update and Approve requests for admin records. */
	const updateInfo = User.toUserObject(await request.json());
	return json(await User.updateUser(updateInfo, supabase));
}

export async function DELETE({ request }, locals: { supabase }) {
	/* Handles Delete requests for admin records. */
	const user = await request.json();
	return json(await User.deleteUser(user.box_id, supabase));
}