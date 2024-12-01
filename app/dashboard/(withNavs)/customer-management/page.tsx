"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ExtendedColumn,
  Modal,
  PageHeader,
  SMSelectDropDown,
  TabUnderline,
  TMTable,
  ToggleElement,
  Typography,
} from "@/components";
import { pageSizes, timePeriods } from "@/constants/data";
import { AuthRouteConfig } from "@/constants/routes";
import { IUserPub, useGetUsersQuery } from "@/redux/api";

import { ConfirmListingDialog } from "../list-management/_components";

type Tab = {
  label: string;
  query: string;
  content: React.ReactNode;
};

const CustomerManagement = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "customers";
  const pageNumber = parseInt(searchParams.get("page") || "1");
  const pageSize = pageSizes.md;
  const [dateRangeQueryType, setDateRangeQueryType] = useState(
    Number(timePeriods[0].value),
  );
  const [editData, setEditData] = useState<IUserPub | undefined>();
  const [showToggle, setShowToggleModal] = useState<boolean>(false);
  const filter = useMemo(
    () => ({
      pageSize,
      pageIndex: pageNumber,
      dateRangeQueryType,
      userType: activeTab === "property-owners" ? 1 : 2,
    }),
    [pageSize, pageNumber, dateRangeQueryType, activeTab],
  );

  const { data, isLoading, isFetching } = useGetUsersQuery(filter);

  const totalCount = data?.totalCount ?? 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  const columns: ExtendedColumn<IUserPub>[] = useMemo(
    () => [
      {
        Header: "Property Owner Details",
        sticky: "left",
        id: "name",
        Cell: ({ row }) => (
          <div className="flex flex-col gap-1">
            <Typography color="TGD" variant="p-m" fontWeight="regular">
              {row.original.fullName}
            </Typography>
            <Typography color="TGBA" variant="p-s" fontWeight="regular">
              ID:{row.original.id}
            </Typography>
          </div>
        ),
      },
      {
        Header: "Email Address",
        accessor: "emailAddress",
        Cell: ({ row }) => (
          <Typography color="TGD" variant="p-m" fontWeight="regular">
            {row.original.emailAddress}
          </Typography>
        ),
      },
      {
        Header: "Date Created",
        id: "createdAt",
        Cell: ({ row }) => (
          <Typography color="TGD" variant="p-m" fontWeight="regular">
            {new Date(row.original.createdOn).toDateString()}
          </Typography>
        ),
      },
      {
        Header: "Deactivate",
        id: "deactivate",
        Cell: ({ row }) => (
          <div className="flex items-center gap-4">
            <ToggleElement
              id={row.original.id}
              checked={row.original.isActive}
              onChange={() => {
                setShowToggleModal(true);
                setEditData(row.original);
              }}
            />
          </div>
        ),
      },
      {
        Header: "Action",
        id: "action",
        Cell: ({ row }) => (
          <div className="flex items-center gap-4">
            <Link
              href={`${AuthRouteConfig.ADMIN_CUSTOMER_MANAGEMENT}/${row.original.id}`}
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
    router.push(`?${newSearchParams.toString()}`, { scroll: false });
  };

  const handleTabChange = (query: string) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("tab", query);
    newSearchParams.set("page", "1");
    router.push(`?${newSearchParams.toString()}`, { scroll: false });
  };

  const renderContent = (userType: string) => (
    <div className="flex flex-col gap-8">
      <PageHeader
        title={
          <Typography variant="c-xxl" fontWeight="medium" color="GB">
            {userType === "customers"
              ? "Customer management"
              : "Property Owners management"}
          </Typography>
        }
        subTitle={`A list of all ${userType === "customers" ? "customers" : "property owners/ managers"} on the system`}
        buttonGroup={
          <SMSelectDropDown
            options={timePeriods}
            onChange={(value) => setDateRangeQueryType(Number(value.value))}
          />
        }
      />
      <div
        className="mb-5 flex flex-col gap-2"
        style={{
          filter: isLoading || isFetching ? "blur(5px)" : "none",
        }}
      >
        <Typography variant="h-m" fontWeight="medium" color="N500">
          Total Number of{" "}
          {userType === "customers"
            ? "Customers"
            : "Property owners / Managers"}
        </Typography>
        <Typography variant="h-xl" fontWeight="medium" color="GB">
          {totalCount}
        </Typography>
      </div>
      <TMTable<IUserPub>
        columns={columns}
        data={data?.data || []}
        title={
          userType === "customers"
            ? "List Of Customers"
            : "List Of Property Owners"
        }
        availablePages={totalPages}
        setPageNumber={setPageNumber}
        loading={isLoading || isFetching}
        isServerSidePagination={true}
        metaData={{
          currentPage: pageNumber,
          totalPages,
          pageSize,
          totalCount,
          hasPrevious: pageNumber > 1,
          hasNext: pageNumber < totalPages,
        }}
      />
    </div>
  );

  const tabs: Tab[] = [
    {
      label: "Customer / End Users",
      query: "customers",
      content: renderContent("customers"),
    },
    {
      label: "Property Owners / Managers",
      query: "property-owners",
      content: renderContent("property-owners"),
    },
  ];

  return (
    <div>
      <TabUnderline
        tabs={tabs}
        onChange={handleTabChange}
        activeTab={activeTab}
      />
      <Modal
        mobileLayoutType="normal"
        isOpen={showToggle}
        closeModal={() => {
          setShowToggleModal(false);
        }}
      >
        <ConfirmListingDialog
          isError={!editData?.isActive as boolean}
          title={
            editData?.isActive
              ? "Deactivate this User ?"
              : "Activate this User ?"
          }
          paragraph={
            <div className="flex flex-col gap-1">
              <Typography variant="p-m" className="text-base">
                {!editData?.isActive
                  ? `
               Are you sure you want to activate this User? Kindly note that user activities would be active 
               
               `
                  : ` Are you sure you want to deactivate this user? Kindly note that
                user information and activities would be temporarily removed
                from this system and they won’t have access to system
                functionalities again`}
              </Typography>
            </div>
          }
          onCancel={() => {
            setShowToggleModal(false);
            setEditData(undefined);
          }}
          onApprove={() => null}
          isLoading={false}
          cancleBtnText={"No, Cancel"}
          proceedBtnText={"Yes, Deactivate"}
          type="button"
          variant={editData?.isActive ? "danger" : "primary"}
        />
      </Modal>
    </div>
  );
};

export default CustomerManagement;
