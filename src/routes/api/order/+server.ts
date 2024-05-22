import { Order } from "$lib/classes/Order";
import { json } from "@sveltejs/kit";

// Requests for viewing all orders (perhaps of a certain user, can be tweaked in the filters)

export async function POST({ request, locals }) {
  /* Handles Select requests for order records. */
  const filter = await request.json();
  return json(await Order.selectOrders(filter, locals.supabase));
}

export async function PATCH({ request, locals }) {
  /* Handles Update and Approve requests for order records. */
  const updateInfo = Order.toOrderObject(await request.json());
  return json(await Order.updateOrder(updateInfo, locals.supabase));
}

export async function DELETE({ request, locals }) {
  /* Handles Delete requests for order records. */
  const order = await request.json();
  return json(await Order.deleteOrder(order.box_id, locals.supabase));
}
