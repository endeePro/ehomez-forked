"use client";

import { useState } from "react";
import { RentHomeIcon, SalesHomeIcon, ShortLetHomeIcon } from "@/assets/svgs";
import { PageHeader, PageLoader, SMSelectDropDown } from "@/components";
import { timePeriods } from "@/constants/data";
import { useGetOverviewQuery } from "@/redux/api";

import { SummaryCard } from "../_component/summaryCard";
import { ListingTable } from "./_components";

const ListManagement = () => {
  const [filter, setFilter] = useState({
    dateRangeQueryType: Number(timePeriods[0].value),
  });
  const { data, isLoading, isFetching } = useGetOverviewQuery(
    filter.dateRangeQueryType,
  );
  const summarys = [
    {
      label: "Sale Property Listing ",
      value: data?.data?.totalPropertyForSale ?? "--",
      icon: <SalesHomeIcon />,
    },
    {
      label: "Rental Property Listing",
      value: data?.data?.totalPropertyForRent ?? "--",
      icon: <RentHomeIcon />,
    },
    {
      label: "Short Let Property Listing",
      value: data?.data?.totalSortletProperty ?? "--",
      icon: <ShortLetHomeIcon />,
    },
  ];

  if (isLoading || isFetching) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <PageLoader />
      </div>
    );
  }
  return (
    <div>
      <PageHeader
        title="Property Listing Management"
        subTitle="An overview of property listing on E-Homes platform"
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
      <div className="mb-6 mt-6 grid grid-cols-3 gap-4 mmlg:grid-cols-2 mxxs:grid-cols-1">
        {summarys.map((summary) => (
          <SummaryCard {...summary} key={summary.label} />
        ))}
      </div>
      <ListingTable />
    </div>
  );
};

export default ListManagement;
