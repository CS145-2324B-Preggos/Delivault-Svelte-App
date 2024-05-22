import { Box } from "$lib/classes/Box";
import { json } from "@sveltejs/kit";

// Requests for viewing all boxes (perhaps of a certain user, can be tweaked in the filters)

export async function POST({ request, locals } ) {
	/* Handles Select requests for admin records. */
	const filter = await request.json();
	return json(await Box.selectBoxes(filter, locals.supabase));
}

export async function PATCH({ request, locals }) {
	/* Handles Update and Approve requests for admin records. */
	const updateInfo = Box.toBoxObject(await request.json());
	return json(await Box.updateBox(updateInfo, locals.supabase));
}

export async function DELETE({ request, locals }) {
	/* Handles Delete requests for admin records. */
	const box = await request.json();
	return json(await Box.deleteBox(box.box_id, locals.supabase));
}