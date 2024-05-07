<script lang="ts">
	import { goto } from "$app/navigation";
	
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
</script>

<div class="justify-self-end">
    {#key loggedInUID}
        {#await currentUser()}
            <p>Loading user details, stand by...</p>
        {:then user}
            {#if user == null}
                <button on:click={loginWithGoogle}>Login with Google</button>
            {:else}
                <h6 class="h6">You are currently logged in as {user} (<button class="underline" on:click={logoutOfGoogle}>Sign Out</button>)</h6>
                
            {/if} 
        {/await}
    {/key}
</div>
