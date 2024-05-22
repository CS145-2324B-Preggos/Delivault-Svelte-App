<script lang=ts>
  import AddOrderScreen from "$lib/components/ordersComponents/addOrderScreen.svelte";
  import AddOrderForm from "$lib/components/ordersComponents/addOrderForm.svelte";
  import OrderContainer from "$lib/components/ordersComponents/OrderContainer.svelte";

	import type { Order, OrderDBObj } from "$lib/classes/Order";
  import { onMount } from "svelte";
  import { createClient } from "@supabase/supabase-js";
  import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public'

  export let data;

  let { orders } = data;

  let supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);
  let showAddOrderScreen = false;
  // let orders = [];

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

  const updateOrder = async (order) => {
    try {
      const { data, error } = await supabase
      .from("order")
      .update({password: order.password, status: order.status})
      .eq("order_id", order.order_id)
      await getAllOrders();
      
    } catch (err) {
      console.log(err);
    }
  }

  const deleteOrder = async (order) => {
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

  // const handleAddOrderFormSubmit = (e:CustomEvent) => {
  //   let newOrderId = orders.length + 1;
  //   const orderDetails = e.detail;
  //   orders = [
  //     {
  //       id: newOrderId,
  //       name: orderDetails.orderName,
  //       status: false,
  //       latestDeliveryDate: orderDetails.expectedDeliveryDate,
  //     },
  //     ...orders,
  //   ];
  //   console.log(e.detail);
  //   showAddOrderScreen = false;
  // };
</script>

<!-- <AddOrderScreen {showAddOrderScreen} on:click={toggleAddOrderScreen}>
  <AddOrderForm
    on:cancelClick={toggleAddOrderScreen}
    on:addOrderFormSubmit={handleAddOrderFormSubmit}
  />
</AddOrderScreen> -->

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
      <button class="addOrderButton" on:click={toggleAddOrderScreen}
        >Add order</button
      >
    </div>
  </div>
</main>

<style>
  main {
    /* text-align: center; */
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
</style>