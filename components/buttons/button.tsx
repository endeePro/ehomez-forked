import * as React from "react";
import { cn } from "@/utils/helpers";
import { cva, type VariantProps } from "class-variance-authority";

import { Spinner } from "../loaders";
import { Typography } from "../typography";

const buttonVariants = cva(
  "rounded transition-all ease-in-out duration-400 rounded-[8px]",
  {
    variants: {
      variant: {
        primary:
          " bg-SLGB hover:bg-SLGBA text-GB disabled:bg-GLA disabled:text-GB  disabled:cursor-not-allowed", // blue
        secondary:
          "bg-GB text-N0 hover:bg-GNH disabled:opacity-50 hover:disabled:bg-GLA disabled:cursor-not-allowed", // extra light ash
        neutral:
          "bg-N0 hover:bg-N20 text-N700 disabled:bg-N20 disabled:text-N70 disabled:cursor-not-allowed", // white
        tertiary:
          "bg-Y300 hover:bg-Y200 text-N0 disabled:bg-Y75 disabled:text-N70 disabled:cursor-not-allowed", // yellow
        danger:
          "bg-R400 hover:bg-R300 text-N0 disabled:bg-R75 disabled:text-N20 disabled:cursor-not-allowed", // red
        plain: "",
      },
      size: {
        default: " py-[10px] px-[12px]",
        plain: "",
      },
      types: {
        outline: "",
        filled: "",
      },
    },
    compoundVariants: [
      {
        types: "outline",
        variant: "primary",
        className:
          "bg-transparent text-SLGBA border border-SLGBA hover:border-transparent hover:text-GB",
      },
      {
        types: "outline",
        variant: "secondary",
        className: "bg-transparent text-GB border border-GB hover:text-N0",
      },
      {
        types: "outline",
        variant: "tertiary",
        className:
          "bg-transparent text-Y300 border border-Y300 hover:border-transparent hover:text-N0",
      },
      {
        types: "outline",
        variant: "danger",
        className:
          "bg-transparent text-R400 border border-R400 hover:border-transparent hover:text-N0",
      },
    ],
    defaultVariants: {
      variant: "primary",
      size: "default",
      types: "filled",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      types = "filled",
      size,
      children,
      loading = false,
      ...props
    },
    ref,
  ) => {
    const Comp = "button";
    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size, types, className }),
          "flex items-center justify-center gap-4",
        )}
        ref={ref}
        {...props}
      >
        {!loading && (
          <Typography variant={"div"} className="!text-[inherit]">
            {" "}
            <div>{children}</div>
          </Typography>
        )}
        {loading && <Spinner color={variant === "neutral" ? "N700" : "N0"} />}
      </Comp>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
