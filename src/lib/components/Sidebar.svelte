<<<<<<< HEAD
<!-- Sidebar.svelte -->
<script lang="ts">
	export let showSideBar = false;
	export let toggleSidebar: () => void;
</script>

{#if showSideBar}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div class="navbar-backdrop" on:click|self>
		<aside class="sidebar {showSideBar ? 'is-open' : ''}">
			<button class="close-btn" on:click={toggleSidebar}>Close</button>
			<nav>
				<ul>
					<li><a href="/">Home</a></li>
					<li><a href="/auth/toggle_lock">Box lock</a></li>
					<li><a href="/auth/orders">Your orders</a></li>
					<!-- Add more links as needed -->
				</ul>
			</nav>
		</aside>
	</div>
{/if}

<style>
	.sidebar {
		position: fixed;
		top: 0;
		left: -250px;
		width: 250px;
		height: 100%;
		background: #333;
		color: #fff;
		transition: left 0.3s ease;
		padding: 20px;
		box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
	}
	.sidebar.is-open {
		left: 0;
	}
	.close-btn {
		background: #444;
		color: #fff;
		border: none;
		padding: 10px;
		cursor: pointer;
	}
	.close-btn:hover {
		background: #555;
	}
	nav ul {
		list-style: none;
		padding: 0;
	}
	nav ul li {
		margin: 15px 0;
	}
	nav ul li a {
		color: #fff;
		text-decoration: none;
	}
	nav ul li a:hover {
		text-decoration: underline;
	}

	.navbar-backdrop {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    position: fixed;
     }
</style>
=======
<script lang='ts'>
    import { AppRail, AppRailAnchor } from '@skeletonlabs/skeleton';
    import Icon from '@iconify/svelte';
    import { page } from '$app/stores'
    import { getDrawerStore } from "@skeletonlabs/skeleton";

    const drawerStore = getDrawerStore();

    function drawerClose(): void {
        drawerStore.close();
    }
</script>

<AppRail background="bg-tertiary-500">
    <!-- menu close button (only shows on mobile) -->
    <AppRailAnchor title="Menu" class="lg:hidden" on:click={drawerClose}>
        <svelte:fragment slot="lead"><Icon icon="mingcute:menu-fill" class="text-3xl" /></svelte:fragment>
    </AppRailAnchor>    

    <!-- main sidebar -->
    <AppRailAnchor href="/" selected={$page.url.pathname === '/'} title="Home" on:click={drawerClose}>
        <svelte:fragment slot="lead"><Icon icon="ic:round-home" class="text-3xl"/></svelte:fragment>
        <span>Home</span>
    </AppRailAnchor>
    <AppRailAnchor href="/private/toggle_lock" selected={$page.url.pathname === '/private/toggle_lock'} title="Lock" on:click={drawerClose}>
        <svelte:fragment slot="lead"><Icon icon="mingcute:lock-fill" class="text-3xl"/></svelte:fragment>
        <span>Lock</span>
    </AppRailAnchor>
    <AppRailAnchor href="/private/orders" selected={$page.url.pathname === '/private/orders'} title="Home" on:click={drawerClose}>
        <svelte:fragment slot="lead"><Icon icon="mingcute:list-check-3-fill" class="text-3xl"/></svelte:fragment>
        <span>Orders</span>
    </AppRailAnchor>
</AppRail>
>>>>>>> main
