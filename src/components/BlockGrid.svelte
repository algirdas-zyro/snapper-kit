<script>
    import { cssVarsObjectToString } from "../utils/objectToCSSVars";
    import GridTextBox from "./grid/GridTextBox.svelte";
    import GridButton from "./grid/GridButton.svelte";

    export let components;

    const getComponent = (type) => {
        switch(type) {
            case 'GridButton': return GridButton
            default: return GridTextBox
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
