"use client";

import React from "react";
import { PageHeader, SMSelectDropDown } from "@/components";
import { timePeriods } from "@/constants/data";
import { IOverviewRes, useGetUserDetailsQuery } from "@/redux/api";

import { SummaryCard } from "./summaryCard";

export const Overview = ({
  data,
  setFilter,
}: {
  data: IOverviewRes;
  setFilter: React.Dispatch<
    React.SetStateAction<{
      dateRangeQueryType: number;
    }>
  >;
}) => {
  const { data: userResponse } = useGetUserDetailsQuery("");

  const summarys = [
    { label: "All Property", value: data?.totalListing },
    { label: "Total Property for Rent", value: data?.totalPropertyForRent },
    { label: "Total Property for Sale", value: data?.totalPropertyForSale },
    { label: "Total Short-let Property", value: data?.totalSortletProperty },
  ];
  return (
    <div>
      <PageHeader
        title={`Welcome ${userResponse?.data.firstName}!`}
        subTitle="An overview showing analytics of properties listed."
        buttonGroup={
          <SMSelectDropDown
            options={timePeriods}
            onChange={(value) => {
              setFilter({
                dateRangeQueryType: Number(value.value),
              });
            }}
          />
        }
      />
      <div className="mt-6 grid grid-cols-4 gap-4 mmlg:grid-cols-2 mxxs:grid-cols-1">
        {summarys.map((summary) => (
          <SummaryCard {...summary} key={summary.label} />
        ))}
      </div>
    </div>
  );
};
