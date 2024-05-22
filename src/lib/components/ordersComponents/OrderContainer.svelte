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

<div class="OrderContainer" class:delivered={order.status}>
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
    .OrderContainer {
    display: flex;
    flex-direction: column;
    border: 2px solid #ccc; /* Adjust border width and color */
    border-radius: 8px; /* Add border radius for rounded corners */
    padding: 10px; /* Add padding to create space between content and border */
    margin-bottom: 10px; /* Add margin to create space between Order containers */
    }

    .OrderContainer h2,
    .OrderContainer p {
    margin: 5px 0; /* Add margin between lines */
    }


    button {
        color: white; /* Change font color for buttons */
        background-color: #808080; /* Gray background color */
        border: none; /* Remove border */
        padding: 8px 16px; /* Add padding for better visual appearance */
        cursor: pointer; /* Add cursor pointer for better interaction */
        border-radius: 4px; /* Add border radius for rounded corners */
    }

    /* Style buttons on hover */
    button:hover {
        background-color: #606060; /* Darken the background color on hover */
    }

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