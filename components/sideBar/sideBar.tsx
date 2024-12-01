"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { CogIcon, LogoutIcon } from "@/assets/svgs";
import { sidebarModuleMenus } from "@/constants/data";
import { AuthRouteConfig } from "@/constants/routes";
import { cn } from "@/utils/helpers";
import { deleteCookie, getCookies } from "cookies-next";

import { AppLogo } from "../logo/logo";
import { Typography } from "../typography";

interface IProps {
  callback?: () => void;
}

export const SideBar = ({ callback }: IProps) => {
  const router = useRouter();
  const logout = () => {
    const allCookies = getCookies();
    Object.keys(allCookies).map((key) => {
      deleteCookie(key);
    });
    router.replace(AuthRouteConfig.HOME);
  };
  const handleLogout = () => logout();
  return (
    <>
      <aside
        className={
          "sticky left-0 top-0 flex h-screen w-full max-w-[280px] flex-col bg-GB p-4"
        }
      >
        <div className="px-[12px]">
          <AppLogo varients={"default"} />
        </div>
        <div className="mt-7 flex flex-1 flex-col justify-between">
          <div className="flex-1 overflow-y-auto hideScrollBar">
            {sidebarModuleMenus.map((menu) => (
              <NavLinkBtn {...menu} key={menu.name} onClick={callback} />
            ))}
          </div>
          <div>
            <NavLinkBtn
              icon={<CogIcon />}
              name="Settings"
              path="/dashboard/settings"
              onClick={callback}
            />
            <button
              onClick={handleLogout}
              className={cn(
                "group flex w-full items-center gap-[14px] rounded-[40px] bg-transparent p-[10px_20px] text-N900 transition-all duration-100 ease-in-out [&:not(:first-of-type)]:mt-2",
                "cursor-pointer bg-transparent text-N0",
              )}
            >
              <div
                className={cn(
                  "w-[28px] transition-all duration-100 ease-in-out",
                )}
              >
                {<LogoutIcon />}
              </div>
              <Typography
                variant="p-m"
                fontWeight={"medium"}
                className="cursor-pointer text-[inherit] transition-all duration-100 ease-in-out"
                noWrap
              >
                Logout
              </Typography>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

interface MenuItem {
  icon: React.ReactNode;
  name: string;
  path: string;
  onClick?: () => void;
}

const NavLinkBtn = ({ icon, name, path, onClick }: MenuItem) => {
  const pathName = usePathname();
  const findActiveLink = (root: string) =>
    path.toLocaleLowerCase() === "/dashboard"
      ? pathName.endsWith(root)
      : pathName.startsWith(root);
  return (
    <Link
      href={path}
      onClick={onClick}
      className={cn(
        "group flex w-full items-center gap-[14px] rounded-[40px] bg-transparent p-[10px_20px] text-N900 transition-all duration-100 ease-in-out [&:not(:first-of-type)]:mt-2",
        findActiveLink(path)
          ? "bg-SLGB text-GB hover:bg-SLGBA"
          : "bg-transparent text-N0 hover:bg-SLGB hover:text-GB",
      )}
    >
      <div
        className={cn(
          "w-[28px] transition-all duration-100 ease-in-out",
          findActiveLink(path)
            ? "text-GB group-hover:text-[inherit]"
            : "text-SLGB group-hover:text-[inherit]",
        )}
      >
        {icon}
      </div>
      <Typography
        variant="p-m"
        fontWeight={!findActiveLink(path) ? "medium" : "semibold"}
        className="text-[inherit] transition-all duration-100 ease-in-out"
        noWrap
      >
        {name}
      </Typography>
    </Link>
  );
};
