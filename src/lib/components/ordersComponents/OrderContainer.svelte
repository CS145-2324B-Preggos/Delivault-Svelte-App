<script>
    export let order, updateOrder;
</script>

<div class="OrderContainer">
    <input 
    type="checkbox" 
    checked={order.status} 
    on:change={(e) => {
        order.status = e.currentTarget.checked;
        updateOrder(order)
        }} 
        />
    <h2>{order.order_name}</h2>
    <p>{order.status}</p>
    <p>{order.password}</p>
    <input 
    type='text' 
    value={order.password} 
    on:input={(e) => {
        order.password = e.currentTarget.value;
        updateOrder(order);
    }}
    />
    <button>Delete</button>
    <button>Update</button>
</div>

<style>
    .OrderContainer {
      display: flex;
      flex-direction: column;
    }
</style>