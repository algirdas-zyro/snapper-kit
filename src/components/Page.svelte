<script>
    import { pages, blocks, components, styles } from "../stores";
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
                    computedBlockStyle: cssVarsObjectToString($blocks[blockId].settings.styles),
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

<!--
    <svelte:head>
    <link
        rel="stylesheet"
        href="https://raw.githack.com/bradtraversy/svelte-scoreboard/master/public/global.css"
    />
</svelte:head>
-->

{#if page?.blocks}
<main>
    {#each page.blocks as {type, computedBlockStyle, components}, i}
    <section class="block" style={computedBlockStyle}>
        <svelte:component this={getComponent(type)} components={components} />
    </section>
    {/each}
</main>
{/if}
