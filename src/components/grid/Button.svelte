<script>
    export let component;

    $: settings = component?.settings ?? {};
    $: buttonClass = `block-grid-item__component grid-button grid-button--${settings.type}`
    $: href = settings?.href ?? '/';
    $: target = settings?.target;
</script>

{#if settings?.isFormButton}
<button class={buttonClass} type="submit">
    {component.content}
</button>
{:else}
<a class={buttonClass} {href} {target}>
    {component.content}
</a>
{/if}
