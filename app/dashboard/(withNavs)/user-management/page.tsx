"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PageHeader, SMSelectDropDown, TabUnderline } from "@/components";
import { timePeriods } from "@/constants/data";

import ManageRoles from "./__components/ManageRoles";
import ManageUsers from "./__components/ManageUsers";

type Tab = {
  label: string;
  query: string;
  count?: number;
  content: React.ReactNode;
};
const UserManagement = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeTab = searchParams.get("tab") || "manage-role";
  const dateRangeQueryType = parseInt(
    searchParams.get("d") || timePeriods[0].value,
  );

  const setDateNumber = (page: number) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("d", page.toString());
    router.push(`?${newSearchParams.toString()}`, {
      scroll: true,
    });
  };

  const tabs: Tab[] = [
    {
      label: "Manage Role",
      query: "manage-role",
      content: <ManageRoles />,
    },
    {
      label: "Manage Admins",
      query: "manage-users",
      content: <ManageUsers dateRangeQueryType={dateRangeQueryType} />,
    },
  ];

  const handleTabChange = (query: string) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("tab", query);
    newSearchParams.set("page", "1");
    router.push(`?${newSearchParams.toString()}`, {
      scroll: false,
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="User Management"
        subTitle="Manage users and their access within your platform"
        buttonGroup={
          activeTab !== tabs[0].query ? (
            <SMSelectDropDown
              value={
                timePeriods.filter(
                  (time) => Number(time.value) === dateRangeQueryType,
                )[0]
              }
              options={timePeriods}
              onChange={(value) => {
                setDateNumber(Number(value.value));
              }}
            />
          ) : undefined
        }
      />

      <TabUnderline
        tabs={tabs}
        onChange={handleTabChange}
        activeTab={activeTab}
      />
    </div>
  );
};

export default UserManagement;
