<script>
  export let showAddOrderScreen = false;
</script>

{#if showAddOrderScreen}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div class="backdrop" on:click|self>
    <slot></slot>
  </div>
{/if}

<style>
  .backdrop {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    position: fixed;
    background: rgba(0, 0, 0, 0.8);
    z-index: 1000;
    /* border-color: red; */
  }
</style>
