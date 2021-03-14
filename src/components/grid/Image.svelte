<script>
	import { createEventDispatcher } from 'svelte';
	import {
        getOptimizedSrc,
        getGridItemSrcset,
        getGridItemSizes
    } from '../../utils/getSrcsets';
	import { parseCSSSides } from '../../utils/parseCSSSides';

    export let component;
    export let mobileBlockPadding = '0 16px'; // not imlemented yet
    export let isUnstyled = false; // not imlemented
    export let preventDrag = true; // not imlemented

    const dispatch = createEventDispatcher(); 

    $: settings = component.settings;

    $: alt = settings?.alt;
    $: width = component?.width;
    $: height = component?.height;

    $: mobilePaddingRight = parseCSSSides(mobileBlockPadding ?? '')?.right;
    $: mobilePadding = mobilePaddingRight ? Number.parseInt(mobilePaddingRight, 10) : null;
    
    $: shouldContain = settings?.styles['object-fit'] === 'contain';

    $: src = getOptimizedSrc(settings.image, { width, height, shouldContain });
    $: srcset = getGridItemSrcset(settings.image, { width, height, shouldContain });
    $: sizes = getGridItemSizes(width, mobilePadding);
</script>

<div
    class:image={!isUnstyled}
    class:image--unstyled={isUnstyled}
    on:click={(e) => dispatch('image-click',e)}
>
    <img
        alt={alt}
        data-src={src}
        data-srcset={srcset}
        data-sizes={sizes}
        height="height"
        width="width"
        class="lazyload"
        class:image__image={!isUnstyled}
        class:image__image--unstyled={isUnstyled}
        on:drag={e => preventDrag && e.preventDefault()}
        on:dragstart={e => preventDrag && e.preventDefault()}
    >
</div>
