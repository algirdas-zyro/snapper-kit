<script>
    export let data;

    $: settings = data.settings;
    $: buttonClass = `block-grid-item__component grid-button grid-button--${settings.type}`
    $: isFormButton = settings?.isFormButton ?? false;
    $: href = settings?.href ?? '/';
    $: target = settings?.target;
</script>

{#if isFormButton}
<button class={buttonClass} type="submit">
    {data.content}
</button>
{:else}
<a class={buttonClass} {href} {target}>
    {data.content}
</a>
{/if}
