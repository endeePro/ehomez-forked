"use client";

import React, { useState } from "react";
import {
  ChartCards,
  PageHeader,
  SMSelectDropDown,
  Typography,
} from "@/components";
import { months, years } from "@/constants/data";
import { useGetTrendingChartQuery } from "@/redux/api";

import { BarChartWrapper } from "@/components/chart/barChart";

interface Filter {
  year: string;
}

interface ChartDataItem {
  month: string;
  rentCount: number;
  saleCount: number;
  shortletCount: number;
}

interface ChartData {
  label: string;
  backgroundColors: string[];
  data: { label: string; value: number }[];
}

export const TrendingChartOverview: React.FC = () => {
  const [filter, setFilter] = useState<Filter>({ year: years[0].value });
  const { data, isLoading, isFetching } = useGetTrendingChartQuery(filter.year);

  const aspectRatio = 3;

  const createChartData = (
    label: string,
    backgroundColor: string,
    dataKey: keyof ChartDataItem,
  ): ChartData => ({
    label,
    backgroundColors: [backgroundColor],
    data: (data?.data ?? []).map((item) => ({
      label: months[Number(item.month) - 1],
      value: Number(item[dataKey]),
    })),
  });

  const chartData: ChartData[] = [
    createChartData("Rent", "#859D5A", "rentCount"),
    createChartData("Sale", "#D1EE9B", "saleCount"),
    createChartData("Short-let", "#899F97", "shortletCount"),
  ];

  return (
    <div
      className="flex flex-col gap-8"
      style={{
        filter: isLoading || isFetching ? "blur(5px)" : "none",
      }}
    >
      <PageHeader
        title={
          <Typography variant="c-xxl" fontWeight="medium" color="GB">
            Trend analyses: Listing Property Approval
          </Typography>
        }
        subTitle="Manage Listing across property management system."
        buttonGroup={
          <SMSelectDropDown
            options={years}
            onChange={(value) => setFilter({ year: value.value })}
          />
        }
      />
      <ChartCards>
        <BarChartWrapper
          type="bar"
          chartData={chartData}
          aspectRatio={aspectRatio}
          borderRadius={10}
          legendTitleX="Month"
          legendTitleY="Number of Listings"
        />
      </ChartCards>
    </div>
  );
};
