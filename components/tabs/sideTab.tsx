"use client";

import React, { CSSProperties, ReactNode, useEffect, useRef } from "react";
import { cn } from "@/utils/helpers";

import { Typography } from "../typography";

type Tab = {
  label: string;
  query: string;
  count?: number;
  content: ReactNode;
};

type SideTabProps = {
  tabs: Tab[];
  onChange: (query: string) => void;
  activeTab: string;
};

const SideTab = ({ tabs, onChange, activeTab }: SideTabProps) => {
  const [sliderStyle, setSliderStyle] = React.useState<CSSProperties>({});
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const activeIndex = tabs.findIndex((tab) => tab.query === activeTab);
    const activeTabRef = tabsRef.current[activeIndex];
    if (activeTabRef) {
      const { offsetLeft, offsetTop, clientHeight } = activeTabRef;
      const percentHeightCutOff = clientHeight * 0.5;
      const additionOffsetTop = percentHeightCutOff / 2;
      const height = clientHeight - percentHeightCutOff;

      setSliderStyle({
        height,
        left: offsetLeft,
        width: 4,
        borderRadius: 5,
        top: offsetTop + additionOffsetTop,
      });
    }
  }, [activeTab, tabs]);

  const handleTabClick = (query: string) => {
    onChange(query);
  };

  return (
    <div className="flex w-full">
      <div className="relative flex w-max max-w-[170px] flex-col">
        {tabs.map((tab, index) => (
          <button
            key={tab.query}
            // @ts-expect-error: suppress this warning to be handled later
            ref={(el) => (tabsRef.current[index] = el)}
            onClick={() => handleTabClick(tab.query)}
            className={cn(
              "cursor-pointer px-2 py-2 text-left hover:text-B300",
              activeTab === tab.query ? "font-medium text-B400" : "text-N500",
            )}
          >
            <Typography
              fontWeight={"regular"}
              variant={"p-s"}
              className="text-[inherit]"
            >
              {tab.label} {tab.count && `(${tab.count})`}
            </Typography>
          </button>
        ))}
        <div
          className="absolute bottom-0 h-1 bg-B400 transition-all duration-300"
          style={{ ...sliderStyle }}
        />
      </div>
      <div className="flex-grow">
        {tabs.find((tab) => tab.query === activeTab)?.content}
      </div>
    </div>
  );
};

export { SideTab };
