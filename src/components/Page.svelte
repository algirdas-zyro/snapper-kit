<script>
    import { pages, blocks, components } from "../stores";
    import { cssVarsObjectToString } from "../utils/objectToCSSVars";
    import { getGridItemSize } from "../utils/getGridItemSize";
    import Grid from "./Grid.svelte";

    export let slug;

    const getComponent = (type) => {
        switch(type) {
            default: return Grid
        }
    };

    $: page = Object.entries($pages)
        .filter(([, { path }]) => path === `/${slug}`)
        .reduce(
            (acc, [pageId, page]) => ({
                ...page,
                id: pageId,
                blocks: page.blocks.map(blockId => ({
                    id: blockId,
                    ...$blocks[blockId],
                    computedStyle: cssVarsObjectToString($blocks[blockId].settings.styles),
                    components: $blocks[blockId].components.map(
                        componentId => ({
                            id: componentId,
                            // this returns { width, height }:
                            ...getGridItemSize($blocks[blockId], $components[componentId]?.settings?.styles?.position),
                            ...$components[componentId],
                        })
                    ),
                })),
            }),
            {}
        );
        
</script>

<svelte:head>
    <title>{page?.name}</title>
</svelte:head>

{#if page?.blocks}
<main>
    {#each page.blocks as block}
    <section class="block" style={block.computedStyle}>
        <svelte:component this={getComponent(block.type)} {block} />
    </section>
    {/each}
</main>
{/if}
