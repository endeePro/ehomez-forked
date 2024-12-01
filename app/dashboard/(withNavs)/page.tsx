"use client";

import React, { useState } from "react";
import { timePeriods } from "@/constants/data";
import { IOverviewRes, useGetOverviewQuery } from "@/redux/api";

import {
  ListingsOverview,
  Overview,
  TrendingChartOverview,
  UsersChartOverview,
} from "./_component";

const Dashboard = () => {
  const [filter, setFilter] = useState({
    dateRangeQueryType: Number(timePeriods[0].value),
  });
  const { data, isLoading, isFetching } = useGetOverviewQuery(
    filter.dateRangeQueryType,
  );

  return (
    <div className="flex flex-col gap-[71px]">
      <div
        style={{
          filter: isLoading || isFetching ? "blur(5px)" : "none",
        }}
      >
        <Overview setFilter={setFilter} data={data?.data as IOverviewRes} />
      </div>
      <div
        style={{
          filter: isLoading || isFetching ? "blur(5px)" : "none",
        }}
      >
        <ListingsOverview data={data?.data as IOverviewRes} />
      </div>
      <TrendingChartOverview />
      <UsersChartOverview />
    </div>
  );
};

export default Dashboard;
