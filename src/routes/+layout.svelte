<script lang="ts">
	import '../app.postcss';
	import { AppShell, AppBar, Toast, getToastStore, initializeStores } from '@skeletonlabs/skeleton';

	import Icon from '@iconify/svelte';
	
	// Floating UI for Popups
	import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';
	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });
	
	// Auth event listener for Supabase
	import { goto, invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import AppHeaderAuthComponent from '$lib/components/AppHeaderAuthComponent.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';

	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });
	initializeStores();
	const toastStore = getToastStore();

	export let data;
	$: ({ session, supabase } = data);
	let showSideBar: boolean;

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

    const toggleSidebar = () => {
        showSideBar = !showSideBar;
    };

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

		// only request permission if permission has not yet been granted, and the user is signed in
		if (Notification.permission != "granted" && session) {
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

		return () => data.subscription.unsubscribe();
	});

</script>

<Toast />

<!-- App Shell -->
<AppShell>
    <svelte:fragment slot="header">
        <!-- App Bar -->
        <AppBar  background='bg-primary-500' slotDefault="place-self-center">
            <svelte:fragment slot="lead">
                <button on:click={toggleSidebar} class="toggle-btn"><Icon icon="mingcute:menu-fill" /></button>
            </svelte:fragment>
			<strong class="text-xl uppercase">Delivault</strong>
            <svelte:fragment slot="trail">
                <AppHeaderAuthComponent supabase={supabase}/>
            </svelte:fragment>
        </AppBar>
    </svelte:fragment>
    <!-- Sidebar -->
    <Sidebar {showSideBar} on:click={toggleSidebar}/>
    <!-- Page Route Content -->
    <slot />
</AppShell>


<style>
    .toggle-btn {
        background: none;
        border: none;
        color: white;
        font-size: 1.5em;
        cursor: pointer;
        margin-right: 10px;
    }
    .toggle-btn:hover {
        color: #ccc;
    }
</style>