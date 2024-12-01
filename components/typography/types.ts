export const variantMapping = {
  "h-xxl": "h1",
  "h-xl": "h2",
  "h-l": "h3",
  "h-m": "h4",
  "h-s": "h5",
  "h-xs": "h6",
  "p-xxl": "p",
  "p-xl": "p",
  "p-l": "p",
  "p-m": "p",
  "p-s": "p",
  "c-xxl": "h3",
  "c-xl": "h4",
  "c-l": "h5",
  "c-m": "p",
  "c-s": "h6",
  span: "span",
  div: "div",
};

export type TypographyVariant = keyof typeof variantMapping;

export type TypographyColors =
  // Red
  | "R50"
  | "R75"
  | "R100"
  | "R200"
  | "R300"
  | "R400"
  | "R500"
  // Green
  | "GL"
  | "GLH"
  | "GLA"
  | "GN"
  | "GNH"
  | "GB"
  | "GBA"
  | "GD"
  | "GDH"
  | "GDA"
  | "GDD"
  // secondary salmon green
  | "SLGL"
  | "SLGLH"
  | "SLGLA"
  | "SLGN"
  | "SLGNH"
  | "SLGB"
  | "SLGBA"
  | "SLGD"
  | "SLGDH"
  | "SLGDA"
  | "SLGDD"
  //Tertiary Gray
  | "TGL"
  | "TGLH"
  | "TGLA"
  | "TGN"
  | "TGNH"
  | "TGB"
  | "TGBA"
  | "TGD"
  | "TGDH"
  | "TGDA"
  | "TGDD"
  // Neutral (Light)
  | "N0"
  | "N10"
  | "N20"
  | "N30"
  | "N40"
  | "N50"
  // Neutral (Mid)
  | "N60"
  | "N70"
  | "N80"
  | "N90"
  | "N100"
  | "N200"
  | "N300"
  | "N400"
  // Neutral (Dark)
  | "N500"
  | "N600"
  | "N700"
  | "N800"
  | "N900"
  //Text Colors
  | "text-default"
  | "text-light";

export type TypographyAlign =
  | "start"
  | "end"
  | "left"
  | "right"
  | "center"
  | "justify";

export type TypographyFontWeight =
  | "thin"
  | "extralight"
  | "light"
  | "regular"
  | "medium"
  | "semibold"
  | "bold"
  | "black";

export type TypographyFont = "brCobane";

export interface TypographyProps
  extends React.HTMLAttributes<HTMLOrSVGElement> {
  tag?: keyof JSX.IntrinsicElements;
  variant?: TypographyVariant;
  color?: TypographyColors;
  fontWeight?: TypographyFontWeight;
  gutterBottom?: boolean;
  align?: TypographyAlign;
  noWrap?: boolean;
  underline?: "none" | "always" | "hover";
  customClassName?: string;
  children?: React.ReactNode;
  font?: TypographyFont;
}
