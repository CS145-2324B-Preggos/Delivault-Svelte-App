import { Order } from "$lib/classes/Order";

export async function load() {
    /* Loads order records from the DB when page is created. */
    return Order.selectOrders();
}