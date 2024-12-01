"use client";

import React, { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ChartCards,
  ChartWrapper,
  PageHeader,
  SMSelectDropDown,
  TabUnderline,
  Typography,
} from "@/components";
import { months, years } from "@/constants/data";
import { useGetAgentChartQuery } from "@/redux/api";

type Tab = {
  label: string;
  query: string;
  count?: number;
  content: React.ReactNode;
};

interface Filter {
  year: string;
  userType: number;
}

export const UsersChartOverview = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "property-owners";

  const [filter, setFilter] = React.useState<Filter>({
    year: years[0].value,
    userType: activeTab === "property-owners" ? 1 : 2,
  });

  const { data, isLoading, isFetching } = useGetAgentChartQuery({
    year: filter.year,
    userType: filter.userType.toString(),
  });

  const aspectRatio = 3;
  const dataSetLabels = useMemo(() => ["Users"], []);
  const backgroundColors = useMemo(() => ["#859D5A"], []);

  const chartData = useMemo(
    () =>
      (data?.data?.monthlyStats ?? []).map((stats) => ({
        label: months[Number(stats.month) - 1],
        value: stats.count,
      })),
    [data],
  );

  const chatContent = useMemo(
    () => (
      <ChartWrapper
        type="bar"
        chartData={chartData}
        backgrounds={backgroundColors}
        stepSize={20}
        aspectRatio={aspectRatio}
        borderRadius={10}
        datasetLabels={dataSetLabels}
      />
    ),
    [chartData, backgroundColors, aspectRatio, dataSetLabels],
  );

  const tabs: Tab[] = useMemo(
    () => [
      {
        label: "Property Owners",
        query: "property-owners",
        content: (
          <div className="flex flex-col">
            <div className="mb-5 flex flex-col gap-2">
              <Typography variant="h-m" fontWeight="medium" color="N500">
                Total Number of Users
              </Typography>
              <Typography variant={"h-xl"} fontWeight="medium" color="GB">
                {data?.data?.totalUsersForYear}
              </Typography>
            </div>
            <ChartCards>{chatContent}</ChartCards>
          </div>
        ),
      },
      {
        label: "Customers",
        query: "customers",
        content: (
          <div className="flex flex-col">
            <div className="mb-5 flex flex-col gap-2">
              <Typography variant="h-m" fontWeight="medium" color="N500">
                Total Number of Users
              </Typography>
              <Typography variant={"h-xl"} fontWeight="medium" color="GB">
                {data?.data?.totalUsersForYear}
              </Typography>
            </div>
            <ChartCards>{chatContent}</ChartCards>
          </div>
        ),
      },
    ],
    [data, chatContent],
  );

  const handleTabChange = React.useCallback(
    (query: string) => {
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set("tab", query);
      router.push(`?${newSearchParams.toString()}`, { scroll: false });
      setFilter((prevFilter) => ({
        ...prevFilter,
        userType: query === "property-owners" ? 1 : 2,
      }));
    },
    [router, searchParams],
  );

  return (
    <div
      className="flex flex-col gap-8"
      style={{
        filter: isLoading || isFetching ? "blur(5px)" : "none",
      }}
    >
      <PageHeader
        title={
          <div>
            <Typography variant="c-xxl" fontWeight="medium" color="GB">
              <span className="text-[#D92D20]"> Registrations:</span> Property
              Owner & Customer
            </Typography>
          </div>
        }
        subTitle="Managing property owners and customer on the platform."
        buttonGroup={
          <SMSelectDropDown
            options={years}
            onChange={(value) => setFilter({ ...filter, year: value.value })}
          />
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
