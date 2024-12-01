"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { UsersSummaryIcon } from "@/assets/svgs";
import {
  Button,
  ExtendedColumn,
  PageHeader,
  TMTable,
  Typography,
} from "@/components";
import { pageSizes, propertyStatuses } from "@/constants/data";
import { AuthRouteConfig } from "@/constants/routes";
import { IUserPub, useGetUsersCountQuery, useGetUsersQuery } from "@/redux/api";

import { SummaryCard } from "../../_component/summaryCard";
import { StatusBadge } from "../../list-management/_components";

type Props = {
  dateRangeQueryType: number;
};

const ManageUsers = ({ dateRangeQueryType }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pageNumber = parseInt(searchParams.get("page") || "1");
  const pageSize = pageSizes.md;
  const { data, isFetching } = useGetUsersCountQuery({
    dateRangeQueryType,
    userType: 3,
  });

  const { data: users, isLoading } = useGetUsersQuery({
    pageSize,
    pageIndex: pageNumber,
    dateRangeQueryType,
    userType: 3,
  });

  const summarys = [
    {
      label: "Total Number of Admins",
      value: data?.data?.totalUsers ?? "--",
      icon: <UsersSummaryIcon />,
    },
    {
      label: "Total Number of Active Admins",
      value: data?.data?.totalActive ?? "--",
      icon: <UsersSummaryIcon />,
    },
    {
      label: "Total Number of inactive Admins",
      value: (data?.data?.totalUsers || 0) - (data?.data?.totalActive || 0),
      icon: <UsersSummaryIcon />,
    },
  ];

  const totalTableDataCount = users?.totalCount || 0;

  const metadata = {
    currentPage: pageNumber,
    totalPages: Math.ceil(totalTableDataCount / pageSize),
    pageSize: pageSize,
    totalCount: totalTableDataCount,
    hasPrevious: pageNumber > 1,
    hasNext: pageNumber < Math.ceil(totalTableDataCount / pageSize),
  };

  const columns: ExtendedColumn<IUserPub>[] = useMemo(
    () => [
      {
        Header: "User Details",
        sticky: "left",
        id: "fullName",
        Cell: ({ cell: { row } }) => (
          <div className="flex flex-col gap-1 md:min-w-[120px]">
            <Typography color="TGD" variant="p-m" fontWeight="regular">
              {row.original.fullName}
            </Typography>
            <Typography color="TGBA" variant="p-s" fontWeight="regular">
              {row.original.id}
            </Typography>
          </div>
        ),
      },
      {
        Header: "User Role",
        sticky: "left",
        id: "role",
        Cell: ({ cell: { row } }) => (
          <div className="flex flex-col gap-1 md:min-w-[120px]">
            <Typography color="TGD" variant="p-m" fontWeight="regular">
              {row.original.userType}
            </Typography>
            <Typography color="TGBA" variant="p-s" fontWeight="regular">
              {row.original.id}
            </Typography>
          </div>
        ),
      },
      {
        Header: "User Status",
        accessor: "isActive",
        Cell: ({ cell: { row } }) => (
          <StatusBadge
            status={propertyStatuses[row.original.isActive ? 1 : 0]}
            statusText={row.original.isActive ? "Active" : "Inactive"}
          />
        ),
      },
      {
        Header: "Last Active",
        id: "lastLoginDate",
        Cell: ({ cell: { row } }) => (
          <div className="flex flex-col gap-1">
            <Typography color="TGD" variant="p-m" fontWeight="regular">
              {new Date(row.original.lastLoginDate).toDateString()}
            </Typography>
            <Typography color="TGBA" variant="p-s" fontWeight="regular">
              {new Date(row.original.lastLoginDate).getTime()}
            </Typography>
          </div>
        ),
      },
      {
        Header: "User Email",
        accessor: "emailAddress",
        Cell: ({ cell: { row } }) => (
          <div className="flex flex-col gap-1">
            <Typography color="TGD" variant="p-m" fontWeight="regular">
              {row.original.emailAddress}
            </Typography>
          </div>
        ),
      },
      {
        Header: "Action",
        id: "action",
        Cell: ({ cell: { row } }) => (
          <div className="relative isolate flex gap-4">
            <Link
              href={`${AuthRouteConfig.ADMIN_USER_MANAGEMENT}/users/${row.original.id}`}
            >
              <Typography
                color="SLGD"
                className="text-[#027A48] hover:underline"
              >
                View
              </Typography>
            </Link>
          </div>
        ),
      },
    ],
    [],
  );

  const setPageNumber = (page: number) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("page", page.toString());
    router.push(`?${newSearchParams.toString()}`, {
      scroll: false,
    });
  };

  const tableContent = (
    <TMTable<IUserPub>
      columns={columns}
      data={users?.data || []}
      availablePages={metadata.totalPages}
      setPageNumber={setPageNumber}
      loading={isFetching || isLoading}
      isServerSidePagination={true}
      metaData={metadata}
    />
  );
  return (
    <div className="flex flex-col gap-4">
      <div
        style={{
          filter: isFetching ? "blur(5px)" : "none",
        }}
        className="mb-12 grid grid-cols-3 gap-4 mmlg:grid-cols-2 mxxs:grid-cols-1"
      >
        {summarys.map((summary) => (
          <SummaryCard {...summary} key={summary.label} />
        ))}
      </div>

      <div className="flex flex-col gap-4">
        <div>
          <PageHeader
            title="List of Admins"
            subTitle="List of Admins with varying access to the platform"
            buttonGroup={
              <Link
                href={`${AuthRouteConfig.ADMIN_USER_MANAGEMENT}/users/create`}
              >
                <Button className="button-primary">Add New Admin</Button>
              </Link>
            }
          />
          <hr className="mt-2" />
        </div>
        {tableContent}
      </div>
    </div>
  );
};

export default ManageUsers;
