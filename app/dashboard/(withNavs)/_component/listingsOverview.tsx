"use client";

import React from "react";
import { PageHeader } from "@/components";
import { IOverviewRes } from "@/redux/api";

import { SummaryCard } from "./summaryCard";

export const ListingsOverview = ({ data }: { data: IOverviewRes }) => {
  const summarys = [
    { label: "Total Listing Approved", value: data?.totalListingApproved },
    { label: "Total Listing Rejected", value: data?.totalListingRejected },
    { label: "Pending Listing", value: data?.totalListingPending },
  ];

  return (
    <div>
      <PageHeader
        title={`Listing Property Approval`}
        subTitle="Manage Listing across property management system."
      />
      <div className="mt-6 grid grid-cols-3 gap-4 mmlg:grid-cols-2 mxxs:grid-cols-1">
        {summarys.map((summary) => (
          <SummaryCard {...summary} key={summary.label} />
        ))}
      </div>
    </div>
  );
};
