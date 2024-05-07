<script lang="ts">
	import '../app.postcss';
	import { AppShell, AppBar } from '@skeletonlabs/skeleton';
	
	// Floating UI for Popups
	import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';
	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });
	
	// Auth event listener for Supabase
	import { goto, invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import AppHeaderAuthComponent from '$lib/components/AppHeaderAuthComponent.svelte';

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
<AppShell>
	<svelte:fragment slot="header">
		<!-- App Bar -->
		<AppBar>
			<svelte:fragment slot="lead">
				<strong class="text-xl uppercase">Skeleton</strong>
			</svelte:fragment>
			<svelte:fragment slot="trail">
				<AppHeaderAuthComponent supabase={supabase}/>
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<!-- Page Route Content -->
	<slot />
</AppShell>
