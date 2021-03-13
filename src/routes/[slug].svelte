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
    import { pages } from "../stores";

    export let slug;

    $: page = Object.entries($pages).reduce((acc, [id, value]) => {
        if (value.path === `/${slug}`) {
            return { ...value, id };
        } else {
            return acc;
        }
    });

    $: page = Object.entries($pages).reduce((acc, [id, value]) => {
        return value.path === `/${slug}` ? { ...value, id } : acc;
    }, {});
    
</script>

{page.name}
