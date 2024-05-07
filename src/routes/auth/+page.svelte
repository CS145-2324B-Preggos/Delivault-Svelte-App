<script lang="ts">
    import type { PageData } from '../auth/$types';
    
    export let data: PageData;

    let { supabase } = data;

    const loginWithOAuth = () => {
        supabase.auth.signInWithOAuth({
            provider: 'google',
        })
    }
</script>

<div class="container h-full flex justify-center items-center mx-auto prose-invert">
    <div class="container w-auto p-10 mx-auto flex flex-col items-center bg-surface-900/30 rounded-xl">
        <h3 class="h3">Welcome to DeliVault.</h3>
        <h5 class="h5">Please log in using one of our auth providers:</h5>
        <div class="m-4">
            <button class="btn variant-filled-secondary" on:click={loginWithOAuth}>Google</button>
        </div>
    </div>
</div>