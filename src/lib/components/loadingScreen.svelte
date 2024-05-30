<script lang="ts">
	import Spinner from './loadingSpinner.svelte';
	export let isLocked: boolean = false;
	export let isFetching: boolean;
</script>

<div
	class="flex flex-col justify-center items-center w-full h-full bg-gray-900 fixed bg-opacity-50 z-10"
>
	<Spinner />
  <h1 class="text-white">
	{#if isLocked && isFetching === false}
		Attempting to unlock ...
	{:else if isLocked === false && isFetching === false}
		Attempting to lock ...
	{:else if isFetching === true}
    Fetching Data ...
  {/if}
</h1>
</div>
