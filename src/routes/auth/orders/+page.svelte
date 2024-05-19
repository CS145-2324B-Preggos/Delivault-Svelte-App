<script lang=ts>
  import AddOrderScreen from "$lib/components/ordersComponents/addOrderScreen.svelte";
  import AddOrderForm from "$lib/components/ordersComponents/addOrderForm.svelte"; 
  import { type OrderProcessed } from "$lib/utils/types";
  import { type OrderDBObj, type OrderFilter } from "$lib/classes/Order";
  import { OrderFilterStore } from "$lib/stores/Filters";
  import { browser } from "$app/environment";

  export let data;

  //for filters
	$: {
		if (browser) handleSelect($OrderFilterStore);
	}

  import { type RealtimeChannel } from '@supabase/supabase-js';
  import { supabaseFront } from '$lib/stores/SupabaseClient.js';
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
          order_id: order.order_id,
          box_id: order.box_id,
          latest_delivery: order.latest_delivery,
          earliest_delivery: order.earliest_delivery,
          password: order.password,
          status: order.status
        }
      });
    } else {
      orders = []
    }
  }

  import { type OrderDBObj, type OrderResponse } from "$lib/classes/Order";
  import { SvelteComponent, onDestroy, onMount } from "svelte";
	import { table } from "console";

  let deleteResponse: StudentResponse;
	let updateResponse: StudentResponse;
	let selectResponse: StudentResponse;

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
		if (updateResponse.success == true) {
			//table.updateEntryUI(); // implement this
			console.log("updated: ", updateResponse.orderRaws)
		} else {
      console.log("Failed to delete order entry.");
		}
	}

  let showAddOrderScreen = false;

  let orders = [
    {
      id: 1,
      name: "Kendrick shirt",
      status: false,
      latestDeliveryDate: "June 1, 2024",
    },
    {
      id: 2,
      name: "21 Savage Tee",
      status: false,
      latestDeliveryDate: "July 10, 2024",
    },
    {
      id: 3,
      name: "Drake cap",
      status: false,
      latestDeliveryDate: "August 30, 2024",
    },
    {
      id: 4,
      name: "Anita Max Wynn",
      status: false,
      latestDeliveryDate: "December 18, 2024",
    },
  ];

  const toggleAddOrderScreen = () => {
    showAddOrderScreen = !showAddOrderScreen;
  };

  const handleAddOrderFormSubmit = (e:CustomEvent) => {
    let newOrderId = orders.length + 1;
    const orderDetails = e.detail;
    orders = [
      {
        id: newOrderId,
        name: orderDetails.orderName,
        status: false,
        latestDeliveryDate: orderDetails.expectedDeliveryDate,
      },
      ...orders,
    ];
    console.log(e.detail);
    showAddOrderScreen = false;
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
