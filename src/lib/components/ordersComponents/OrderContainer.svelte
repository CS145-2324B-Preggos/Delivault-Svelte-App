<script>
	export let order, updateOrder, deleteOrder;
	let isEditing = false;
	let editedOrderName = order.order_name;
	let editedPassword = order.password;
	let editedCourier = order.courier_details;
	let originalOrderName = order.order_name;
	let originalPassword = order.password;
	let originalCourier = order.courier_details;

	const startEditing = () => {
		isEditing = true;
	};

	const confirmEdit = () => {
		isEditing = false;
		order.order_name = editedOrderName;
		order.password = editedPassword;
		order.courier_details = editedCourier;
		updateOrder(order);
	};

	const cancelEdit = () => {
		isEditing = false;
		// Reset edited values to original values
		editedOrderName = originalOrderName;
		editedPassword = originalPassword;
		editedCourier = originalCourier;
	};
</script>

<div
	class=" flex flex-row card variant-ghost-primary card-hover w-full p-5 space-y-2"
	class:delivered={order.status}
>
	<div class="flex flex-col w-full">
		<div class="flex flex-row justify-start">
			<div class="flex flex-col mr-5">
				<p class="py-2 font-bold">Order Name</p>
				<p class="py-2 font-bold">Password</p>
				<p class="py-2 font-bold">Courier Contact</p>
			</div>

			<div class="flex flex-col flex-grow mr-2">
				{#if isEditing}
					<p class="py-1">
						<input
							class="input"
							type="text"
							bind:value={editedOrderName}
							placeholder="Order Name"
						/>
					</p>
					<p class="py-1">
						<input class="input" type="text" bind:value={editedPassword} placeholder="Password" />
					</p>
					<p class="py-1">
						<input
							class="input"
							type="text"
							bind:value={editedCourier}
							placeholder="Courier Contact Number"
						/>
					</p>
				{:else}
					<p class="py-2">{order.order_name}</p>
					<p class="py-2">{order.password}</p>
					<p class="py-2">{order.courier_details}</p>
				{/if}
			</div>
		</div>

		<div class="pb-2 flex flex-row  border-solid border-8">
			<input
				class="checkbox"
				type="checkbox"
				id="delivered-checkbox"
				checked={order.status}
				on:change={(e) => {
					order.status = e.currentTarget.checked;
					updateOrder(order);
				}}
			/>
			Delivered?
			{#if isEditing}
				<div class="flex flex-row place-items-end border-solid border-8">
					<button type="button" class="btn variant-filled-primary" on:click={confirmEdit}>
						Confirm
					</button>
					<button type="button" class="btn variant-filled-primary" on:click={cancelEdit}>
						Cancel
					</button>
				</div>
			{/if}
		</div>
	</div>
	<div class="flex flex-col border-solid border-8">
		<!-- <p>
            <button type="button" class="btn variant-filled-primary butRow1"
            on:click={(e) => {
                order.status = e.currentTarget.checked;
                updateOrder(order);
            }} 
            >
                Mark Delivered
            </button>
        </p> -->

		<button
			type="button"
			class="btn variant-filled-primary self-center my-2"
			on:click={() => deleteOrder(order)}
		>
			Delete
		</button>

		<button
			type="button"
			class="btn variant-filled-primary w-full self-center"
			on:click={startEditing}
		>
			Edit
		</button>
	</div>
</div>

<style>
	button {
		border-radius: 4px;
	}

	/* Style buttons on hover */
	button:hover {
		background-color: #606060; /* Darken the background color on hover */
	}

	.delivered {
		opacity: 0.5;
	}

	.input {
		padding: 5px 12px;
		font-size: 14px;
		line-height: 20px;
		vertical-align: middle;
		background-color: #ffffff;
		border: 1px solid #e1e4e8;
		border-radius: 6px;
	}
</style>
