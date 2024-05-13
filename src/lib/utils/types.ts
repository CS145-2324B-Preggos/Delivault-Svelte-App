export type BoxProcessed = {
    box_id: number;
    user_id: number;
}

export type OrderProcessed = {
    order_id: number;
    box_id: number;
    latest_delivery: string;
    earliest_delivery: string;
    password: string;
    status: boolean;
}

export type UserProcessed = {
    user_id: number;
    last_name: string;
    first_name: string;
    box_id: number;
}