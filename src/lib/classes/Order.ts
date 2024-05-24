import { insertOrderDB, selectOrderDB, updateOrderDB, deleteOrderDB } from "$lib/server/OrderSB";
import type { OrderProcessed } from "$lib/utils/types";
import type { SupabaseClient } from "@supabase/supabase-js"; 
// parameters for insertion and update

export type OrderDBObj = {
    order_id: number;
    box_id: number;
    order_name: string;
    password: string;
    courier_details: string;
    status: boolean;
}

// database response of Order functions
export type OrderResponse = {
    success: boolean;
    OrderRawObjs: OrderDBObj[] | null;
    error: string | null;
}

// for selecting Orders e.g., order/s of certain user/s
export type OrderFilter = {
    order_id: number,
    box_id: number;
    order_name: string;
    status: boolean
}

export class Order {
    public static toOrderObject(order: OrderProcessed): OrderDBObj {
        return {
			order_id: order.order_id,
            box_id: order.box_id,
            order_name: order.order_name,
            password: order.password,
            courier_details: order.courier_details,
            status: order.status
		};
    }
    public static async selectOrders(
        filter: OrderFilter = {
            order_id: 0,
            box_id: 0,
            order_name: "",
            status: false
        }): Promise<OrderResponse> {
        return selectOrderDB(filter);
    }

    public static async insertOrder(order: OrderDBObj): Promise<OrderResponse> {
        return insertOrderDB(order);
    }

    public static async updateOrder(order: OrderDBObj): Promise<OrderResponse> {
        return updateOrderDB(order);
    }

    public static async deleteOrder(order: OrderDBObj): Promise<OrderResponse> {
        return deleteOrderDB(order.order_id);
    }
    
}