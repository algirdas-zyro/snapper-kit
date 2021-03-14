<script>
    import { cssVarsObjectToString } from "../utils/objectToCSSVars";
    import TextBox from "./grid/TextBox.svelte";
    import Button from "./grid/Button.svelte";

    export let components;

    const getComponent = (type) => {
        switch(type) {
            case 'GridButton': return Button
            default: return TextBox
        }
    };
</script>

{#if components}
<div class="block-grid">
    {#each components as component}
    <div class="block-grid-item" style={cssVarsObjectToString(component.settings.styles)}>
        <svelte:component this={getComponent(component.type)} data={component} />
    </div>
    {/each}
</div>
{/if}
