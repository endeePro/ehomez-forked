"use client";

import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { BreadCrumbHomeIcon, HamburgerMainIcon } from "@/assets/svgs";
import { resetState } from "@/redux/api/property/formState.slice";
import { cn } from "@/utils/helpers";
import { useDispatch } from "react-redux";

import { AppNotification } from "../appNotifications/appNotification";
import { Breadcrumbs } from "../breadCrumbs/breadCrumbs";
import { ButtonDropdown } from "../buttons";
import { Drawer } from "../drawer/drawer";
import { SideBar } from "../sideBar/sideBar";
import { UserDropDown } from "../userDropDown/userDropDown";

type IProps = {
  children?: React.ReactNode;
};

const validRootPathWithCrumbs = [
  "/dashboard/list-management",
  "/dashboard/configurations",
  "/dashboard/customer-management",
  "/dashboard/user-management",
];

const withBreadcrumbs = (path: string) => {
  const len = path.split("/").length;
  if (
    len > 3 &&
    validRootPathWithCrumbs.some((root) => path.startsWith(root))
  ) {
    return true;
  }

  return false;
};
const crumbsToReturn = (path: string) => {
  if (path.startsWith(validRootPathWithCrumbs[0])) {
    if (path.includes("/create")) {
      return [
        {
          name: "Property Listing",
          path: "/dashboard/list-management",
        },
        {
          name: "Create a new Property Listing",
        },
      ];
    }
    if (path.includes("/edit")) {
      return [
        {
          name: "Property Listing",
          path: "/dashboard/list-management",
        },
        {
          name: "Edit Property Listing",
        },
      ];
    }
    return [
      {
        name: "Property Listing",
        path: "/dashboard/list-management",
      },
      {
        name: "View Listing Specific Information",
      },
    ];
  }
  if (path.startsWith(validRootPathWithCrumbs[1])) {
    return [
      {
        name: "Listing Configuration",
        path: "/dashboard/configurations",
      },
      {
        name: "View Specific Configuration",
      },
    ];
  }
  if (path.startsWith(validRootPathWithCrumbs[2])) {
    return [
      {
        name: "Customer Management",
        path: "/dashboard/customer-management",
      },
      {
        name: "View Customers Details",
      },
    ];
  }
  if (path.startsWith(validRootPathWithCrumbs[3])) {
    if (path.includes("/roles") || path.includes("/users")) {
      if (path.includes("/roles")) {
        if (path.includes("/create")) {
          return [
            {
              name: "User Management",
              path: "/dashboard/user-management",
            },
            {
              name: "Create a New Role",
            },
          ];
        }
        return [
          {
            name: "User Management",
            path: "/dashboard/user-management",
          },
          {
            name: "View Roles",
          },
        ];
      }
      if (path.includes("/users")) {
        if (path.includes("/create")) {
          return [
            {
              name: "User Management",
              path: "/dashboard/user-management",
            },
            {
              name: "Create a New User",
            },
          ];
        }
        return [
          {
            name: "User Management",
            path: "/dashboard/user-management",
          },
          {
            name: "View Users",
          },
        ];
      }
    }
  }
  return [];
};

export const GlobalMenu = ({ children }: IProps) => {
  const pathName = usePathname();
  const { push } = useRouter();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const handleOpenDrawer = () => setIsDrawerOpen(true);
  const handleCloseDrawer = () => setIsDrawerOpen(false);
  const dispatch = useDispatch();

  const crumbs = [
    {
      name: <BreadCrumbHomeIcon />,
      path: "/dashboard",
    },
    ...crumbsToReturn(pathName),
  ];

  const handleBtnClick = (path: string) => {
    push(`/dashboard/list-management/create/${path}`);
    handleCloseDrawer();
  };
  return (
    <>
      <main className="relative flex">
        <div className="sticky left-0 top-0 w-full max-w-[280px] mlg:hidden">
          <SideBar />
        </div>
        <div className="flex w-full flex-col bg-[#FCFCFD]">
          <nav
            className={cn(
              "sticky left-0 right-0 top-0 z-40 flex h-[clamp(64px,_4vw,_80px)] items-center justify-between bg-N0 px-[clamp(12px,_3vw,_24px)]",
              !withBreadcrumbs(pathName) && "page-tab-box-shadow",
            )}
          >
            <div className="mx-auto flex w-full max-w-screen-lg items-center justify-between">
              <div className="flex h-[40px] items-center">
                <span className="flex h-full w-fit items-center gap-4">
                  <button onClick={handleOpenDrawer} className="lg:hidden">
                    <HamburgerMainIcon />
                  </button>
                </span>
              </div>
              <div className="flex items-center gap-6">
                <ButtonDropdown
                  heading="Create a New Listing"
                  buttonGroup={[
                    {
                      name: "Rent an Apartment",
                      onClick: () => handleBtnClick("rent-apartment"),
                    },
                    {
                      name: "Rent a Land",
                      onClick: () => handleBtnClick("rent-land"),
                    },
                    {
                      name: "Sale: Apartment",
                      onClick: () => handleBtnClick("sale-apartment"),
                    },
                    {
                      name: "Sale: Land",
                      onClick: () => handleBtnClick("sale-land"),
                    },
                    {
                      name: "Short-let",
                      onClick: () => handleBtnClick("short-let"),
                    },
                  ]}
                />
                <UserDropDown />
                <AppNotification />
              </div>
            </div>
          </nav>

          {withBreadcrumbs(pathName) && (
            <div className="sticky top-[clamp(64px,_4vw,_80px)] z-30">
              <Breadcrumbs crumbs={crumbs} />
            </div>
          )}

          <div className="mb-8 flex h-[calc(100dvh_-_clamp(64px,_4vw,_80px))] w-full overflow-y-auto px-[clamp(12px,_3vw,_24px)]">
            <div className="mx-auto mt-14 w-full max-w-screen-lg">
              {children}
            </div>
          </div>
        </div>
      </main>
      <Drawer
        open={isDrawerOpen}
        onClose={handleCloseDrawer}
        anchor="left"
        selector="drawer-root" // portal id selector
        customClass="lg:hidden"
      >
        <div className="w-full max-w-[280px]">
          <SideBar callback={() => handleCloseDrawer()} />
        </div>
      </Drawer>
    </>
  );
};
