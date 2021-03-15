import { writable, derived } from "svelte/store";

export const website = writable({});

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
