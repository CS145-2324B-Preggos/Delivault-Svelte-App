<script lang="ts">
  import Spinner from './loadingSpinner.svelte'
  export let isLocked: boolean;
</script>

<div class="flex flex-col justify-center items-center w-full h-full bg-gray-900 fixed bg-opacity-50">
 <Spinner/>
 {#if isLocked}
 <h1 class="text-white">Attempting to unlock ...</h1>
 {:else}
 <h1 class="text-white">Attempting to lock ...</h1>
 {/if}
</div>
