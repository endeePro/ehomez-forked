"use client";

import React from "react";
import { cn } from "@/utils/helpers";
import { cva } from "class-variance-authority";

import { TypographyProps, variantMapping } from "./types";

const colorClasses = {
  // Red
  R50: "text-R50",
  R75: "text-R75",
  R100: "text-R100",
  R200: "text-R200",
  R300: "text-R300",
  R400: "text-R400",
  R500: "text-R500",

  // Green
  GL: "text-GL",
  GLH: "text-GLH",
  GLA: "text-GLA",
  GN: "text-GN",
  GNH: "text-GNH",
  GB: "text-GB",
  GBA: "text-GBA",
  GD: "text-GD",
  GDH: "text-GDH",
  GDA: "text-GDA",
  GDD: "text-GDD",

  // Secondary Salmon Green
  SLGL: "text-SLGL",
  SLGLH: "text-SLGLH",
  SLGLA: "text-SLGLA",
  SLGN: "text-SLGN",
  SLGNH: "text-SLGNH",
  SLGB: "text-SLGB",
  SLGBA: "text-SLGBA",
  SLGD: "text-SLGD",
  SLGDH: "text-SLGDH",
  SLGDA: "text-SLGDA",
  SLGDD: "text-SLGDD",

  // Tertiary gray
  TGL: "text-TGL",
  TGLH: "text-TGLH",
  TGLA: "text-TGLA",
  TGN: "text-TGN",
  TGNH: "text-TGNH",
  TGB: "text-TGB",
  TGBA: "text-TGBA",
  TGD: "text-TGD",
  TGDH: "text-TGDH",
  TGDA: "text-TGDA",
  TGDD: "text-TGDD",

  // Neutral (Light)
  N0: "text-N0",
  N10: "text-N10",
  N20: "text-N20",
  N30: "text-N30",
  N40: "text-N40",
  N50: "text-N50",

  // Neutral (Mid)
  N60: "text-N60",
  N70: "text-N70",
  N80: "text-N80",
  N90: "text-N90",
  N100: "text-N100",
  N200: "text-N200",
  N300: "text-N300",
  N400: "text-N400",

  // Neutral (Dark)
  N500: "text-N500",
  N600: "text-N600",
  N700: "text-N700",
  N800: "text-N800",
  N900: "text-N900",

  //Text Colors
  "text-default": "text-text-default",
  "text-light": "text-text-light",
};

export const typography = cva("", {
  variants: {
    intent: {
      "h-xxl": "text-h-xxl mmd:text-h-xl mxs:text-h-l",
      "h-xl": "text-h-xl mmd:text-h-l mxs:text-h-m ",
      "h-l": "text-h-l mmd:text-h-m mxs:text-h-s",
      "h-m": "text-m mmd:text-s",
      "h-s": "text-h-s",
      "h-xs": "text-h-xs",
      "p-xxl": "text-p-xxl mmd:p-xl",
      "p-xl": "text-p-xl mmd:p-l",
      "p-l": "text-p-l",
      "p-m": "text-p-m",
      "p-s": "text-p-s",
      "c-xxl": "text-c-xxl ",
      "c-xl": "text-c-xl",
      "c-l": "text-c-l",
      "c-m": "text-c-m",
      "c-s": "text-c-s",
      span: "",
      div: "",
    },
    font: {
      brCobane: "font-brCobane",
    },
    color: colorClasses,
    fontWeight: {
      thin: "font-thin",
      extralight: "font-extralight",
      light: "font-light",
      regular: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
      black: "font-black",
    },
    underline: { always: "underline", hover: "hover:underline", none: "" },
    align: {
      center: "text-center",
      start: "text-start",
      end: "text-end",
      left: "text-left",
      right: "text-right",
      justify: "text-justify",
    },
  },
  compoundVariants: [],
});

// Typography component
function Typography(props: TypographyProps) {
  const {
    variant = "p-m",
    tag,
    underline = "none",
    fontWeight = "regular",
    gutterBottom,
    noWrap,
    align = "left",
    color = "N700",
    customClassName = "",
    font = "brCobane",
    children,
    className,
    ...rest
  } = props;

  // Resolved tag
  const Tag = (tag ||
    variantMapping[variant] ||
    "p") as keyof JSX.IntrinsicElements;

  // Classes
  const classNameI = cn(
    gutterBottom && "mb-4",
    noWrap && "overflow-hidden text-ellipsis whitespace-nowrap",
    className && className,
  );

  return (
    // @ts-expect-error: Temporarily suppressing type error due to tag type
    <Tag
      className={typography({
        intent: variant,
        underline,
        fontWeight,
        color,
        align,
        font,
        className: cn(
          classNameI && classNameI,
          customClassName && customClassName,
        ),
      })}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export { Typography };
export * from "./types";
