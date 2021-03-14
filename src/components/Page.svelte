<script>
    import { pages, blocks, components, styles } from "../stores";
    import { cssVarsObjectToString } from "../utils/objectToCSSVars";

    export let slug;

    $: page = Object.entries($pages)
        .filter(([, { path }]) => path === `/${slug}`)
        .reduce(
            (acc, [pageId, page]) => ({
                ...page,
                id: pageId,
                blocks: page.blocks.map(blockId => ({
                    id: blockId,
                    components: $blocks[blockId].components.map(
                        componentId => ({
                            id: componentId,
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

<main>



    {#each page?.blocks as block, i}
    <li>
        {console.log(block)}
    </li>
    {/each}

</main>
