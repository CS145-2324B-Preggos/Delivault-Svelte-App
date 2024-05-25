<!-- Sidebar.svelte -->
<script lang="ts">
    export let showSideBar = false;
    export let toggleSidebar: () => void;
</script>

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

    /* .navbar-backdrop {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    position: fixed;
     } */
</style>
