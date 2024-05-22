import { type SupabaseClient } from "@supabase/supabase-js";
import { type OrderDBObj, type OrderFilter, type OrderResponse } from "$lib/classes/Order";

const success: OrderResponse = {
    success: true,
    OrderRawObjs: null,
    error: null
};

export async function selectOrderDB(filter: Partial<OrderFilter>, supabase: SupabaseClient): Promise<OrderResponse> {
    let query = supabase
        .from('order')
        .select('order_id, box_id, order_name, status, password');

    if (filter.order_id != null) {
        query = query.eq('order_id', filter.order_id);
    }

    if (filter.box_id != null) {
        query = query.eq('box_id', filter.box_id);
    }

    if (filter.order_name != null) {
        query = query.eq('order_name', filter.order_name);
    }

    if (filter.status != null) {
        query = query.eq('status', filter.status);
    }

    // Execute query
    const { data, error } = await query;

    // Error catch
    if (error) {
        return {
            success: false,
            OrderRawObjs: null,
            error: error.message
        };
    }

    // Format query into OrderDBObj
    const formattedData: OrderDBObj[] = [];

    if (data != null) {
        for (const row of data) {
            formattedData.push({
                order_id: row.order_id,
                box_id: row.box_id,
                order_name: row.order_name,
                // Assuming password is not part of the response
                password: '', 
                status: row.status
            });
        }
    }
    return {
        success: true,
        OrderRawObjs: formattedData,
        error: null
    };
}

export async function insertOrderDB(order: OrderDBObj, supabase: SupabaseClient): Promise<OrderResponse> {
    const { error } = await supabase.from('order').insert(order);

    if (error) {
        return {
            success: false,
            OrderRawObjs: null,
            error: error.message
        };
    }

    return success;
}

// Only works for checking a single order
async function checkOrderExistsDB(filter: OrderFilter, supabase: SupabaseClient): Promise<OrderResponse> {
    const orderDB = await selectOrderDB(filter, supabase);

    if (orderDB.success && orderDB.OrderRawObjs?.length === 1) {
        return success;
    } else {
        return {
            success: false,
            OrderRawObjs: null,
            error: 'Error: Order does not exist'
        };
    }
}

export async function updateOrderDB(order: OrderDBObj, supabase: SupabaseClient): Promise<OrderResponse> {
    // Updates an order entry based on their order_id
    // order_id should not be updated
    const orderCheck = await checkOrderExistsDB({
        order_id: order.order_id,
        box_id: order.box_id,
        order_name: order.order_name,
        status: order.status
    }, supabase);

    if (!orderCheck.success) {
        return orderCheck;
    }

    // Only permitted types to be updated (for now)
    const updateObj: { [key: string]: number | string | boolean } = {};

    for (const [key, value] of Object.entries(order)) {
        if (value && key !== 'order_id') { // Prevents order_id from being updated
            updateObj[key] = value;
        }
    }

    const { error } = await supabase
        .from('order')
        .update(updateObj)
        .eq('order_id', order.order_id);

    if (error) {
        return {
            success: false,
            OrderRawObjs: null,
            error: error.message
        };
    }
    return success;
}

export async function deleteOrderDB(orderID: number, supabase: SupabaseClient): Promise<OrderResponse> {
    const orderCheck = await checkOrderExistsDB({
        order_id: orderID,
        box_id: 0,
        order_name: "",
        status: false
    }, supabase);

    if (!orderCheck.success) {
        return orderCheck;
    }

    const { error } = await supabase.from('order').delete().eq('order_id', orderID);

    if (error) {
        return {
            success: false,
            OrderRawObjs: null,
            error: error.message
        };
    }

    return success;
}
