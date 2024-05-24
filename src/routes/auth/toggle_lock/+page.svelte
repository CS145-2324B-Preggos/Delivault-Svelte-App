<script lang="ts">
	// import smiley from './images/smileyface.jpg';
	// import concerned from './images/gif.gif';
	// import lockIcon from '~icons/mingcute/safe-lock-fill';
	import LockIcon from '~icons/mingcute/safe-lock-fill';
	import UnlockIcon from '~icons/mingcute/safe-lock-line';

	let isLocked = true;

	const toggleIsLocked = () => {
		isLocked = !isLocked;
	};
</script>

<div class="buttonContainer">
	{#if isLocked}
		<!-- <img alt="Smiley face" src={smiley} /> -->
		<h1>Status: LOCKED</h1>
		<LockIcon class="icon" />
	{:else}
		<h1>Status: UNLOCKED</h1>
		<!-- <img alt="Concerned face" src={concerned} /> -->
		<UnlockIcon class="icon" />
	{/if}
	<button class="toggleButton" on:click={toggleIsLocked}>
		{#if isLocked}
			Click to Unlock
		{:else}
			Click to Lock
		{/if}
	</button>
</div>

<style>
	.buttonContainer {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
	}

	.icon {
		width: '192px';
		height: '192px';
	}

	.toggleButton {
		margin: 20px;
		border: solid;
		border-color: aliceblue;
		border-radius: 10px;
		padding: 5px;
	}
</style>
