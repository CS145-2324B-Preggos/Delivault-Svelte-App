import { Order } from "$lib/classes/Order";
import { json } from "@sveltejs/kit";

export async function POST( { request }, locals: { supabase } ) {
	/* Handles Select requests for admin records. */
	const filter = await request.json();
	return json(await Order.selectOrders(filter, supabase));
}

export async function PATCH({ request }, locals: { supabase }) {
	/* Handles Update and Approve requests for admin records. */
	const updateInfo = Order.toOrderObject(await request.json());
	return json(await Order.updateOrder(updateInfo, supabase));
}

export async function DELETE({ request }, locals: { supabase }) {
	/* Handles Delete requests for admin records. */
	const order = await request.json();
	return json(await Order.deleteOrder(order.box_id, supabase));
}