<script lang="ts">
	import '../app.postcss';

	import { PUBLIC_VAPID_KEY } from '$env/static/public';

	// Floating UI for Popups
	import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
	import { AppShell, AppBar, Toast, getToastStore, storePopup, initializeStores, Drawer, getDrawerStore } from '@skeletonlabs/skeleton';
	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });
	
	import Icon from '@iconify/svelte';

	// Auth event listener for Supabase
	import { goto, invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import AppHeaderAuthComponent from '$lib/components/AppHeaderAuthComponent.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';

	import { error } from '@sveltejs/kit';

	import toUint8Array from 'urlb64touint8array';

	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });
	initializeStores();
	const toastStore = getToastStore();

	export let data;
	// TODO: implement pushSubscription retrieval from server
	$: ({ session, supabase } = data);
	let { pushSubscription } = data;

	function askPermission() {
		return new Promise(function (resolve, reject) {
			const permissionResult = Notification.requestPermission(function (result) {
			resolve(result);
			});

			if (permissionResult) {
			permissionResult.then(resolve, reject);
			}
		}).then(function (permissionResult) {
			if (permissionResult !== 'granted') {
			throw new Error("We weren't granted permission.");
			}
		});
	}

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange((event, newSession) => {
			// don't do anything with the INITIAL_SESSION
			if (event !== 'INITIAL_SESSION'){ 
				if (!newSession) {
					/**
					 * Queue this as a task so the navigation won't prevent the
					 * triggering function from completing
					 */
					setTimeout(() => {
						goto('/', { invalidateAll: true });
					});
				}
				if (newSession?.expires_at !== session?.expires_at) {
					invalidate('supabase:auth');
				}
			}
		});

		// perform this flow iff a user is logged in
		if (session) {
			
			// only request permission if permission has not yet been granted
			if (Notification.permission != "granted") {
				toastStore.trigger(
					{
						message: "Notifications improve your experience",
						action: {
							label: "Allow",
							response: () => askPermission()
						}
					}
				)
			}
			
			// only request another subscription if a previous subscription does not yet exist or is outdated
			if (!pushSubscription) {
				// callback hell to grab the service worker registration, create a push subscription, and then to push the subscription to the server
				const registration = navigator.serviceWorker.getRegistration().then(
					(registration) => {
						registration ??= error(400, "Service Worker not properly registered")
						registration.pushManager.subscribe(
							{
								userVisibleOnly: true,
								applicationServerKey: toUint8Array(PUBLIC_VAPID_KEY)
							}
						).then(
							(newPushSubscription: PushSubscription) => {
								console.log(newPushSubscription)
								fetch('/api/push',{
									method: 'POST',
									headers: {
										'Content-type': 'application/json'
									},
									body: JSON.stringify(newPushSubscription)
								})
							}
						)
					}
				)


			}
		
		}

		return () => data.subscription.unsubscribe();
	});

	initializeStores();
	const drawerStore = getDrawerStore();

	function drawerOpen(): void {
		drawerStore.open({});
	}
</script>


<Toast />

<Drawer width='w-auto'>
	<Sidebar />
</Drawer>

<!-- App Shell -->
<AppShell 
	regionPage="bg-surface-500 text-black"
	slotSidebarLeft="w-0 lg:w-auto"
>
    <svelte:fragment slot="header">
        <!-- App Bar -->
        <AppBar 
			gridColumns="grid-cols-3" 
			background='bg-secondary-500' 
			slotTrail="place-content-end"
			slotLead="place-content-start"
		>
			<svelte:fragment slot="lead">
				<button class="lg:hidden mr-4" on:click={drawerOpen}>
					<Icon icon="mingcute:menu-fill" class="text-3xl" />
				</button>
				<nav>
					<ul>
						<a href="/"><strong class="h3 uppercase">
							<span class="text-primary-500">Deli</span>vault
						</strong></a>
					</ul>	
				</nav>
			</svelte:fragment>
            <svelte:fragment slot="trail">
                <AppHeaderAuthComponent supabase={supabase} />
            </svelte:fragment>
        </AppBar>
    </svelte:fragment>

    <!-- Sidebar -->
	<svelte:fragment slot="sidebarLeft">
			<Sidebar />
	</svelte:fragment>
    <!-- Page Route Content -->
    <slot />
</AppShell>

