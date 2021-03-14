<script>
    import { cssVarsObjectToString } from "../utils/objectToCSSVars";
	import { getOptimizedSrc } from '../utils/getSrcsets';

    import TextBox from "./grid/TextBox.svelte";
    import Button from "./grid/Button.svelte";
    import Image from "./grid/Image.svelte";

    export let block;

    const getImagesBackgroundCSSVariables = (backgroundImage) => {
        // const dpi = window?.devicePixelRatio ?? 1;
        const dpi = 1;
        const responsiveImages = {
            image360: getOptimizedSrc(backgroundImage, { width: 360 * dpi }),
            image1440: getOptimizedSrc(backgroundImage, { width: 1440 * dpi }),
            image1920: getOptimizedSrc(backgroundImage, { width: 1920 * dpi }),
        };

        return {
            'background-360': `url(${responsiveImages.image360})`,
            'background-1440': `url(${responsiveImages.image1440})`,
            'background-1920': `url(${responsiveImages.image1920})`,
        };
    };

    $: components = block?.components;
    $: background = block?.background;
    $: backgroundVariables = background.current === 'image'
        ? getImagesBackgroundCSSVariables(background.image)
        : { 'background': background.color };
    $: backgroundStyles = {
        'margin-top': 0,
        'attachment': block.settings.styles?.attachment ?? 'unset',
        'background-overlay-opacity': 0,
        ...backgroundVariables,
    };


    const getComponent = (type) => {
        switch(type) {
            case 'GridImage': return Image
            case 'GridButton': return Button
            default: return TextBox
        }
    };
</script>

{#if block?.background?.current}
<div class="background" style={cssVarsObjectToString(backgroundStyles)}/>
{/if}

{#if components}
<div class="block-grid">
    {#each components as component}
    <div class="block-grid-item" style={cssVarsObjectToString(component.settings.styles)}>
        <svelte:component this={getComponent(component.type)} component={component} />
    </div>
    {/each}
</div>
{/if}
