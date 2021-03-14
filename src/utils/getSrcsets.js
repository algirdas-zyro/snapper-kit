/**
 * Web URL API is not used as it needs core-js runtime polyfill
 * Read more: (https://github.com/zloirock/core-js/issues/117)
 */

import { USER_MOBILE_BREAKPOINT } from '../../constants';
/*
 * Supported Cloudflare origins
 * TODO: move to .envs after migration
 */
export const CLOUDFLARE_ORIGINS = [
	'https://assets.zyrosite.space', // staging
	'https://assets.zyrosite.com', // production
];

// Unsplash origin
export const UNSPLASH_ORIGIN = 'https://images.unsplash.com';

/*
 * Cloudflare image opzimization prefix for supported origins:
 * https://developers.cloudflare.com/images/url-format
 */
export const CLOUDFLARE_PREFIX = 'cdn-cgi/image';

// Mobile device resolutions (can be added later on);
export const MOBILE_RESOLUTIONS = [360];
// Mobile DPI levels (2.625 is XXHDPI Density used in PageSpeed device)
export const MOBILE_DPI_LEVELS = [
	1,
	2,
	2.625,
	3,
];
// Desktop resolutions (used only to trim massive images, usually backgrounds);
export const DESKTOP_RESOLUTIONS = [
	1440,
	1920,
];
// Desktop DPI levels
export const DESKTOP_DPI_LEVELS = [
	1,
	2,
];
// Default offset for mobile devices
export const DEFAULT_MOBILE_PADDING = 16;

/**
 * Util to find file extension: trim query params, get extenstion string and check if it's 'svg';
 *
 * @param {string} url - input url
 * @return {boolean} - flag to return if path leads to .svg file
 */
export const isSvgFile = (url) => url.split('?')[0].split('.').splice(-1)[0].toLowerCase() === 'svg';

/**
 * Tranform src to Cloudflare-optimized URL
 *
 * @param {string} origin - Cloudflare origin (defined in constants)
 * @param {string} src - image (url)
 * @param {{
 *     width: number,
 *     height: number,
 *     shouldContain: boolean,
 *     isLossless: boolean
 * }} options - Cloudflare optimization options
 * @return {string} - transformed string URL to optimized image
 */
export const getCloudflareSrc = (origin, src, options = {}) => {
	/**
	 * Cloudflare service options: https://developers.cloudflare.com/images/url-format#options
	 * 'format=auto' - picks best supported format (usually webp) via user-agent
	 * 'fit=scale-down' - same as `object-fit: contain` except it doesn't enlarge
	 * 'fit=crop' - same as `object-fit: cover` except it doesn't enlarge (default)
	 */

	const optionString = [
		'format=auto',
		options.width && `w=${options.width}`,
		options.height && `h=${options.height}`,
		options.shouldContain ? 'fit=scale-down' : 'fit=crop',
		options.isLossless && 'q=100', // override default lossy 85
	].filter((param) => !!param).join(',');

	//  Get relative path to image
	let [, path] = src.split(origin);

	// Path usually starts with '/', but can also start with '//' (legacy). Trim it:
	while (path.startsWith('/')) {
		path = path.replace('/', '');
	}

	return `${origin}/${CLOUDFLARE_PREFIX}/${optionString}/${path}`;
};

/**
 * Tranform src to Unsplash-optimized URL
 *
 * @param {string} src - image (url)
 * @param {{
 *     width: number,
 *     height: number,
 *     shouldContain: boolean,
 *     isLossless: boolean
 * }} options - Unsplash optimization options
 * @return {string} - transformed string URL to optimized image
 */
export const getUnsplashSrc = (src, options = {}) => {
	/**
	 * Unsplash service options: https://docs.imgix.com/apis/rendering
	 * 'auto=format' - picks best supported format (usually webp) via user-agent
	 * 'fit=clip' - same as `object-fit: contain` except it doesn't enlarge
	 * 'fit=crop' - same as `object-fit: cover` except it doesn't enlarge (default)
	 */
	const optionString = [
		'auto=format',
		options.width && `w=${options.width}`,
		options.height && `h=${options.height}`,
		options.shouldContain ? 'fit=clip' : 'fit=crop',
		options.isLossless && 'q=100', // override default lossy 75
	].filter((param) => !!param).join('&');

	return `${src}?${optionString}`;
};

/**
 * Take in 'src', check if there are supported providers and optimize it
 *
 * @param {string} src - image (url)
 * @param {{
 *     width: number,
 *     height: number,
 *     shouldContain: boolean,
 *     isLossless: boolean
 * }} options - Unsplash optimization options
 * @return {string} - transformed string URL to optimized image
 */
export const getOptimizedSrc = (src, options = {}) => {
	// skip SVG files altogether
	if (isSvgFile(src)) {
		return src;
	}

	const cloudflareOrigin = CLOUDFLARE_ORIGINS.find((origin) => src.includes(origin));

	if (cloudflareOrigin) {
		return getCloudflareSrc(cloudflareOrigin, src, options);
	}

	if (src.includes(UNSPLASH_ORIGIN)) {
		return getUnsplashSrc(src, options);
	}

	return src;
};

/**
 * For backgrounds and images which do not have width/height defined use this.
 * It loops throught defined lists of breakpoints and DPIs
 *
 * @param {string} url - image url
 * @param {{
 *     shouldContain: boolean,
 *     isLossless: boolean
 * }} options - General optimization options
 * @return {string} - a cocatenated string from URLs
 */
export const getFullWidthSrcset = (url, options = {}) => {
	const desktopFullWidthSrcset = DESKTOP_RESOLUTIONS
		.map((resolution) => DESKTOP_DPI_LEVELS
			.map((dpi) => {
				const width = Math.round(resolution * dpi);

				return `${getOptimizedSrc(url, {
					...options,
					width,
				})} ${width}w`;
			})).join(',');

	const mobileFullWidthSrcset = MOBILE_RESOLUTIONS
		.map((resolution) => MOBILE_DPI_LEVELS
			.map((dpi) => {
				const width = Math.round(resolution * dpi);

				return `${getOptimizedSrc(url, {
					...options,
					width,
				})} ${width}w`;
			})).join(',');

	return `${mobileFullWidthSrcset},${desktopFullWidthSrcset}`;
};

/**
 * For images which have width and height generate srcset for particular size.
 *
 * @param {string} url - image url
 * @param {{
 *     width: number,
 *     height: number,
 *     shouldContain: boolean,
 *     isLossless: boolean,
 *     mobilePadding: number
 * }} options - General optimization options
 * @return {string} - a cocatenated string from URLs
 */
export const getGridItemSrcset = (url, options = {}) => {
	// if no width was passed, fall back to getFullWidthSrcset()
	if (!options.width) {
		return getFullWidthSrcset(url, options);
	}

	const desktopGridSrcset = DESKTOP_DPI_LEVELS.map((dpi) => {
		const scaledWidth = Math.round(options.width * dpi);
		const scaledHeight = Math.round(options.height * dpi);
		const optimizedSrc = getOptimizedSrc(url, {
			...options,
			width: scaledWidth,
			height: scaledHeight,
		});

		return `${optimizedSrc} ${scaledWidth}w`;
	}).join(',');

	// Pin mobile offset from sides - we'll need to subtract it
	const mobileOffset = (options.mobilePadding ?? DEFAULT_MOBILE_PADDING) * 2;
	// Loop through all defined mobile resolutions:
	const mobileGridSrcset = MOBILE_RESOLUTIONS.map((resolution) => {
		// Get CSS width of render area
		const cssWidth = resolution - mobileOffset;

		// Loop through all DIP levels and multiply css render area size by DPI
		return MOBILE_DPI_LEVELS.map((dpi) => {
			// Get ratio from props
			const ratio = options.width / options.height;
			// Get image width at that resolution
			const scaledWidth = Math.round(cssWidth * dpi);
			// Calculate height at current width
			const scaledHeight = Math.round(scaledWidth / ratio);
			const optimizedSrc = getOptimizedSrc(url, {
				...options,
				width: scaledWidth,
				height: scaledHeight,
			});

			return `${optimizedSrc} ${scaledWidth}w`;
		}).join(',');
	}).join(',');

	return `${mobileGridSrcset},${desktopGridSrcset}`;
};

/**
 * Calculate sizes in desktop and mobile resolutions.
 *
 * @param {number} gridItemWidth - width to calculate sizes
 * @param {number} [mobilePadding=DEFAULT_MOBILE_PADDING] - mobile padding to calculate mobile width
 * @return {string} - a cocatenated string of sizes
 */
export const getGridItemSizes = (gridItemWidth, mobilePadding = DEFAULT_MOBILE_PADDING) => [
	`(min-width: ${USER_MOBILE_BREAKPOINT}px) ${gridItemWidth}px`,
	`calc(100vw - ${mobilePadding * 2}px)`,
].join(', ');
