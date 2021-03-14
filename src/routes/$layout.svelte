<script context="module">
    import { setWebsite } from "../stores";

    export async function load(ctx) {
        const res = await ctx.fetch("./data.json");
        const websiteData = await res.json();

        setWebsite(websiteData);
    }
</script>

<script>
    import 'lazysizes';
    import Ribbon from "../components/Ribbon.svelte";
    import Nav from "../components/Nav.svelte";
    import { styles } from "../stores";
    import { cssVarsObjectToString } from "../utils/objectToCSSVars";

    $: computedStyle = cssVarsObjectToString($styles);
</script>

<div style={computedStyle}>
    <!-- add mobile observer -->
    <header class="preview__sticky">
        <Ribbon />
        <Nav />
    </header>
    <slot />
</div>
