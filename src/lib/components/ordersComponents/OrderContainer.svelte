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
    <div class="grid grid-rows-3 gap-2">
        <div class="grid grid-cols-5"> <!--row1-->
            <div> <!--col1-->
                <p class="py-2">Order Name</p>
            </div>
            <div class="col-span-3"> <!--col2-->
                {#if isEditing}
                    <input 
                        class="input" 
                        type="text" 
                        bind:value={editedOrderName} 
                        placeholder="Order Name" 
                    />
                {:else}
                    <p class="py-2">{order.order_name}</p>
                {/if}
            </div>
            <div> <!--col3-->
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
            </div>
        </div>
        <div class="grid grid-cols-5"> <!--row2-->
            <div> <!--col1-->
                <p class="py-2">Password</p>
            </div>
            <div class="col-span-3"> <!--col2-->
                {#if isEditing}
                    <input 
                        class="input" 
                        type="text" 
                        bind:value={editedPassword} 
                        placeholder="Password" 
                    />
                {:else}
                    <p class="py-2">{order.password}</p>
                {/if}
            </div>
            <div> <!--col3-->
                <p>
                    <button type="button" class="btn variant-filled-primary w-full" on:click={() => deleteOrder(order)}>
                        Delete
                    </button>
                </p>
            </div>
        </div>
        <div class="grid grid-cols-5"><!--row3-->
            <p class="py-2">Courier Contact</p>
            </div>
            <div class="col-span-3"> <!--col2-->
                {#if isEditing}
                    <input 
                        class="input" 
                        type="text" 
                        bind:value={editedCourier} 
                        placeholder="Courier Contact Number" 
                    />
                {:else}
                    <p class="py-2">{order.courier_details}</p>
                {/if}
            </div>
            <div> <!--col3-->
                {#if isEditing}
                    <p><button type="button" class="btn variant-filled-primary w-1/2" on:click={confirmEdit}>
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
</div>

<div class="card variant-ghost-primary card-hover w-full p-5 space-y-2" class:delivered={order.status}>
    <div class="grid grid-cols-5 gap-2 justify-start">
        <div>
            <p class="py-2">Order Name</p>
            <p class="py-2">Password</p>
            <p class="py-2">Courier Contact </p>
            
            <p class="pb-2">
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

        <div class="col-span-3">    
            {#if isEditing}
                <input 
                    class="input" 
                    type="text" 
                    bind:value={editedOrderName} 
                    placeholder="Order Name" 
                />
                <input 
                    class="input" 
                    type="text" 
                    bind:value={editedPassword} 
                    placeholder="Password" 
                />
                <input 
                    class="input" 
                    type="text" 
                    bind:value={editedCourier} 
                    placeholder="Courier Contact Number" 
                />
            {:else}
                <p class="py-2">{order.order_name}</p>
                <p class="py-2">{order.password}</p>
                <p class="py-2">{order.courier_details}</p>
            {/if}
        </div>

        <div>
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
                <p><button type="button" class="btn variant-filled-primary w-1/2" on:click={confirmEdit}>
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
</div>

<div class="card variant-ghost-primary card-hover w-full p-5 space-y-2" class:delivered={order.status}>
    {#if isEditing}
        <label for="delivered-checkbox">
            <input 
                type="checkbox" 
                id="delivered-checkbox"
                checked={order.status} 
                on:change={(e) => {
                    order.status = e.currentTarget.checked;
                    updateOrder(order);
                }} 
            />
            Delivered?
        </label>
        <label for="order-name">
            Order Name:
            <input 
                type="text" 
                id="order-name"
                bind:value={editedOrderName} 
                placeholder="Order Name"
            />
        </label>
        <label for="order-password">
            Password:
            <input 
                type="text" 
                id="order-password"
                bind:value={editedPassword} 
                placeholder="Password"
            />
        </label>
        <label for="order-courier">
            Courier contact details:
            <input 
                type="text" 
                id="order-courier"
                bind:value={editedCourier} 
                placeholder="Password"
            />
        </label>
    {:else}
        <div>
            <h2>Order Name:</h2>
            <p>{order.order_name}</p>
        </div>
        <div>
            <h2>Password:</h2>
            <p>{order.password}</p>
        </div>
        <div>
            <h2>Courier contact details:</h2>
            <p>{order.courier_details}</p>
        </div>
        <label for="delivered-checkbox">
            <input 
                type="checkbox" 
                id="delivered-checkbox"
                checked={order.status} 
                on:change={(e) => {
                    order.status = e.currentTarget.checked;
                    updateOrder(order);
                }} 
            />
            Delivered?
        </label>
    {/if}
        <button on:click={() => deleteOrder(order)}>Delete</button>
    {#if isEditing}
        <button on:click={confirmEdit}>Confirm</button>
        <button on:click={cancelEdit}>Cancel</button>
    {:else}
        <button on:click={startEditing}>Update</button>
    {/if}
</div>

<style>
    button {
        color: white; 
        border-radius: 4px; 

    }

    /* Style buttons on hover */
    button:hover {
        background-color: #606060; /* Darken the background color on hover */
    }

    .butRow1 {width: 200px;}
    .butRow2 {width: 100px;}

    .delivered {
        opacity: 0.5
    }
    .delivered input[type="text"] {
        text-decoration: line-through;
    }

    input[type="text"] {
		color: blue; /* Change font color for input text and submit button */
	}

</style>