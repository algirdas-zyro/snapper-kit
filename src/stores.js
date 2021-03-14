import { writable, derived } from "svelte/store";

export const website = writable({});

export const NAV_LINK_TYPE = "Link";
export const NAV_PAGE_TYPE = "Page";
export const NAV_FOLDER_TYPE = "Folder";
export const NAV_HOMEPAGE_TYPE = "Homepage";

export const NAV_GROUP_ROOT = "ROOT";
export const NAV_GROUP_HIDDEN = "HIDDEN";

export const pages = derived(website, w => w.pages);
export const blocks = derived(website, w => w.blocks);
export const components = derived(website, w => w.components);

export const blogCategories = derived(website, w => w.blogCategories);
export const domain = derived(website, w => w.domain);
export const forms = derived(website, w => w.forms);
export const hasActivePlan = derived(website, w => w.hasActivePlan);
export const meta = derived(website, w => w.meta);
export const nav = derived(website, w => w?.navigation ?? {});
export const styles = derived(website, w => w?.styles ?? {});
export const user = derived(website, w => w.user);

export const setWebsite = websiteData => website.set(websiteData);
