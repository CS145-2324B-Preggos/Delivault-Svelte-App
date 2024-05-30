<script lang="ts">
	import { onMount } from 'svelte';
	import { type BoxDBObj } from '$lib/classes/Box.js';
	import { getToastStore, type ToastSettings } from '@skeletonlabs/skeleton';
	import LoadingScreen from '../../../lib/components/loadingScreen.svelte';

	export let data;
	// load the database
	let { supabase } = data;
	let boxOfUser: BoxDBObj | any;
	// let loading = true;
	let isLocked: boolean;
	let isFetching: boolean;
	let isLoading: boolean = false;
	let errorLocking: boolean = true;
	let countdown: number = 5;

	const toastStore = getToastStore();

	
	const t: ToastSettings = {
		message: `The box will auto-lock in ${countdown} seconds.`,
		timeout: 1000,
		hoverable: true,
		hideDismiss: true,
	};

	// fetches the "box" table of the user and stores it in the 'boxOfUser' variable
	const fetchUserBoxEntry = async (box_id: string) => {
		const selectResponse = await fetch(`../../api/lock?box_id=${box_id}`, {
			method: 'GET',
			headers: {
				'content-type': 'application/json'
			}
		});

		const box = await selectResponse.json();
		console.log('boxgab: ', box);

		if (box.error) {
			console.log('Error fetching box table: ', box.error);

			t.message = "Error fetching box."
			t.background = "variant-filled-warning"
			toastStore.trigger(t);

		} else {
			boxOfUser = box.box[0];
			isLocked = boxOfUser.locked; // Assuming boxOfUser is an array with one element
			console.log('Box of user successfully fetched:');
			console.log(boxOfUser);
			console.log(isLocked);
		}
	};

	// as soon as the page starts, fetch the box of the user
	onMount(async () => {
		isFetching = true;
		isLoading = true;
		await fetchUserBoxEntry('1000000000000000'); // find a way to identify the specific box id of the current user, pero for now eto muna yung sa box natin
		isLoading = false;
		isFetching = false;
	});

	// updates the 'locked' field of a box database object
	const updateLockedField = async (box: BoxDBObj) => {
		const updateResponse = await fetch(`../../api/lock`, {
			method: 'PATCH',
			body: JSON.stringify([box]),
			headers: {
				'content-type': 'application/json'
			}
		});
		const response = await updateResponse.json();
		console.log('update response: ', response);

		if (response.success) {
			// Update the local state to reflect the change
			isLocked = boxOfUser.locked;
			errorLocking = false;

			t.message = "Lock toggle successful!";
			t.background='variant-filled-success';
			toastStore.trigger(t);

			return {
				success: response.success,
				msg: 'The box of user value is now updated to'
			};
		} else {

			errorLocking = true ;

			t.message = "Lock toggle failed.";
			t.background='variant-filled-warning';
			toastStore.trigger(t);

			return {
				success: response.success,
				msg: 'Updating of lock failed!'
			};
		}
	};

	const toggleIsLocked = async () => {
		isLoading = true;
		let newBox: BoxDBObj = {
			box_id: boxOfUser.box_id,
			user_id: boxOfUser.user_id,
			locked: false
		};

		const updateResponse = await updateLockedField(newBox);

		if (updateResponse.success) {
			await fetchUserBoxEntry('1000000000000000');
			console.log(updateResponse.msg, 'lock was toggled to', isLocked);
			console.log('Box closing in 5 seconds');

			countdown = 5;
			isLoading = false;
			// the box will close in five seconds

			// wait five seconds
			let interval = setInterval(() => {
				t.message = `The box will auto-lock in ${countdown} seconds.`
				t.background='variant-filled-secondary'
				toastStore.trigger(t);

				countdown--;
				if (countdown <= 0) {
					clearInterval(interval);
					// Lock the box after countdown ends
					isLoading = true;
					newBox = {
						box_id: boxOfUser.box_id,
						user_id: boxOfUser.user_id,
						locked: true
					};
					updateLockedField(newBox).then(async () => {
						await fetchUserBoxEntry('1000000000000000');
						isLoading = false;
					});
				}
			}, 1000);

		} else {
			isLoading = false;
			await fetchUserBoxEntry('1000000000000000');
			console.log(updateResponse.msg, 'lock is still', isLocked);
		}
	};
</script>

{#if isLoading}
	<LoadingScreen {isLocked} {isFetching} />
{/if}

<div class="buttonContainer">
	{#if isLocked}
		<!-- <img alt="Smiley face" src={smiley} /> -->
		<h1 class="m-2">Status: LOCKED</h1>
		<!-- <LockIcon class="icon" /> -->
		<img
			class="m-2"
			width="200px"
			src="https://www.svgrepo.com/download/532323/lock-alt.svg"
			alt="lock icon"
		/>
		<button class="toggleButton btn variant-filled-primary" on:click={toggleIsLocked}>
			Toggle Lock
		</button>
	{:else}
		<h1 class="m-2">Status: UNLOCKED</h1>
		<!-- <img alt="Concerned face" src={concerned} /> -->
		<!-- <UnlockIcon class="icon" /> -->
		<img
			class="m-2"
			width="200px"
			src="https://www.svgrepo.com/download/532341/unlock-alt.svg"
			alt="unlock icon"
		/>
		{#if errorLocking}
			<button class="toggleButton btn variant-filled-primary" on:click={toggleIsLocked}> Toggle Lock </button>
		{:else}
			<button class="toggleButton btn variant-filled-primary" disabled> Toggle Lock </button>
		{/if}
		
	{/if}
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
