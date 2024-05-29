<script lang="ts">
	import { AppShell } from '@skeletonlabs/skeleton';

	export let loggedInUID: null | string = "null";
	// export let boxExist = false;
	export let boxOnline = false;
    export let boxID:string, registeredBox;

	let masterkeyToggle = false;
	let originalMasterkey:string;
	let newMasterkey:string;

	const editMasterkey = async () => {
		masterkeyToggle = false;

		const boxPasscode = {
			box_id: "1000000000000000", // hardcoded for now
			masterkey: newMasterkey
		}
		const publishMasterKey = await fetch(`../../api/masterkey`, {
			method: 'PATCH',
			body: JSON.stringify([boxPasscode]),
			headers: {
				'content-type': 'application/json'
			}
		});

		const publishResponse = await publishMasterKey.json();
		if (publishResponse.success) {
			originalMasterkey = newMasterkey;
		}
    };

	const toggleKeyEdit = () => {
        masterkeyToggle = true;
    };

	const registerBox = () => { // registerbox function :D
        registeredBox = boxID;
    };
	// const currentUser = async () => {
    //     const {data, _} = await supabase.auth.getUser()
    //     loggedInUID = data.user?.id ?? null
    //     loaded = true
    //     return data.user?.email
    // }
</script>

<AppShell regionPage="flex flex-col pt-3 p-20 place-self-center">
	<!-- <div class="border-solid border-8 w-max"> -->
		<h2 class="h2 text-center mb-7">Welcome to DeliVault!</h2>
		{#key loggedInUID}
			<div class="flex flex-col card variant-ghost-primary w-full h-3/5 p-10 lg:p-20 place-content-center text-center">
			{#await true} <!--replace true with currentUser function-->
					<p>Loading user details, stand by...</p>
			{:then user}
				{#if user == null}
					<p>Please log in to continue.</p>
				{:else}
					<p class='mb-5'>You are currently logged in as <strong>{user}</strong>.</p>

					{#await true} <!--replace true with boxExist function-->
						<p>Fetching box, stand by...</p>
					{:then box}
						{#if box != null} 
							Your box is {boxOnline ? 'online' : 'offline'}.

							{#if masterkeyToggle}
								<div class="flex flex-row">
									<div class="flex-grow place-self-center pt-2">
										<input 
											class="input" 
											type="text" 
											bind:value={newMasterkey}
											placeholder="Masterkey" 
										/> 
									</div>
									<div class="ml-2">
										<button 
											type="button" 
											class="btn variant-filled-primary mt-2 text-xs lg:text-base "
											on:click={() => editMasterkey()}
										>Confirm
										</button>
									</div>
								</div>
							{:else}
								<button 
									type="button" 
									class="btn variant-filled-primary mt-2 w-full"
									on:click={() => toggleKeyEdit()}
								>Edit Masterkey
								</button>
							{/if}
						{:else}
							Please register your box.
							
							<div class="flex flex-row">
								<div class="flex-grow place-self-center pt-2">
									<input 
										class="input" 
										type="text" 
										placeholder="Input Box ID" 
										bind:value={boxID}/> 
								</div>
								<div class="ml-2">
									<button 
										type="button" 
										class="btn variant-filled-primary deliverBut mt-2"
										on:click={() => registerBox()}
									>Confirm
									</button>
								</div>
							</div>
						{/if} 
					{/await}
				{/if} 
			{/await}
			</div>
		{/key}
	<!-- </div> -->

</AppShell>
