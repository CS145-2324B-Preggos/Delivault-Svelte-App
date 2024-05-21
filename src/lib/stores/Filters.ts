import { writable, type Writable } from 'svelte/store';
import { type BoxFilter } from '$lib/classes/Box';
import { type OrderFilter } from '$lib/classes/Order';
import { type UserFilter } from '$lib/classes/User';

export let BoxFilterStore: Writable<BoxFilter> = writable({
    box_id: 0,
    user_id: 0
});

export let OrderFilterStore: Writable<OrderFilter> = writable({
    order_id: 0,
    box_id: 0,
    latest_delivery: "",
    earliest_delivery: "",
    status: false
});

export let UserFilterStore: Writable<UserFilter> = writable({
    user_id: 0,
    box_id: 0,
});