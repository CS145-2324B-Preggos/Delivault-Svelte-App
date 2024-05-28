export type BoxProcessed = {
    box_id: string;
    user_id: number;
    locked: boolean;
}

export type OrderProcessed = {
    order_id: number;
    box_id: number;
    order_name: string;
    password: string;
    courier_details: string;
    status: boolean;
}

export type UserProcessed = {
    user_id: number;
    last_name: string;
    first_name: string;
    box_id: number;
}