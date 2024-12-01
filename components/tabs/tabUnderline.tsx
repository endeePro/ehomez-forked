"use client";

import React, {
  CSSProperties,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { cn } from "@/utils/helpers";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Typography } from "../typography";

type Tab = {
  label: string;
  query: string;
  count?: number;
  content: ReactNode;
};

type TabUnderlineProps = {
  tabs: Tab[];
  onChange: (query: string) => void;
  activeTab: string;
};

const TabUnderline = ({ tabs, onChange, activeTab }: TabUnderlineProps) => {
  const [sliderStyle, setSliderStyle] = useState<CSSProperties>({});
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const activeIndex = tabs.findIndex((tab) => tab.query === activeTab);
    const activeTabRef = tabsRef.current[activeIndex];
    if (activeTabRef) {
      const { offsetLeft, clientWidth } = activeTabRef;
      setSliderStyle({
        left: offsetLeft,
        width: clientWidth,
      });
    }
  }, [activeTab, tabs]);

  // Check for overflow
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      setIsOverflowing(container.scrollWidth > container.clientWidth);
    }
  }, [tabs]);

  const handleTabClick = (query: string) => {
    onChange(query);
  };

  const scrollTabs = (direction: "left" | "right") => {
    const container = containerRef.current;
    if (container) {
      const scrollAmount = container.clientWidth / 2;
      const newScrollPosition =
        direction === "left"
          ? Math.max(0, scrollPosition - scrollAmount)
          : Math.min(
              container.scrollWidth - container.clientWidth,
              scrollPosition + scrollAmount,
            );

      container.scrollTo({
        left: newScrollPosition,
        behavior: "smooth",
      });
      setScrollPosition(newScrollPosition);
    }
  };

  return (
    <div className="relative flex w-full flex-col items-center">
      {isOverflowing && scrollPosition > 0 && (
        <button
          onClick={() => scrollTabs("left")}
          className="absolute left-0 z-10 rounded-full bg-white p-1 shadow-lg"
        >
          <ChevronLeft className="text-gray-600" size={20} />
        </button>
      )}

      <div
        ref={containerRef}
        className="no-scrollbar relative w-full flex-grow overflow-x-auto scroll-smooth"
        style={{
          scrollBehavior: "smooth",
          overscrollBehaviorX: "contain",
        }}
      >
        <div className="relative flex min-w-full border-b-[1px] border-solid border-[#EAECF0]">
          {tabs.map((tab, index) => (
            <button
              type="button"
              key={tab.query}
              // @ts-expect-error: suppress this warning to be handled later
              ref={(el) => (tabsRef.current[index] = el)}
              onClick={() => handleTabClick(tab.query)}
              className={cn(
                "cursor-pointer whitespace-nowrap px-2 py-2 text-center hover:text-GB",
                activeTab === tab.query
                  ? "font-medium text-GB"
                  : "text-gray-500",
              )}
            >
              <Typography
                fontWeight={"regular"}
                variant={"p-m"}
                className="text-[inherit]"
                noWrap
              >
                {tab.label} {tab.count && ` (${tab.count})`}
              </Typography>
            </button>
          ))}
          <div
            className="absolute bottom-0 h-1 bg-[#D1EE9B] transition-all duration-300"
            style={{ ...sliderStyle }}
          />
        </div>
      </div>

      {isOverflowing &&
        scrollPosition <
          (containerRef.current?.scrollWidth || 0) -
            (containerRef.current?.clientWidth || 0) && (
          <button
            onClick={() => scrollTabs("right")}
            className="shadow-xxlg absolute right-0 z-10 rounded-full bg-white p-1"
          >
            <ChevronRight className="text-gray-600" size={20} />
          </button>
        )}

      <div className="mt-6 w-full">
        {tabs.find((tab) => tab.query === activeTab)?.content}
      </div>
    </div>
  );
};

export { TabUnderline };
