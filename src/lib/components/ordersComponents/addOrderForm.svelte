<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { getToastStore, type ToastSettings } from '@skeletonlabs/skeleton';

	let dispatch = createEventDispatcher();

	let orderName: string = '';
	// let expectedDeliveryDate: string = '';
	let courierContactDetails: string = '';
	let passcode: string = '';
	let isDisabled: boolean = false;
	let errorMessage: string = '';
	let showErrorMessage: boolean = false;


	let waitToast = () => {
		dispatch('waitToast');
	};

	let handleSubmit = () => {
		isDisabled = true;
		// validation code
		if (!orderName || !courierContactDetails || !passcode) {
			errorMessage = 'Please fill out all fields before submitting.';
			showErrorMessage = true;
			return;
		}

		const orderDetail = {
			order_name: orderName,
			// expected_delivery_date: expectedDeliveryDate,
			courier_contact_details: courierContactDetails,
			password: passcode
		};
		console.log('Order Detail:', orderDetail);

		dispatch('addOrderFormSubmit', orderDetail);
	};

	let generateCode = () => {
		passcode = '';
		const codeLength = 8;
		const characters = '0123456789ABCD';

		let result = '';
		for (let i = 0; i < codeLength; i++) {
			result += characters.charAt(Math.floor(Math.random() * characters.length));
		}
		passcode = result;
		hideErrorMessage();
	};

	let handleCancel = () => {
		dispatch('cancelClick');
	};

	const hideErrorMessage = () => {
		showErrorMessage = false;
	};
</script>

<div class="display: flex flex-col p-6 bg-secondary-500 rounded-xl">
	<h4 class="self-center font-bold text-xl text-primary-500">Add Order</h4>
	<form on:submit|preventDefault={handleSubmit} class="form">
		<label for="orderName" class="mt-2 text-white">Order Name</label>
		<input
			type="text"
			id="orderName"
			placeholder="Enter Order Name"
			bind:value={orderName}
			on:input={hideErrorMessage}
			class="rounded-3xl text-secondary-500"
		/>
		<label for="courierContactDetails" class="mt-2 text-white">Courier Contact Details</label>
		<input
			type="text"
			id="courierContactDetails"
			placeholder="09XX XXX XXXX"
			on:input={hideErrorMessage}
			bind:value={courierContactDetails}
			class="rounded-3xl text-secondary-500"
		/>
		<label for="passcode" class="mt-2 text-white">Passcode</label>
		<div class="passcodeSegment">
			<button on:click|preventDefault={generateCode} class="bg-primary-500 rounded-full text-white p-3">
				Generate Code
			</button>
			<input
				type="text"
				id="passcode"
				bind:value={passcode}
				on:change={hideErrorMessage}
				readonly
				class="rounded-3xl ml-2 text-secondary-500"
			/>
		</div>
		<div class="flex mt-5 justify-center items-center gap-10">
			<div>
				<button
					type="button"
					on:click={handleCancel}
					class="bg-secondary-500 text-white p-3 w-20 rounded-full border-white border-solid border-2">Cancel</button
				>
			</div>
			{#if isDisabled}
			<div>
				<button type="button" on:click={waitToast}>Submit</button>
			  </div>
			{:else}
				<div class="submitButton">
					<input type="submit" value="Submit" disabled={isDisabled} class="bg-primary-500 rounded-full text-white p-3"/>
				</div>
			{/if}
		  </div>
	</form>
	{#if showErrorMessage}
		<p class="errorMessage">{errorMessage}</p>
	{/if}
</div>

<style>
	.submitSegment {
		display: flex;
		margin: 10px;
		justify-content: center;
		align-items: center;
		gap: 10px;
	}

	.passcodeSegment {
		display: flex;
	}

	.orderFieldsContainer {
		display: flex;
		flex-direction: column;
		background: white;
		text-align: center;
		padding: 20px;
	}

	.form {
		display: flex;
		flex-direction: column;
	}

	.errorMessage {
		color: red;
	}

</style>
