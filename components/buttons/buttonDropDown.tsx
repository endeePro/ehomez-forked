"use client";

import { FocusableItem, Menu, MenuDivider, MenuItem } from "@szhsin/react-menu";

import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";

import { ArrowDownIcon, PlusIcon } from "@/assets/svgs";
import { cn } from "@/utils/helpers";

import { Typography, TypographyColors } from "../typography";
import { Button } from "./button";

export type ButtonDropdownItem = {
  name: string;
  textColor?: TypographyColors;
  onClick: () => void;
};
interface IButtonDropdown {
  buttonGroup: ButtonDropdownItem[];
  iconType?: "plusIcon" | "arrow-down";
  btnText?: string;
  heading?: string;
  noMargin?: boolean;
}
export const ButtonDropdown = ({
  buttonGroup,
  iconType = "plusIcon",
  btnText = "New Listing",
  heading,
  noMargin = false,
}: IButtonDropdown) => {
  return (
    <Menu
      menuButton={
        <Button>
          <div className="flex items-center gap-2">
            <span>{btnText}</span>
            <span>
              {iconType !== "plusIcon" ? <ArrowDownIcon /> : <PlusIcon />}
            </span>
          </div>
        </Button>
      }
      transition
      className={cn(
        `[&>ul.szh-menu]:!dropdown-menu-box-shadow`,
        !noMargin && "z-40 [&>ul.szh-menu]:!top-[30px]",
      )}
      align={"end"}
      arrow
      position={"auto"}
    >
      <FocusableItem
        className={cn(
          "flex w-full items-center justify-between !px-3 hover:!bg-white",

          noMargin ? "min-w-[190px]" : "min-w-[240px]",
        )}
      >
        {() => (
          <>
            <Typography
              variant={"span"}
              fontWeight={"semibold"}
              color={"text-light"}
              className="text-base text-[#344054]"
            >
              {heading}
            </Typography>
          </>
        )}
      </FocusableItem>
      <MenuDivider />
      <ButtonContainer buttonGroup={buttonGroup} />
    </Menu>
  );
};

const ButtonContainer = ({ buttonGroup }: IButtonDropdown) => {
  return (
    <>
      {buttonGroup?.map((btn, i) => (
        <MenuItem
          key={i}
          role={"button"}
          className={"!px-3 !py-3"}
          onClick={btn?.onClick}
        >
          <Typography
            color={btn?.textColor || "N700"}
            variant="p-m"
            fontWeight="medium"
            className="mb-0"
          >
            {btn?.name}
          </Typography>
        </MenuItem>
      ))}
    </>
  );
};
