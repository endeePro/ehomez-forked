"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { UserSummaryicon } from "@/assets/svgs";
import {
  Button,
  ExtendedColumn,
  PageHeader,
  TMTable,
  Typography,
} from "@/components";
import { pageSizes, propertyStatuses } from "@/constants/data";
import { AuthRouteConfig } from "@/constants/routes";
import { IRoleRes, useGetRolesQuery, useGetRoleStatQuery } from "@/redux/api";

import { SummaryCard } from "../../_component/summaryCard";
import { StatusBadge } from "../../list-management/_components";

const ManageRoles = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pageNumber = parseInt(searchParams.get("page") || "1");
  const pageSize = pageSizes.md;
  const { data } = useGetRoleStatQuery();
  const { data: rolesData, isLoading, isFetching } = useGetRolesQuery();

  const summarys = [
    {
      label: "Total Number of Role ",
      value: data?.data?.total ?? "--",
      icon: <UserSummaryicon />,
    },
    {
      label: "Total Number of Active Role",
      value: data?.data?.active ?? "--",
      icon: <UserSummaryicon />,
    },
    {
      label: "Total Number of inactive Roles",
      value: data?.data?.inActive ?? "--",
      icon: <UserSummaryicon />,
    },
  ];
  const totalTableDataCount = rolesData?.totalCount || 0;

  const metadata = {
    currentPage: pageNumber,
    totalPages: Math.ceil(totalTableDataCount / pageSize),
    pageSize: pageSize,
    totalCount: totalTableDataCount,
    hasPrevious: pageNumber > 1,
    hasNext: pageNumber < Math.ceil(totalTableDataCount / pageSize),
  };

  const columns: ExtendedColumn<IRoleRes>[] = useMemo(
    () => [
      {
        Header: "Role Details",
        sticky: "left",
        id: "name",
        Cell: ({ cell: { row } }) => (
          <div className="flex flex-col gap-1 md:min-w-[120px]">
            <Typography color="TGD" variant="p-m" fontWeight="regular">
              {row.original.name}
            </Typography>
            <Typography color="TGBA" variant="p-s" fontWeight="regular">
              {row.original.description}
            </Typography>
          </div>
        ),
      },
      {
        Header: "Number of Users",
        accessor: "usersInRole",
        Cell: ({ cell: { row } }) => (
          <div className="flex flex-col gap-1">
            <Typography color="TGD" variant="p-m" fontWeight="regular">
              {row.original.usersInRole}
            </Typography>
          </div>
        ),
      },
      {
        Header: "Role Status",
        accessor: "isActive",
        Cell: ({ cell: { row } }) => (
          <StatusBadge
            status={propertyStatuses[row.original.isActive ? 1 : 0]}
            statusText={row.original.isActive ? "Active" : "Inactive"}
          />
        ),
      },
      {
        Header: "Number of Permission",
        accessor: "numberOfPermission",
        Cell: ({ cell: { row } }) => (
          <div className="flex flex-col gap-1">
            <Typography color="TGD" variant="p-m" fontWeight="regular">
              {row.original.numberOfPermission}
            </Typography>
          </div>
        ),
      },
      {
        Header: "Created by",
        id: "createdOn",
        Cell: ({ cell: { row } }) => (
          <div className="flex flex-col gap-1">
            <Typography color="TGD" variant="p-m" fontWeight="regular">
              {row.original.createdBy.trim() !== ""
                ? row.original.createdBy
                : "__"}
            </Typography>
            <Typography color="TGBA" variant="p-s" fontWeight="regular">
              {new Date(row.original.createdOn).toDateString()}
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
              href={`${AuthRouteConfig.ADMIN_USER_MANAGEMENT}/roles/${row.original.id}`}
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
    <TMTable<IRoleRes>
      columns={columns}
      data={rolesData?.data || []}
      availablePages={metadata.totalPages}
      setPageNumber={setPageNumber}
      loading={isFetching || isLoading}
      isServerSidePagination={true}
      metaData={metadata}
    />
  );
  return (
    <div className="flex flex-col gap-4">
      <div className="mb-12  grid grid-cols-3 gap-4 mmlg:grid-cols-2 mxxs:grid-cols-1">
        {summarys.map((summary) => (
          <SummaryCard {...summary} key={summary.label} />
        ))}
      </div>
      <div className="flex flex-col gap-4">
        <div>
          <PageHeader
            title="List of Roles"
            subTitle="List of Roles with varying access to the platform"
            buttonGroup={
              <Link
                href={`${AuthRouteConfig.ADMIN_USER_MANAGEMENT}/roles/create`}
              >
                <Button className="button-primary">Add New Role</Button>
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

export default ManageRoles;
