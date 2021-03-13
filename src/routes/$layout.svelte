<script context="module">
    // import fetch from 'cross-fetch';
    import { setWebsite } from "../stores";

    // export async function load({ fetch }) {
    export async function load(ctx) {
        // const res = await fetch("./data.json");
        const res = await ctx.fetch("./data.json");
        const websiteData = await res.json();

        setWebsite(websiteData);
    }
</script>

<script>
    import { navItems } from "../stores";
</script>

<main>
    <nav>
        {#each $navItems as item}
            <li>
                <a href={item.path}>{item.name}</a>
            </li>
        {/each}
    </nav>
    <slot />
</main>
