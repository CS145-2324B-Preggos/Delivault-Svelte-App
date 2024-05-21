<script lang=ts>
  import AddOrderScreen from "$lib/components/ordersComponents/addOrderScreen.svelte";
  import AddOrderForm from "$lib/components/ordersComponents/addOrderForm.svelte"; 
  import { type OrderProcessed } from "$lib/utils/types";
  import { type OrderDBObj, type OrderFilter, type OrderResponse } from "$lib/classes/Order";
  import { OrderFilterStore } from "$lib/stores/Filters";
  import { browser } from "$app/environment";
  import { type RealtimeChannel } from '@supabase/supabase-js';
  import { supabaseFront } from '$lib/stores/SupabaseClient.js';

  export let data;

  //for filters
	$: {
		if (browser) handleSelect($OrderFilterStore);
	}

  let channel: RealtimeChannel;

  onMount(() => {
    let orderObjects = data.orderRaws;
    mapOrderDatabaseObjects(orderObjects);

    channel = $supabaseFront
      .channel('order-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'order' }, () => {
        handleSelect($OrderFilterStore);
      })
      .subscribe();
  });

  onDestroy(() => {
    $supabaseFront.removeChannel(channel);
  });

  function mapOrderDatabaseObjects(orderObjects: OrderDBObj[] | null) {
    if (orderObjects !== null && orderObjects !== undefined) {
      orders = orderObjects.map((order) => {
        return {
          id: order.order_id,
          name: order.order_name,
          status: order.status,
          latestDeliveryDate: order.latest_delivery
        }
      });
    } else {
      orders = []
    }
  }

  import { SvelteComponent, onDestroy, onMount } from "svelte";
	import { table } from "console";

  let deleteResponse: OrderResponse;
	let updateResponse: OrderResponse;
	let selectResponse: OrderResponse;

  async function handleSelect(filter: OrderFilter) {
    /* Handles Select event from the filter confirmation by sending a
    POST request with payload requirement: filter. */

    const response = await fetch('../../api/order', {
      method: 'POST',
      body: JSON.stringify(filter),
      headers: {
        'content-type': 'application/json'
      }
    });

    selectResponse = await response.json();
    mapOrderDatabaseObjects(selectResponse.orderRaws);
  }

  async function handleDelete(event: CustomEvent) {
    const response = await fetch('../../api/order', {
      method: 'DELETE',
      body: JSON.stringify(event.detail),
      headers: {
        'content-type': 'application/json'
      }
    });

    deleteResponse = await response.json();
    if (deleteResponse.success == true) {
      //table.deleteEntryUI(); implement this sa component
      console.log("deleted: ", deleteResponse.orderRaws);
    } else {
      console.log("Failed to delete order entry.");
    }
  }

  async function handleUpdate(event: CustomEvent) {
		/* Handles Update event from TableRow by sending a PATCH request with 
        payload requirement: order_id, 
        optional: box_id, latest_delivery, earliest_delivery, status. */

		const response = await fetch('../../api/order', {
			method: 'PATCH',
			body: JSON.stringify(event.detail),
			headers: {
				'content-type': 'application/json'
			}
		});

		updateResponse = await response.json();
		if (updateResponse.success) {
			//table.updateEntryUI(); // implement this
			console.log("updated: ", updateResponse.orderRaws);
      handleSelect($OrderFilterStore);
		} else {
      console.error("Failed to delete order entry.");
		}
	}

  let showAddOrderScreen = false;

  let orders: { id: number; name: string; status: boolean; latestDeliveryDate: string }[] = [];

  const toggleAddOrderScreen = () => {
    showAddOrderScreen = !showAddOrderScreen;
  };

  const handleAddOrderFormSubmit = async (e: CustomEvent) => {
    const orderDetails = e.detail;

    // Send a POST request to the server to create a new order
    const response = await fetch('../../api/order', {
      method: 'POST',
      body: JSON.stringify({
        order_name: orderDetails.orderName,
        latest_delivery: orderDetails.expectedDeliveryDate,
        status: false
      }),
      headers: {
        'content-type': 'application/json'
      }
    });

    const result = await response.json();

    if (response.ok && result.success) {
      // Add the new order to the orders array with the ID returned from the server
      orders = [
        {
          id: result.order.order_id, // Assuming the response contains the new order with an ID
          name: result.order.order_name,
          status: result.order.status,
          latestDeliveryDate: result.order.latest_delivery,
        },
        ...orders,
      ];
      showAddOrderScreen = false;
    } else {
      console.error('Failed to add order:', result.message);
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
          <h2>{order.name}</h2>
          <p>{order.status}</p>
          <p>{order.latestDeliveryDate}</p>
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

    .orderListContainer {
      display: flex;
      flex-direction: column;
    }

    .addOrderButton {
      margin: 10px;
      align-self: flex-start;
    }
  }
</style>
