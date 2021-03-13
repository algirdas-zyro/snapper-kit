<script>
    import { pages } from "../stores";

    $: page = Object.entries($pages).reduce((acc, [id, value]) => {
        return value.path === "/" ? { ...value, id } : acc;
    }, {});
</script>

{page.name}
