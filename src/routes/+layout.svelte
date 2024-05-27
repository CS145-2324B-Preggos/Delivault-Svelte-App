<script lang="ts">
	import '../app.postcss';
	import { AppShell, AppBar, AppRail, AppRailAnchor } from '@skeletonlabs/skeleton';

	import Icon from '@iconify/svelte';
	
	// Floating UI for Popups
	import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';
	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });
	
	// Auth event listener for Supabase
	import { goto, invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import AppHeaderAuthComponent from '$lib/components/AppHeaderAuthComponent.svelte';
	import { page } from '$app/stores'

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
</script>


<!-- App Shell -->
<AppShell regionPage="bg-surface-500 text-black">
    <svelte:fragment slot="header">
        <!-- App Bar -->
        <AppBar gridColumns="grid-cols-3" background='bg-primary-500' slotTrail="place-content-end">
			<svelte:fragment slot="lead">
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
		<AppRail background="bg-tertiary-500">
			<AppRailAnchor href="/" selected={$page.url.pathname === '/'} title="Home">
				<svelte:fragment slot="lead"><Icon icon="ic:round-home" class="text-3xl"/></svelte:fragment>
				<span>Home</span>
			</AppRailAnchor>
			<AppRailAnchor href="/auth/toggle_lock" selected={$page.url.pathname === '/auth/toggle_lock'} title="Lock">
				<svelte:fragment slot="lead"><Icon icon="mingcute:lock-fill" class="text-3xl"/></svelte:fragment>
				<span>Lock</span>
			</AppRailAnchor>
			<AppRailAnchor href="/auth/orders" selected={$page.url.pathname === '/auth/orders'} title="Home">
				<svelte:fragment slot="lead"><Icon icon="mingcute:list-check-3-fill" class="text-3xl"/></svelte:fragment>
				<span>Orders</span>
			</AppRailAnchor>
		</AppRail>
	</svelte:fragment>
    <!-- Page Route Content -->
    <slot />
</AppShell>

