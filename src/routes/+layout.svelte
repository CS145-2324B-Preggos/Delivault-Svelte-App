<script lang="ts">
	import '../app.postcss';
	import { AppShell, AppBar } from '@skeletonlabs/skeleton';
	
	// Floating UI for Popups
	import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
	import { storePopup, initializeStores, Drawer, getDrawerStore } from '@skeletonlabs/skeleton';
	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });
	
	import Icon from '@iconify/svelte';

	// Auth event listener for Supabase
	import { goto, invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import AppHeaderAuthComponent from '$lib/components/AppHeaderAuthComponent.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';

	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });

	export let data;
	$: ({ session, supabase } = data);

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

		return () => data.subscription.unsubscribe();
	});

	initializeStores();
	const drawerStore = getDrawerStore();

	function drawerOpen(): void {
		drawerStore.open({});
	}
</script>

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
			background='bg-primary-500' 
			slotTrail="place-content-end"
			slotLead="place-content-start"
		>
			<svelte:fragment slot="lead">
				<button class="lg:hidden" on:click={drawerOpen}>
					<Icon icon="mingcute:menu-fill" class="text-3xl" />
				</button>
				<nav>
					<ul>
						<a href="/"><strong class="text-xl uppercase">Delivault</strong></a>
					</ul>	
				</nav>
			</svelte:fragment>
            <svelte:fragment slot="trail">
                <AppHeaderAuthComponent supabase={supabase}/>
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

