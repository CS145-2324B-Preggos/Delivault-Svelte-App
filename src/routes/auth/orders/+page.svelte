<script lang=ts>
  import AddOrderScreen from "../../../lib/components/ordersComponents/addOrderScreen.svelte";
  import AddOrderForm from "../../../lib/components/ordersComponents/addOrderForm.svelte";

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
