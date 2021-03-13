<script context="module">
    export async function load(ctx) {
        let { slug } = ctx.page.params;
        return {
            props: {
                slug,
            },
        };
    }
</script>

<script>
    import Page from "../components/Page.svelte";

    export let slug;
</script>

<Page {slug} />
