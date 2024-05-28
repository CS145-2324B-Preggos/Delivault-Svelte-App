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


<div class="card variant-ghost-primary card-hover w-full p-5 space-y-2" class:delivered={order.status}>
    <div class="grid grid-cols-5 justify-start">
        <div class="">
            <p class="py-2">Order Name</p>
            <p class="py-2">Password</p>
            <p class="py-2">Courier Contact </p>
            
        </div>

        <div class="col-span-3 flex-grow">    
            {#if isEditing}
                <p class="py-1"><input 
                    class="input" 
                    type="text" 
                    bind:value={editedOrderName} 
                    placeholder="Order Name" 
                /></p>
                <p class="py-1"><input 
                    class="input" 
                    type="text" 
                    bind:value={editedPassword} 
                    placeholder="Password" 
                /></p>
                <p class="py-1"><input 
                    class="input" 
                    type="text" 
                    bind:value={editedCourier} 
                    placeholder="Courier Contact Number" 
                /></p>
            {:else}
                <p class="py-2">{order.order_name}</p>
                <p class="py-2">{order.password}</p>
                <p class="py-2">{order.courier_details}</p>
            {/if}

        </div>

        <div class="">
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


            <p class="py-3">
                <button type="button" class="btn variant-filled-primary w-full" on:click={() => deleteOrder(order)}>
                    Delete
                </button>
            </p>
            {#if isEditing}
                <p class="col-span-1"><button type="button" class="btn variant-filled-primary w-1/2" on:click={confirmEdit}>
                    Confirm
                </button>
                <button type="button" class="btn variant-filled-primary w-1/2" on:click={cancelEdit}>
                    Cancel
                </button></p>
            {:else}
                <p><button type="button" class="btn variant-filled-primary w-full" on:click={startEditing}>
                    Edit
                </button></p>
            {/if}
        </div>
    </div>

    <p class="pb-2 place-self-center">
        <input 
            class="checkbox" 
            type="checkbox"
            id="delivered-checkbox"
            checked={order.status} 
            on:change={(e) => {
                order.status = e.currentTarget.checked;
                updateOrder(order);
            }} 
        /> Delivered?

    </p>
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
        opacity: 0.5
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