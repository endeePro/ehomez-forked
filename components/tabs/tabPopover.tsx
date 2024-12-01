"use client";

import { Menu, MenuButton, MenuItem } from "@szhsin/react-menu";

import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";

import React, { CSSProperties, ReactNode, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowDownIcon } from "@/assets/svgs";
import { cn } from "@/utils/helpers";

import { Typography } from "../typography";

type DropDownItem = {
  title: string;
  subTitle: string;
  path: string;
  icon: ReactNode;
  iconBgColor: string;
};

type DropDown = {
  title: string;
  items: DropDownItem[];
};

export type Tab = {
  label: string;
  query: string;
  title: string;
  count?: number;
  dropdown?: DropDown;
  icon?: ReactNode;
};

type TabPopoverProps = {
  tabs: Tab[];
  activeTab: string;
  children: React.ReactNode;
};

const TabPopover = ({ tabs = [], activeTab, children }: TabPopoverProps) => {
  const router = useRouter();

  const [sliderStyle, setSliderStyle] = React.useState<CSSProperties>({});
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const activeIndex = tabs.findIndex((tab) =>
      tab.dropdown
        ? tab.dropdown.items.some((item) => item.path === activeTab)
        : tab.query === activeTab,
    );
    const activeTabRef = tabsRef.current[activeIndex];
    if (activeTabRef) {
      const { offsetLeft, clientWidth } = activeTabRef;
      setSliderStyle({
        left: offsetLeft,
        width: clientWidth,
      });
    }
  }, [activeTab, tabs]);

  const handleTabClick = (query: string) => {
    return router.push(query);
  };

  return (
    <div className="w-full">
      <div className="sticky left-0 top-[clamp(64px,_4vw,_72px)] h-[50px] w-full bg-N0 page-tab-box-shadow">
        <div className="relative mx-auto flex w-[98%] gap-2">
          {tabs.map((tab, index) =>
            tab.dropdown ? (
              <DropDownPopover
                key={tab.query}
                tab={tab}
                activeTab={activeTab}
                tabsRef={tabsRef}
                index={index}
                handleTabClick={handleTabClick}
                icon={tab.icon}
              />
            ) : (
              <button
                key={tab.query}
                // @ts-expect-error: suppress this warning to be handled later
                ref={(el) => (tabsRef.current[index] = el)}
                onClick={() => handleTabClick(tab.query)}
                className={cn(
                  "cursor-pointer px-[2px] py-[14px] text-center hover:text-B300",
                  activeTab === tab.query
                    ? "font-medium text-B400"
                    : "text-N900",
                )}
              >
                <Typography
                  fontWeight={"regular"}
                  variant={"p-m"}
                  className="whitespace-nowrap text-[inherit]"
                >
                  {tab.label} {tab.count && `(${tab.count})`}
                </Typography>
              </button>
            ),
          )}
          <div
            className="absolute bottom-0 h-1 bg-B400 transition-all duration-300"
            style={{ ...sliderStyle }}
          />
        </div>
      </div>
      <div className="container mx-auto mt-12 h-[calc((100dvh_-_clamp(64px,_4vw,_72px)_-_50px))] mmd:px-6">
        {children}
      </div>
    </div>
  );
};

export { TabPopover };

const DropDownPopover = ({
  tab,
  activeTab,
  tabsRef,
  index,
  handleTabClick,
  icon,
}: {
  tab: Tab;
  activeTab: string;
  tabsRef: React.MutableRefObject<(HTMLButtonElement | null)[]>;
  index: number;
  handleTabClick: (query: string) => void;
  icon?: ReactNode;
}) => {
  const isActive = tab.dropdown?.items
    .map((a) => a.path)
    .some((path) => path === activeTab);
  return (
    <Menu
      menuButton={
        <MenuButton
          key={tab.query}
          ref={(el) => (tabsRef.current[index] = el)}
          className={cn(
            "flex cursor-pointer items-center gap-2 px-[2px] py-[14px] text-center hover:text-B300",
            isActive ? "font-medium text-B400" : "text-N900",
          )}
        >
          <span className="whitespace-nowrap">{tab.label}</span>
          {isActive && (
            <span className="text-B100">{icon ?? <ArrowDownIcon />}</span>
          )}
        </MenuButton>
      }
      transition
      arrow
      className={
        "[&>ul.szh-menu]:!top-[60px] [&>ul.szh-menu]:!dropdown-menu-box-shadow"
      }
    >
      <Typography
        variant={"c-s"}
        fontWeight={"bold"}
        className={"pb-2 pl-5 pt-5"}
        color={"N90"}
        customClassName=" cursor-pointer"
      >
        {tab.dropdown?.title}
      </Typography>
      {tab.dropdown?.items.map((item, itemIndex) => (
        <MenuItem
          className={cn(
            "!p-0 hover:bg-[unset]",
            activeTab === item.path ? "bg-N20" : "",
          )}
          key={itemIndex}
          onClick={() => handleTabClick(item.path)}
        >
          <div className="flex w-full items-center px-5 py-2 hover:bg-N20">
            <div
              className={cn(
                "mr-3 flex h-6 w-6 items-center justify-center rounded",
                item.iconBgColor && item.iconBgColor,
              )}
            >
              {item.icon}
            </div>
            <div>
              <Typography variant="p-m" fontWeight="medium" className="mb-0">
                {item.title}
              </Typography>
              <Typography fontWeight="regular" variant={"p-s"} color={"N100"}>
                {item.subTitle}
              </Typography>
            </div>
          </div>
        </MenuItem>
      ))}
    </Menu>
  );
};
