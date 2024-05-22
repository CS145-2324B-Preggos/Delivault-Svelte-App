<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	let dispatch = createEventDispatcher();

	let orderName: string = '';
	// let expectedDeliveryDate: string = '';
	let courierContactDetails: string = '';
	let passcode: string = '';
	let isDisabled: boolean = false;
	let errorMessage: string = '';
	let showErrorMessage: boolean = false;

	let handleSubmit = () => {
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
		const codeLength = 8;
		const characters = '0123456789ABCD';

		let result = '';
		for (let i = 0; i < codeLength; i++) {
			result += characters.charAt(Math.floor(Math.random() * characters.length));
		}
		passcode = result;
		isDisabled = true;
		hideErrorMessage();
	};

	let handleCancel = () => {
		dispatch('cancelClick');
	};

	const hideErrorMessage = () => {
		showErrorMessage = false;
	};
</script>

<div class="orderFieldsContainer">
	<h4>Add Order</h4>
	<form on:submit|preventDefault={handleSubmit} class="form">
		<label for="orderName">Order Name</label>
		<input
			type="text"
			id="orderName"
			placeholder="Enter Order Name"
			bind:value={orderName}
			on:input={hideErrorMessage}
		/>
		<!-- <label for="expectedDeliveryDate">Expected Delivery Date</label>
		<input
			type="date"
			id="expectedDeliveryDate"
			placeholder="Expected Delivery Date"
			on:input={hideErrorMessage}
			bind:value={expectedDeliveryDate}
		/> -->
		<label for="courierContactDetails">Courier Contact Details</label>
		<input
			type="text"
			id="courierContactDetails"
			placeholder="09XX XXX XXXX"
			on:input={hideErrorMessage}
			bind:value={courierContactDetails}
		/>
		<label for="passcode">Passcode</label>
		<div class="passcodeSegment">
			<button on:click|once|preventDefault={generateCode} disabled={isDisabled}>
				Generate Code
			</button>
			<input
				type="text"
				id="passcode"
				bind:value={passcode}
				on:change={hideErrorMessage}
				readonly
			/>
		</div>
		<div class="submitSegment">
			<div>
			  <button type="button" on:click={handleCancel}>Cancel</button>
			</div>
			<div>
			  <input type="submit" value="Submit" />
			</div>
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
		gap: 20px;
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

	/* Style input fields */
	input[type="text"],
	input[type="submit"] {
		color: blue; /* Change font color for input text and submit button */
	}

	/* Style buttons */
	button {
		color: black; /* Change font color for buttons */
	}

	/* Style h4 elements */
	h4 {
    color: black; /* Change font color for h4 */
	}

	/* Style label elements */
	label {
		color: rgb(113, 108, 98); /* Change font color for labels */
	}

</style>
