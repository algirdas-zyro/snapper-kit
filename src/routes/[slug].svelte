<script context="module">
    export const load = async (ctx) => ({
        props: {
            slug: ctx.page.params.slug,
        },
    })
</script>

<script>
    import Page from "../components/Page.svelte";

    export let slug;
</script>

<Page {slug} />
