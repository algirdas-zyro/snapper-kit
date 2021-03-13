import { parseCSSSides } from "./parseCSSSides";

export const STYLE_KEYS = ["padding", "m-padding", "block-padding"];

export const inlineCSSVars = style => {
  if (!style) {
    return "";
  }

  return Object.entries(style).reduce(
    (styletring, [currentStyleKey, currentStyleValue]) => {
      const newStyle = STYLE_KEYS.includes(currentStyleKey)
        ? Object.entries(parseCSSSides(currentStyleValue)).reduce(
            (styletringCurrent, [side, value]) => `
							${styletringCurrent} --${currentStyleKey}-${side}: ${value};`,
            `--${currentStyleKey}:${currentStyleValue};`
          )
        : `--${currentStyleKey}:${currentStyleValue};`;

      return `${styletring} ${newStyle}`;
    },
    ""
  );
};
