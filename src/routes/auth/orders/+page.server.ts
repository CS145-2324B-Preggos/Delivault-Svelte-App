import { Order } from "$lib/classes/Order";
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
    // Fetch orders with an empty filter or a specific filter if needed
    const filter = {
        order_id: 0,
        box_id: 0,
        order_name: "",
        latest_delivery: "",
        earliest_delivery: "",
        status: false
    };

    const response = await Order.selectOrders(filter, locals.supabase);

    if (!response.success) {
        throw new Error(response.error || "Failed to fetch orders.");
    }

    return {
        orders: response.OrderRawObjs
    };
};
