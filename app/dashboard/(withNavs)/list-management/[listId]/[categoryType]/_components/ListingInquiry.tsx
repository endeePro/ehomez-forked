"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Avatar,
  ExtendedColumn,
  Modal,
  SMSelectDropDown,
  TextField,
  TMTable,
  Typography,
} from "@/components";
import { pageSizes } from "@/constants/data";
import { IInquiryInfo, useGetInquiryQuery } from "@/redux/api/property";

import { TakeInquiryAction } from "@/app/dashboard/(withNavs)/inquiry/components";

import { StatusBadge } from "../../../_components";

const inquiryTypes = [
  // { label: "All", value: undefined },
  { label: "Property Availability", value: 1 },
  { label: "Schedule Viewing", value: 2 },
  { label: "Price Inquiry", value: 3 },
  { label: "Property Features and Amenities", value: 4 },
  { label: "Lease Terms and Conditions", value: 5 },
  { label: "Move-in Date", value: 6 },
  { label: "Special Request and Customization", value: 7 },
  { label: "Others", value: 8 },
];
const inquiryStatus = [
  // { label: "All", value: undefined },
  { label: "Rescheduled", value: "Rescheduled" },
  { label: "Cancelled", value: "Closed" },
  { label: "Approved", value: "Approved" },
  { label: "Pending", value: "Pending" },
];

export default inquiryStatus;

export const ListingInquiry = ({ withId = false }: { withId?: boolean }) => {
  const path = usePathname();
  const pathSplit = path.split("/");
  const id = pathSplit[3] ?? undefined;

  const pageSize = pageSizes.md;

  const [localKeyword, setLocalKeyword] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [filterType, setFilterType] = useState<number | undefined>(undefined);
  const [filterStatus, setFilterStatus] = useState<string | undefined>(
    undefined,
  );

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedKeyword(localKeyword);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [localKeyword]);

  const extraKeyword =
    debouncedKeyword.length > 0
      ? { keyword: debouncedKeyword, filter: "name" }
      : {};
  const filters = {
    pageSize,
    pageIndex: pageNumber,
    ...extraKeyword,
    inquiryType: filterType,
    inquiryStatus: filterStatus,
  };

  const { data, isFetching, isLoading } = useGetInquiryQuery({
    filters: { ...filters, propertyId: !withId ? id : undefined },
  });
  const totalTableDataCount = data?.totalCount || 0;

  const metadata = {
    currentPage: pageNumber,
    totalPages: Math.ceil(totalTableDataCount / pageSize),
    pageSize,
    totalCount: totalTableDataCount,
    hasPrevious: pageNumber > 1,
    hasNext: pageNumber < Math.ceil(totalTableDataCount / pageSize),
  };

  const columns: ExtendedColumn<IInquiryInfo>[] = useMemo(
    () => [
      {
        Header: "Inquiry By",
        sticky: "left",
        id: "fullName",
        Cell: ({ cell: { row } }) => (
          <div className="flex items-center justify-center gap-2">
            <Avatar size="md" fullname={row?.original?.userName} />

            <div className="flex max-w-[150px] flex-col gap-1">
              <Typography color="TGD" variant="p-m" fontWeight="regular">
                {row.original.userName}
              </Typography>
              <Typography color="TGBA" variant="p-s" fontWeight="regular">
                ID: {row.original.userId}
              </Typography>
            </div>
          </div>
        ),
      },
      {
        Header: "Proposed Date",
        accessor: "proposedDate",
        Cell: ({ cell: { row } }) => (
          <div className="flex flex-col gap-1">
            <Typography noWrap color="TGD" variant="p-m" fontWeight="regular">
              {new Date(row.original.proposedDate).toDateString()}
            </Typography>
          </div>
        ),
      },
      {
        Header: "Property Name",
        accessor: "propertyId",
        Cell: ({ cell: { row } }) => (
          <div className="flex flex-col gap-1">
            <Typography noWrap color="TGD" variant="p-m" fontWeight="regular">
              {row.original?.propertyName}
            </Typography>
            {/* <Typography color="TGBA" variant="p-s" fontWeight="regular">
              ID:{row.original?.propertyId}
            </Typography> */}
          </div>
        ),
      },
      {
        Header: "Physical Visitation",
        accessor: "bookPhysicalVisitation",
        Cell: ({ cell: { row } }) => (
          <div className="flex flex-col gap-1">
            <Typography color="TGD" variant="p-m" fontWeight="regular">
              {row.original.bookPhysicalVisitation ? "Yes" : "No"}
            </Typography>
          </div>
        ),
      },
      {
        Header: "Request Type",
        accessor: "inquiryType",
        Cell: ({ cell: { row } }) => (
          <div className="flex flex-col gap-1">
            <Typography noWrap color="TGD" variant="p-m" fontWeight="regular">
              {inquiryTypes[(row.original.inquiryType ?? 1) - 1].label}
            </Typography>
          </div>
        ),
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ cell: { row } }) => (
          <div className="flex flex-col gap-1">
            <StatusBadge
              status={inquiryStatus[row.original.status - 1].value}
              statusText={inquiryStatus[row.original.status - 1].label}
            />
          </div>
        ),
      },
      {
        Header: "Action",
        id: "action",
        Cell: ({ cell: { row } }) => {
          const [show, setShow] = useState(false);

          return (
            <div className="flex flex-col gap-1 md:min-w-fit">
              <Typography
                noWrap
                color="TGD"
                variant="p-m"
                fontWeight="regular"
                className="cursor-pointer"
                onClick={() => setShow(true)}
              >
                View
              </Typography>

              <Modal
                mobileLayoutType="full"
                isOpen={show}
                closeModal={() => setShow(false)}
                title="View"
              >
                <TakeInquiryAction props={row.original} />
              </Modal>
            </div>
          );
        },
      },
    ],
    [],
  );

  const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setLocalKeyword(query);
  };

  const handleInquiryTypeFilter = (value: number) => {
    setFilterType(value);
    setPageNumber(1);
  };

  const handleStatusFilter = (value: string) => {
    setFilterStatus(value);
    setPageNumber(1);
  };

  const tableContent = (
    <TMTable<IInquiryInfo>
      columns={columns}
      data={data?.data || []}
      availablePages={metadata.totalPages}
      additionalTitleData={
        <div className="flex w-full items-center justify-between gap-8">
          <div className="w-1/2">
            <TextField
              name="name"
              placeholder={`Search for name`}
              type="search"
              value={localKeyword}
              onChange={handleKeywordChange}
            />
          </div>
          <div className="flex w-1/2 items-center gap-4">
            <SMSelectDropDown
              // @ts-expect-error
              options={[{ label: "All", value: undefined }, ...inquiryTypes]}
              placeholder="Filter by inquiry type"
              // @ts-expect-error
              value={inquiryTypes.find((f) => f.value === filterType)}
              onChange={(value) => {
                // @ts-expect-error
                handleInquiryTypeFilter(value.value);
              }}
            />
            <SMSelectDropDown
              // @ts-expect-error
              options={[{ label: "All", value: undefined }, ...inquiryStatus]}
              placeholder="Filter by status"
              value={inquiryStatus.find((f) => f.value === filterStatus)}
              onChange={(value) => {
                handleStatusFilter(value.value);
              }}
            />
          </div>
        </div>
      }
      setPageNumber={setPageNumber}
      loading={isFetching || isLoading}
      isServerSidePagination={true}
      metaData={metadata}
    />
  );
  return <div className="flex w-full [&>*]:w-full">{tableContent}</div>;
};
