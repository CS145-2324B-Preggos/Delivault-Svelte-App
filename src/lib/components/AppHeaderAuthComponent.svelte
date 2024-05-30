<script lang="ts">
	import { goto } from "$app/navigation";
    
    import { popup } from '@skeletonlabs/skeleton';
    import type { PopupSettings } from '@skeletonlabs/skeleton';
			

    import Icon from "@iconify/svelte";
	
	export let redirectLink: string = "/";
    export let loggedInUID: null | string = null;
    export let loaded = false;
    export let supabase;

    const loginWithGoogle = () => {
        supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: redirectLink,
            }
        })
    }

    const logoutOfGoogle = async () => {
        supabase.auth.signOut();
        loggedInUID = null;
        await goto("/");
    }

    const currentUser = async () => {
        const {data, _} = await supabase.auth.getUser()
        loggedInUID = data.user?.id ?? null
        loaded = true
        return data.user?.email
    }

    const loadingPopup: PopupSettings = {
	event: 'click',
	target: 'loadingPopup',
	placement: 'bottom'
    };

    const userPopup: PopupSettings = {
	event: 'click',
	target: 'userPopup',
	placement: 'bottom'
    };

</script>

<div class="justify-self-end">
    {#key loggedInUID}
        {#await currentUser()}
            <button type="button" class="btn-icon variant-ghost-tertiary button" use:popup={loadingPopup}>
                <Icon icon="svg-spinners:6-dots-scale" />
            </button>
            <div class="card p-4 variant-filled-secondary" data-popup="loadingPopup">
                <div class="arrow variant-filled-secondary" />
                <p>Loading user details, stand by...</p>
            </div>
            
        {:then user}
            {#if user == null}
                <button type="button" class="btn variant-ghost-tertiary buttonUser" on:click={loginWithGoogle}>Login</button>
            {:else}
                <button type="button" class="btn-icon variant-ghost-tertiary " use:popup={userPopup}>
                    <Icon icon="solar:user-bold" />
                </button>
                <div class="card p-4 w-1/2 lg:w-1/6 variant-filled-secondary text-center" data-popup="userPopup">
                    <div class="arrow variant-filled-secondary" />
                    <h6 class="h6 mx-2">You are currently logged in as {user} </h6>
                    <hr class="opacity-50 my-4" />
                    <button 
                        type='button'
                        class="btn variant-filled-tertiary text-sm button" 
                        on:click={logoutOfGoogle}
                    >Sign Out
                    </button>
                </div>
                
            {/if} 
        {/await}
    {/key}
</div>

<style>
    .buttonUser {
        border-color: white;
        border-radius: 0.5;
    }

</style>