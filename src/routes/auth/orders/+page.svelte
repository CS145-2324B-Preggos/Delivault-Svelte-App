<script lang=ts>
  import AddOrderScreen from "$lib/components/ordersComponents/addOrderScreen.svelte";
  import AddOrderForm from "$lib/components/ordersComponents/addOrderForm.svelte";
  import OrderContainer from "$lib/components/ordersComponents/OrderContainer.svelte";

	import type { Order, OrderDBObj } from "$lib/classes/Order";
  import { onMount } from "svelte";
  import { createClient } from "@supabase/supabase-js";
  import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public'
  import { v4 as uuidv4 } from 'uuid';


  export let data;

  let { orders } = data;

  let supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);
  let showAddOrderScreen = false;

  const toggleAddOrderScreen = () => {
    showAddOrderScreen = !showAddOrderScreen;
  };
  
  onMount(async () => {
    await getAllOrders();
  });

  const getAllOrders = async() => {
    try{
      let { data, error } = await supabase.from("order").select();
      orders = data;
    } catch (err) {
      console.log(err)
    }
  }

  const updateOrder = async (order: OrderDBObj) => {
    try {
      const { data, error } = await supabase
        .from("order")
        .update({
            order_name: order.order_name,
            password: order.password,
            status: order.status
          })      
        .eq("order_id", order.order_id)
      await getAllOrders();
    } catch (err) {
      console.log(err);
    }
  }

  const deleteOrder = async (order: OrderDBObj) => {
    try {
      const { data, error } = await supabase
        .from("order")
        .delete()
        .eq("order_id", order.order_id)
      await getAllOrders();
    } catch (err) {
      console.log(err);
    }
  }
  
  const handleAddOrderFormSubmit = async (e:CustomEvent) => {
    let newOrderId = uuidv4();
    const orderDetails = e.detail;
    try{
      const { data, error } = await supabase
        .from('order')
        .insert({
          order_id: newOrderId, 
          box_id: 0, // for now
          order_name: orderDetails.order_name,
          password: orderDetails.password,
          status: false
        });
      console.log(e.detail);
      showAddOrderScreen = false;
      await getAllOrders();
    } catch (err) {
      console.log(err);
    }
  };
</script>

<AddOrderScreen {showAddOrderScreen} on:click={toggleAddOrderScreen}>
  <AddOrderForm 
    on:cancelClick={toggleAddOrderScreen}
    on:addOrderFormSubmit={handleAddOrderFormSubmit}
  />
</AddOrderScreen>

<main>
  <div class="mainContainer">
    <h1>My orders</h1>
    <div class="middleContainer">
      <div class="orderListContainer">
        {#each orders as order}
          <OrderContainer {order} {updateOrder} {deleteOrder} />
        {:else}
          <p>No Orders Yet</p>
        {/each}
      </div>
    </div>
    <button class="addOrderButton" on:click={toggleAddOrderScreen}>Add orders</button>
  </div>
</main>

<style>
  main {
    display: flex;
    justify-content: center;
    padding: 0;
    max-width: 240px;
    margin: 0 auto;
  }
  @media (min-width: 640px) {
    main {
      max-width: none;
    }
    .mainContainer {
      display: flex;
      flex-direction: column;
    }
    .middleContainer {
      display: flex;
      flex-direction: row;
      align-items: center;
    }
    .addOrderButton {
      margin: 10px;
      align-self: flex-start;
    }
  }

  .addOrderButton {
    color: white;
    background-color: #808080;
    border: none;
    padding: 8px 16px;
    cursor: pointer;
    border-radius: 4px;
    margin-top: 20px; /* Add margin to create space between the button and the orders */
  }

  .addOrderButton:hover {
    background-color: #606060;
  }
</style>