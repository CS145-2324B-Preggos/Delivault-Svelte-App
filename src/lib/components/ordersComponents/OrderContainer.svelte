<script>
    export let order, updateOrder, deleteOrder;
    let isEditing = false;
    let editedOrderName = order.order_name;
    let editedPassword = order.password;
    let editedCourier = order.courier_details;
    let originalOrderName = order.order_name;
    let originalPassword = order.password;
    let originalCourier = order.courier_details;
    let deliveredToggle = order.status;

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

    const toggleButton = () => {
        deliveredToggle = !deliveredToggle;
    }
</script>

<div
	class=" flex flex-row card variant-ghost-primary card-hover w-full p-5 space-y-2"
	class:delivered={order.status}
>
	<div class="flex flex-col w-full">
		<div class="flex flex-row justify-start">
			<div class="flex flex-col mr-2 lg:mr-5">
				<p class="py-2 font-bold">Order Name</p>
				<p class="py-2 font-bold">Password</p>
				<p class="py-2 font-bold">Courier Contact</p>
			</div>

			<div class="flex flex-col lg:flex-grow mr-2">
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

		<div class="pb-2 flex flex-row justify-center">
			{#if deliveredToggle}
                <button type="button" class="btn variant-filled-primary  w-2/3 lg:w-1/3 deliverBut mt-2"
                    on:click={() => {
                        toggleButton();
                        order.status = deliveredToggle;
                        updateOrder(order);
                    }} 
                > Delivered
                </button>
            {:else}
                <button type="button" class="btn variant-filled-primary w-2/3 lg:w-1/3 mt-2"
                    on:click={() => {
                        toggleButton();
                        order.status = deliveredToggle;
                        updateOrder(order);
                    }} 
                > Mark Delivered?
                </button>
            {/if}
		</div>
	</div>
	<div class="flex flex-col w-1/5">
		<button
			type="button"
			class="btn variant-filled-secondary self-center my-2 w-full"
			on:click={() => deleteOrder(order)}
		> Delete
		</button>

		{#if isEditing}
            <button
                type="button"
                class="btn variant-filled-primary w-full self-center deliverBut"
                disabled
            > Edit
            </button>
            <div class="flex lg:flex-row place-items-end mt-2">
                <button 
                    type="button" 
                    class="btn variant-filled-primary w-1/2 text-xs lg:text-base mr-1 lg:mr-2" 
                    on:click={cancelEdit}
                >Cancel
                </button>
                <button 
                    type="button" 
                    class="btn variant-filled-primary w-1/2 text-xs lg:text-base" 
                    on:click={confirmEdit}
                >Confirm
                </button>
            </div>
        {:else}
            <button
                type="button"
                class="btn variant-filled-primary w-full self-center"
                on:click={startEditing}
            > Edit
            </button>
        {/if}
	</div>
</div>

<style>
    button {
        border-radius: 4px; 
    }
	button {
		border-radius: 4px;
	}

    /* Style buttons on hover */
    button:hover {
        background-color: #4d4b4b; /* Darken the background color on hover */
    }
	/* Style buttons on hover */
	button:hover {
		background-color: #606060; /* Darken the background color on hover */
	}

    .delivered {
        opacity: 0.5
    }

    .deliverBut {
        background-color: #4d4b4b;
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
