<script>
    import { pages, blocks, components } from "../stores";

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

<div>{page.name}</div>
