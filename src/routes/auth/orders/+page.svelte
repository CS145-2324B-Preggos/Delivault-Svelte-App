<script lang="ts">
	import AddOrderScreen from '$lib/components/ordersComponents/addOrderScreen.svelte';
	import AddOrderForm from '$lib/components/ordersComponents/addOrderForm.svelte';
	import OrderContainer from '$lib/components/ordersComponents/OrderContainer.svelte';

	import type { Order, OrderDBObj } from '$lib/classes/Order';
	import { onMount } from 'svelte';
	import { v4 as uuidv4 } from 'uuid';
	import { AppShell } from '@skeletonlabs/skeleton';

	export let data;

	let { orders, supabase } = data;
	let showAddOrderScreen = false;

	const toggleAddOrderScreen = () => {
		showAddOrderScreen = !showAddOrderScreen;
	};

	onMount(async () => {
		await getAllOrders();
	});

	const getAllOrders = async () => {
		try {
			let { data, error } = await supabase.from('order').select();
			orders = data;
			console.log(orders);
		} catch (err) {
			console.log(err);
		}
	};

	const updateOrder = async (order: OrderDBObj) => {
		try {
			const { data, error } = await supabase
				.from('order')
				.update({
					order_name: order.order_name,
					password: order.password,
					courier_details: order.courier_details,
					status: order.status
				})
				.eq('order_id', order.order_id);
			await getAllOrders();
		} catch (err) {
			console.log(err);
		}
	};

	const deleteOrder = async (order: OrderDBObj) => {
		try {
			const { data, error } = await supabase.from('order').delete().eq('order_id', order.order_id);
			await getAllOrders();
		} catch (err) {
			console.log(err);
		}
	};
	const generateIntegerUUID = () => {
		const uuid = uuidv4();
		// Remove hyphens and convert hexadecimal string to integer
		const hexWithoutHyphens = uuid.replace(/-/g, '');
		return parseInt(hexWithoutHyphens.substring(0, 8), 16);
	};

	const handleAddOrderFormSubmit = async (e: CustomEvent) => {
		let newOrderId = generateIntegerUUID();
		const orderDetails = e.detail;
		try {
			const { data, error } = await supabase.from('order').insert({
				order_id: newOrderId,
				box_id: 0, // for now
				order_name: orderDetails.order_name,
				password: orderDetails.password,
				courier_details: orderDetails.courier_contact_details,
				status: false
			});
			console.log(e.detail);
			console.log('order id: ', newOrderId);
			showAddOrderScreen = false;
			await getAllOrders();
		} catch (err) {
			console.log(err.response.body);
		}
	};
</script>

<AddOrderScreen {showAddOrderScreen} on:click={toggleAddOrderScreen}>
	<AddOrderForm
		on:cancelClick={toggleAddOrderScreen}
		on:addOrderFormSubmit={handleAddOrderFormSubmit}
	/>
</AddOrderScreen>

<AppShell
	regionPage="flex-col pt-3"
	slotHeader="place-self-center pt-5"
	slotPageFooter="place-self-center py-5"
>
	<svelte:fragment slot="header">
		<strong class="text-xl uppercase pt-5">My orders</strong>
	</svelte:fragment>

	<!-- <div class="border-solid border-8 w-max"> -->
		{#each orders as order (order.order_id)}
			<div class="mx-2">
				<OrderContainer {order} {updateOrder} {deleteOrder} />
			</div>
			<div class="pt-2"></div>
		{:else}
			<div class="card variant-ghost-primary w-64 h-10 flex flex-row place-content-center">
				<section class="place-self-center">No Orders Yet</section>
			</div>
		{/each}
	<!-- </div> -->

	<svelte:fragment slot="pageFooter">
		<button type="button" class="btn variant-filled-primary" on:click={toggleAddOrderScreen}>
			Add orders
		</button>
	</svelte:fragment>
</AppShell>
