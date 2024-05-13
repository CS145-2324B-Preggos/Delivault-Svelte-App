import { Box } from "$lib/classes/Box";
import { json } from "@sveltejs/kit";

export async function POST({ request }) {
	/* Handles Select requests for admin records. */
	const filter = await request.json();
	return json(await Box.selectBoxes(filter));
}

export async function PATCH({ request }) {
	/* Handles Update and Approve requests for admin records. */
	const updateInfo = Admin.toAdminDBObj(await request.json());
	return json(await Admin.updateAdmin(updateInfo));
}

export async function DELETE({ request }) {
	/* Handles Delete requests for admin records. */
	const admin = await request.json();
	return json(await Admin.deleteAdmin(admin.adminID));
}