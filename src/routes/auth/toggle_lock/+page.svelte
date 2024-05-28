<script lang="ts">
	// import smiley from './images/smileyface.jpg';
	// import concerned from './images/gif.gif';
	// import lockIcon from '~icons/mingcute/safe-lock-fill';
	import  lockIcon from '../../../../static/assets/icons/lock_svg.svg'
	import LockIcon from '~icons/mingcute/safe-lock-fill';``	
	import UnlockIcon from '~icons/mingcute/safe-lock-line';
	import { createClient } from '@supabase/supabase-js';
	import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
	import { onMount } from 'svelte';
	import type { BoxDBObj } from '$lib/classes/Box.ts';

	// load the database
	let supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);
	let boxOfUser: BoxDBObj | any;
	// let loading = true;
	let isLocked:boolean;

	// fetches the "box" table of the user and stores it in the 'boxOfUser' variable
	const fetchUserBoxEntry = async (box_id: string) => {
		try {
			let { data, error } = await supabase.from('box').select().eq('box_id', box_id).single();
			if (error) {
				console.log('Error fetching box table: ', error);
			} else {
				boxOfUser = data;
					isLocked = boxOfUser.locked
					console.log('Box of user successfully fetched:');
					console.log(boxOfUser);
					console.log(isLocked);
				}
		} catch (err) {
			console.log('Unexpected Error: ', err);
		}
	};

	// as soon as the page starts, fetch the box of the user
	onMount(async () => {
		fetchUserBoxEntry('0000000000000000'); // find a way to identify the specific box id of the current user, pero for now eto muna yung sa box natin
	});

	// updates the 'locked' field of a box database object
	const updateLockedField = async (box: BoxDBObj) => {
		// executes a query to update the box database
		await supabase
			.from('box')
			.update({
				locked: !box.locked
			})
			.eq('box_id', box.box_id);
		console.log('database successfullly updated');
		// fetch the box of the user again to have updated values
		await fetchUserBoxEntry(boxOfUser.box_id);
		console.log('The box of user value is now updated');
	};

	const toggleIsLocked = () => {
		isLocked = !isLocked;
		console.log('lock was toggled to', isLocked);
		updateLockedField(boxOfUser);
	};
</script>

<div class="buttonContainer">
	{#if isLocked}
		<!-- <img alt="Smiley face" src={smiley} /> -->
		<h1>Status: LOCKED</h1>
		<!-- <LockIcon class="icon" /> -->
		<img src='https://img.icons8.com/?size=100&id=94&format=png&color=000000' alt="lock icon" />
	{:else}
		<h1>Status: UNLOCKED</h1>
		<!-- <img alt="Concerned face" src={concerned} /> -->
		<!-- <UnlockIcon class="icon" /> -->
		<img src='https://img.icons8.com/?size=100&id=152&format=png&color=000000' alt="unlock icon" />

	{/if}
	<button class="toggleButton btn variant-filled-primary" on:click={toggleIsLocked}>
		Toggle Lock
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
		/* margin: 20px; */
		border: solid;
		border-color: aliceblue;
		border-radius: 10px;
		padding: 5px;
	}
</style>
