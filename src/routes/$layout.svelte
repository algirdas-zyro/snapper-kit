<script context="module">
    import { setWebsite } from "../stores";

    export async function load(ctx) {
        // const res = await ctx.fetch("./data.json");
        const res = await ctx.fetch("./json/perf--images.json");
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

    $:computedStyle = cssVarsObjectToString($styles ?? {});
    $:usedFontWeights = pickUsedFontWeights($styles ?? {});
    $:usedFontNames = websiteFontNames($styles?.font);
    $:familyQuery = constructMetaFont(usedFontNames, usedFontWeights);
    $:googleFontHref = `https://fonts.googleapis.com/css?family=${familyQuery}&display=swap`;

    // metaInfo.link.push({
	// 				rel: 'preconnect',
	// 				href: 'https://fonts.gstatic.com',
	// 				crossorigin: true,
	// 			}, {
	// 				rel: 'preload',
	// 				as: 'style',
	// 				href: this.googleFontHref,
	// 			}, {
	// 				rel: 'stylesheet',
	// 				href: this.googleFontHref,
	// 				media: 'print',
	// 				// Only remove media attribute at runtime, not on prerendering. During prerender media stays 'print'
	// 				onload: "if(!window._isAppPrerendering)this.onload=null;this.removeAttribute('media');",
	// 			});
</script>

<svelte:head>
    <title>Generic title</title>
    <link rel="stylesheet" href={googleFontHref} media="print" onload="if(!window._isAppPrerendering)this.onload=null;this.removeAttribute('media')">
</svelte:head>

<div style={computedStyle}>
    <header class="preview__sticky">
        <Ribbon />
        <Nav />
    </header>
    <slot />
</div>
