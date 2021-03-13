<script>
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";

    import { nav, pages, blocks } from "../stores";
    import { cssVarsObjectToString } from "../utils/objectToCSSVars";
    import { logoMenuPositionMap } from "../utils/logoMenuPositionMap";

    export let slug;

    const mapNavItem = id => {
        const item = $nav.items[id];
        const { name, type } = item;
        const isPage = type === "Page";
        const isLink = type === "Link";
        const isFolder = type === "Folder";

        return {
            ...item,
            hasDropdown: item?.subItems?.length > 0 || item.isFolder,
            id,
            name,
            name: $pages[id]?.name || name,
            path: $pages[id]?.path || "/",
            isPage,
            isLink,
            isFolder,
            subItems: item.subItems.map(mapNavItem),
        };
    };

    const isMobileScreen = false;

    $: navItems = $nav?.itemsIds?.map(mapNavItem) ?? [];
    $: navSettings = $blocks?.navigation?.settings;
    $: isOpen = true;
    $: logoUrl = navSettings?.logoUrl;
    $: showLogo = navSettings?.showLogo;
    $: isSticky = navSettings?.isSticky;
    $: logoPlacement = isMobileScreen
        ? navSettings["m-logoPlacement"] || navSettings.logoPlacement
        : navSettings.logoPlacement;
    $: navigationPlacement = isMobileScreen
        ? navSettings["m-navigationPlacement"] ||
          navSettings.navigationPlacement
        : navSettings.navigationPlacement;
    $: placementKey = `${logoPlacement}-${navigationPlacement}`;
    $: bothCentered =
        logoPlacement === "center" && navigationPlacement === "center";
    $: gridGap = bothCentered
        ? "var(--space-between-menu) 0"
        : "0 var(--space-between-menu)";
    $: templateColumns = isMobileScreen
        ? logoMenuPositionMap[placementKey].mTemplateColumns ||
          logoMenuPositionMap[placementKey].templateColumns
        : logoMenuPositionMap[placementKey].templateColumns;
    $: styleObject = {
        "navigation-grid-template-columns": showLogo ? templateColumns : "1fr",
        "logo-grid-row": logoMenuPositionMap[placementKey].logoRow,
        "logo-grid-column": logoMenuPositionMap[placementKey].logoColumn,
        "links-grid-row": showLogo
            ? logoMenuPositionMap[placementKey].menuRow
            : "1/2",
        "links-grid-column": showLogo
            ? logoMenuPositionMap[placementKey].menuColumn
            : "1/2",
        "navigation-grid-gap": showLogo ? gridGap : "",
    };
    $: computedBlockStyle = cssVarsObjectToString(navSettings?.styles);
    $: computedNavStyle = cssVarsObjectToString(styleObject);
</script>

<!-- svelte-ignore component-name-lowercase -->
<div class="block" style={computedBlockStyle}>
    <nav
        style={computedNavStyle}
        class="navigation"
        class:navigation--no-logo={!showLogo}
        class:navigation--sticky={isSticky}
        class:navigation--open={isOpen}
    >
        {#if showLogo}
            <div
                on:click={() => goto("/")}
                class={`navigation__logo navigation__logo--${navigationPlacement}`}
            >
                <img class="navigation__logo-img" src={logoUrl} alt="Logo" />
            </div>
        {/if}

        {#if isOpen || !isMobileScreen}
            <ul
                class={`navigation__links navigation__links--${navigationPlacement}`}
                class:navigation__links--open={isOpen}
            >
                {#each navItems as item}
                    <li class="block-navigation-item">
                        <div
                            class="block-navigation-item__item item-content-wrapper item-content-wrapper--align-right"
                            class:item-content-wrapper--active={$page.path ===
                                item.path}
                        >
                            <a
                                class="item-content"
                                class:item-content--is-active={$page.path ===
                                    item.path}
                                href={item.path}
                            >
                                {item.name}
                            </a>
                        </div>
                    </li>
                {/each}
            </ul>
        {/if}
    </nav>
</div>
