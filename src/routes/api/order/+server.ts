import { Order } from "$lib/classes/Order";
import { json } from "@sveltejs/kit";

// Requests for viewing all orders (perhaps of a certain user, can be tweaked in the filters)

export async function POST( { request }, locals: { supabase } ) {
	/* Handles Select requests for order records. */
	const filter = await request.json();
	return json(await Order.selectOrders(filter, supabase));
}

export async function PATCH({ request }, locals: { supabase }) {
	/* Handles Update and Approve requests for order records. */
	const updateInfo = Order.toOrderObject(await request.json());
	return json(await Order.updateOrder(updateInfo, supabase));
}

export async function DELETE({ request }, locals: { supabase }) {
	/* Handles Delete requests for order records. */
	const order = await request.json();
	return json(await Order.deleteOrder(order.box_id, supabase));
}