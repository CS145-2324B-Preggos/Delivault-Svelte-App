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
