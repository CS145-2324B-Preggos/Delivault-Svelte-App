import { SupabaseClient, createClient } from "@supabase/supabase-js";
import { type OrderDBObj, type OrderFilter, type OrderResponse } from "$lib/classes/Order";
import { format } from "path";

const success: OrderResponse = {
	success: true,
	OrderRawObjs: null,
	error: null
};

export async function selectOrderDB(filter: OrderFilter, supabase: SupabaseClient): Promise<OrderResponse> {
    let query = supabase
    .from('order')
    .select('order_id, box_id, latest_delivery, earliest_delivery, status');

    if (filter.order_id != null){
        query = query.eq('order_id',filter.order_id);
    }

    if (filter.box_id != null){
        query = query.eq('box_id',filter.box_id);
    }

    if (filter.latest_delivery != null){
        query = query.eq('latest_delivery',filter.latest_delivery);
    }

    if (filter.earliest_delivery != null){
        query = query.eq('earliest_delivery',filter.earliest_delivery);
    }

    if (filter.status != null){
        query = query.eq('status',filter.status);
    }

    // execute query
    const { data, error } = await query;

    // error catch
    if (error){
        return {
            success: false,
            OrderRawObjs: null,
            error: error.message
        };
    }

    // format query into OrderDBObj

    const formattedData: OrderDBObj[] = [];

    if (data != null) {
        for (const row of data){
            formattedData.push({
                order_id: row.order_id,
                box_id: row.box_id,
                latest_delivery: row.latest_delivery,
                earliest_delivery: row.earliest_delivery,
                password: row.password,
                status: row.status
            })
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
        }
    }

    return success;
}

// only works for checking a single order
async function checkOrderExistsDB(filter: OrderFilter, supabase: SupabaseClient): Promise<OrderResponse> {
    const orderDB = await selectOrderDB(filter, supabase);

    if (orderDB.success && orderDB.OrderRawObjs?.length == 1){
        return success;
    } else{
        return {
            success: false,
            OrderRawObjs: null,
            error: 'Error: Order does not exist'
        };
    }
}

export async function updateOrderDB(order: OrderDBObj, supabase: SupabaseClient): Promise<OrderResponse> {
    // updates a order entry based on their order_id
    // order_id should not be updated
    const orderCheck = await checkOrderExistsDB({
        order_id: order.order_id,
        box_id: order.box_id,
        latest_delivery: order.latest_delivery,
        earliest_delivery: order.earliest_delivery,
        status: order.status
    },
    supabase);

    if (!orderCheck.success) {
        return orderCheck;
    }

    // only permitted types to be updated (for now)
	const updateObj: { [key: string]: number } = {};

    for (const [key, value] of Object.entries(order)) {
        if (value && key != 'order_id'){ // prevents order_id to be updated
            updateObj[key] = value;
        }
    }

    const { error } = await supabase
        .from('order')
        .update(updateObj)
        .eq('order_id', order.order_id)

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
        latest_delivery: "",
        earliest_delivery: "",
        status: false
    },
    supabase);

    if (!orderCheck.success) {
		return orderCheck;
	}

    const { error } = await supabase.from('order').delete().eq('order_id', orderID);

    if (error) {
        return {
            success: false,
            OrderRawObjs: null,
            error: error.message
        }
    }

    return success;
}