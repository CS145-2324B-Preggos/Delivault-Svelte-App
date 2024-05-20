<script lang="ts">
	import smiley from './images/smileyface.jpg';
	import concerned from './images/gif.gif';

	let isLocked = true;

	const toggleIsLocked = () => {
		isLocked = !isLocked;
	};
</script>

{#if isLocked}
	<img alt="Smiley face" src={smiley} />
{:else}
	<img alt="Concerned face" src={concerned} />
{/if}

<div class="buttonContainer" on:click={toggleIsLocked}>
	<button>
		{#if isLocked}
			Unlock
		{:else}
			Lock
		{/if}
	</button>
</div>

<style>
	.buttonContainer {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
	}
</style>
