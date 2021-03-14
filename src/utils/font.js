import {
	FONT,
	PROPERTY_FONT_FAMILY,
	PROPERTY_FONT_PRIMARY,
	PROPERTY_FONT_SECONDARY,
	PROPERTY_FONT_WEIGHT,
	FONT_WEIGHT_ELEMENTS,
} from '../constants/globalStyles';

const FONT_WEIGHTS_MAP = {
	normal: 400,
	bold: 700,
};

const AVAILABLE_GOOGLE_FONT_WEIGHTS = [
	'100',
	'100italic',
	'200italic',
	'200',
	'300italic',
	'300',
	'regular',
	'italic',
	'400',
	'400italic',
	'500',
	'500italic',
	'600',
	'600italic',
	'700',
	'700italic',
	'800',
	'800italic',
	'900',
	'900italic',
];

// TODO remove after mapper is done
/**
 * Mapper is needed for this to remove, currently our legacy templates
 * have bold for 700 and normal for 400 font weights
 */
export const convertWeightStringToNumber = (fontWeight) => FONT_WEIGHTS_MAP[fontWeight]
	|| Number(fontWeight);

/**
 * @param fontName ''Prata', sans-serif'
 * @returns 'Prata' {String}
 */
export const extractFontName = (fontName) => fontName.split(',')?.[0]?.replace(/'/g, '');

export const constructFontForCSS = (family, fallback) => `'${family}', ${fallback}`;

export const transformFontTypeToVariable = (fontType) => `var(--${FONT}-${fontType})`;

export const replaceSpacesWithPlus = (fontName) => fontName.trim().replace(/ /g, '+');

/**
 * @param variable var(--font-primary) | var(--font-secondary)
 * @returns primary | secondary
 */
export const extractFontTypeFromVariable = (variable) => {
	const regex = new RegExp(`var\\(--${FONT}-|\\)`, 'g');

	return variable.replace(regex, '');
};

export const filterAvailableFontWeightVariants = (variants) => {
	const GOOGLE_FONT_WEIGHT_MAP = {
		regular: '400',
		italic: '400italic',
	};

	return variants
		.filter((variant) => AVAILABLE_GOOGLE_FONT_WEIGHTS.includes(variant))
		.map((variant) => {
			const defaultValue = Number(variant) || variant;

			return GOOGLE_FONT_WEIGHT_MAP[variant] || defaultValue;
		});
};

export const pickUsedFontWeights = (websiteStyles) => {
	let usedFontWeights = {
		primary: [],
		secondary: [],
	};

	FONT_WEIGHT_ELEMENTS.forEach((element) => {
		const fontType = extractFontTypeFromVariable(websiteStyles[element][PROPERTY_FONT_FAMILY]);
		const fontWeight = convertWeightStringToNumber(websiteStyles[element][PROPERTY_FONT_WEIGHT]);

		usedFontWeights = {
			...usedFontWeights,
			[fontType]: [
				...usedFontWeights[fontType],
				fontWeight,
			],
		};
	});

	return {
		[PROPERTY_FONT_PRIMARY]: [...new Set([PROPERTY_FONT_PRIMARY])],
		[PROPERTY_FONT_SECONDARY]: [...new Set(usedFontWeights[PROPERTY_FONT_SECONDARY])],
	};
};

export const websiteFontNames = (websiteFonts) => ({
	[PROPERTY_FONT_PRIMARY]: extractFontName(websiteFonts[PROPERTY_FONT_PRIMARY]),
	[PROPERTY_FONT_SECONDARY]: extractFontName(websiteFonts[PROPERTY_FONT_SECONDARY]),
});

export const constructMetaFont = (fontNames, fontWeights) => {
	const primaryMetaFont = `${replaceSpacesWithPlus(fontNames[PROPERTY_FONT_PRIMARY])}:${fontWeights[PROPERTY_FONT_PRIMARY].join(',')}`;
	const secondaryMetaFont = `${replaceSpacesWithPlus(fontNames[PROPERTY_FONT_SECONDARY])}:${fontWeights[PROPERTY_FONT_SECONDARY].join(',')}`;

	return `${primaryMetaFont}|${secondaryMetaFont}`;
};
