<script context="module">
    import { setWebsite } from "../stores";

    export async function load(ctx) {
        const res = await ctx.fetch("./data/wells.json");
        // const res = await ctx.fetch("./data/perf--images.json");
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
    import {
        constructMetaFont,
        pickUsedFontWeights,
        websiteFontNames,
    } from '../utils/font';

    $:computedStyle = cssVarsObjectToString($styles);
    $:usedFontWeights = pickUsedFontWeights($styles);
    $:usedFontNames = websiteFontNames($styles.font);
    $:familyQuery = constructMetaFont(usedFontNames, usedFontWeights);
    $:googleFontHref = `https://fonts.googleapis.com/css?family=${familyQuery}&display=swap`;

</script>

<svelte:head>
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="preconnect" href="https://assets.zyrosite.com" crossorigin>
    <link rel="preload" as="style" href={googleFontHref}>
    <link rel="stylesheet" href={googleFontHref} media="print" onload="if(!window._isAppPrerendering)this.onload=null;this.removeAttribute('media')">
</svelte:head>

<div style={computedStyle}>
    <header class="preview__sticky">
        <Ribbon />
        <Nav />
    </header>
    <slot />
</div>
