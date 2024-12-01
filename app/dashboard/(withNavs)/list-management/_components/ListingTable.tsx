"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ActionButton,
  ExtendedColumn,
  Modal,
  notify,
  Spinner,
  TabUnderline,
  TMTable,
  Typography,
} from "@/components";
import {
  ListingType,
  pageSizes,
  propertyStatuses,
  PropertyType,
} from "@/constants/data";
import { AuthRouteConfig } from "@/constants/routes";
import { IApiError } from "@/redux/api/genericInterface";
import {
  IListingItem,
  useDisablePropertyActionMutation,
  useGetPropertyByIdQuery,
  useGetPropertyListingTableQuery,
} from "@/redux/api/property";
import { initFormState } from "@/redux/api/property/formState.slice";
import { getCurrentTimeWithAMPM } from "@/utils/getCurrentTime";
import { getErrorMessage } from "@/utils/getErrorMessges";
import {
  findPropertyStatusIndex,
  formsToPreFill,
  useAmount,
} from "@/utils/helpers";
import { useDispatch } from "react-redux";
import { Row } from "react-table";

import { ConfirmListingDialog } from "./confirmListingDialog";
import { StatusBadge } from "./StatusBadge";

type Tab = {
  label: string;
  query: string;
  count?: number;
  content: React.ReactNode;
};

const PropertyTableCell = ({
  row,
  setEditData,
  setOpenDelete,
}: {
  row: Row<IListingItem>;
  setOpenDelete: (value: React.SetStateAction<boolean>) => void;
  setEditData: (value: React.SetStateAction<object | IListingItem>) => void;
}) => {
  const [skip, setSkip] = useState(true);
  const router = useRouter();
  const dispatch = useDispatch();

  // Fetch data when skip is false
  const { data, isError, isLoading, isFetching } = useGetPropertyByIdQuery(
    {
      id: row.original.id,
    },
    {
      skip,
    },
  );

  const handleEditClick = () => {
    setSkip(false);
  };

  useEffect(() => {
    if (data && !isFetching && !isError) {
      const form =
        ListingType[row.original.listingType - 1] === "Shortlet"
          ? "short-let"
          : `${ListingType[row.original.listingType - 1]?.toLowerCase()}-${PropertyType[Number(row.original.propertyType) - 1]?.toLowerCase()}`;

      dispatch(
        initFormState({
          propertyData: data.data,
          formsToUpdate: formsToPreFill(form),
        }),
      );

      const link = `${AuthRouteConfig.ADMIN_LIST_MANAGEMENT}/${row.original.id}/edit/${form}`;
      router.push(link);
    }
  }, [data, isFetching, isError, dispatch, router, row.original]);

  return (
    <div className="relative isolate flex flex-row items-center gap-2">
      <Link
        href={`${AuthRouteConfig.ADMIN_LIST_MANAGEMENT}/${row.original.id}/${ListingType[row.original.listingType - 1]?.toLowerCase()}-${PropertyType[Number(row.original.propertyType) - 1]?.toLowerCase()}`}
      >
        <Typography color="SLGD" className="text-[#027A48] hover:underline">
          View
        </Typography>
      </Link>

      {row.original.createdByAdmin && (
        <>
          {!isLoading ? (
            <ActionButton variant="info" onClick={handleEditClick} />
          ) : (
            <div className="scale-[0.6]">
              <Spinner />
            </div>
          )}

          <ActionButton
            variant="danger"
            onClick={() => {
              setEditData(row.original);
              setOpenDelete(true);
            }}
          />
        </>
      )}
    </div>
  );
};

export const ListingTable = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeTab = searchParams.get("tab") || "all-listing";
  const findIndex = findPropertyStatusIndex(activeTab);

  const pageNumber = parseInt(searchParams.get("page") || "1");
  const pageSize = pageSizes.md;

  const propertyStatus =
    activeTab === "all-listing" ? {} : { propertyStatus: findIndex };

  const filter = {
    pageSize: pageSize,
    pageIndex: pageNumber,
    ...propertyStatus,
  };

  const {
    data: tableData,
    isFetching,
    isLoading,
  } = useGetPropertyListingTableQuery(filter);
  const [
    toggleDisableProperty,
    {
      isLoading: isDisabling,
      isSuccess: isDisableSuccess,
      reset: resetDisable,
    },
  ] = useDisablePropertyActionMutation();

  const totalTableDataCount = tableData?.totalCount || 0;

  const metadata = {
    currentPage: pageNumber,
    totalPages: Math.ceil(totalTableDataCount / pageSize),
    pageSize: pageSize,
    totalCount: totalTableDataCount,
    hasPrevious: pageNumber > 1,
    hasNext: pageNumber < Math.ceil(totalTableDataCount / pageSize),
  };
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [editData, setEditData] = useState<IListingItem | object>({});
  const columns: ExtendedColumn<IListingItem>[] = useMemo(
    () => [
      {
        Header: "Property Details",
        sticky: "left",
        id: "name",
        Cell: ({ cell: { row } }) => (
          <div className="flex flex-col gap-1">
            <Typography color="TGD" variant="p-m" fontWeight="regular">
              {row.original.name}
            </Typography>
          </div>
        ),
      },
      {
        Header: "Property Owner",
        accessor: "propertyOwner",
        Cell: ({ cell: { row } }) => (
          <div className="flex flex-col gap-1">
            <Typography color="TGD" variant="p-m" fontWeight="regular">
              {row.original.propertyOwner}
            </Typography>
          </div>
        ),
      },
      {
        Header: "Date Created",
        id: "createdAt",
        Cell: ({ cell: { row } }) => (
          <div className="flex flex-col gap-1">
            <Typography color="TGD" variant="p-m" fontWeight="regular">
              {new Date(row.original.createdOn).toDateString()}
            </Typography>
            <Typography color="TGBA" variant="p-s" fontWeight="regular">
              {getCurrentTimeWithAMPM(row.original.createdOn)}
            </Typography>
          </div>
        ),
      },
      {
        Header: "Category/Type",
        accessor: "propertyType",
        Cell: ({ cell: { row } }) => (
          <div className="flex flex-col gap-1">
            <Typography color="TGD" variant="p-m" fontWeight="regular">
              {PropertyType[row.original.propertyType - 1]}
            </Typography>
            <Typography color="TGBA" variant="p-s" fontWeight="regular">
              {ListingType[row.original.listingType - 1]}
            </Typography>
          </div>
        ),
      },
      {
        Header: "Property Value",
        accessor: "price",
        Cell: ({ cell: { row } }) => {
          const { convertToAmountInNaira } = useAmount();
          return (
            <Typography color="TGD" variant="p-m" fontWeight="regular">
              {convertToAmountInNaira(row.original.price)}
            </Typography>
          );
        },
      },
      {
        Header: "Status",
        accessor: "propertyStatus",
        Cell: ({ cell: { row } }) => (
          <StatusBadge
            status={propertyStatuses[row.original.propertyStatus - 1]}
            statusText={propertyStatuses[row.original.propertyStatus - 1]}
          />
        ),
      },
      {
        Header: "Action",
        id: "action",
        Cell: ({ cell: { row } }) => (
          <PropertyTableCell
            row={row}
            setEditData={setEditData}
            setOpenDelete={setOpenDelete}
          />
        ),
      },
    ],
    [],
  );

  const handleTabChange = (query: string) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("tab", query);
    newSearchParams.set("page", "1");
    router.push(`?${newSearchParams.toString()}`, {
      scroll: false,
    });
  };

  const setPageNumber = (page: number) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("page", page.toString());
    router.push(`?${newSearchParams.toString()}`, {
      scroll: false,
    });
  };

  const tableContent = (
    <TMTable<IListingItem>
      columns={columns}
      data={tableData?.data || []}
      availablePages={metadata.totalPages}
      setPageNumber={setPageNumber}
      loading={isFetching || isLoading}
      isServerSidePagination={true}
      metaData={metadata}
    />
  );

  const tabs: Tab[] = [
    {
      label: "All Listing",
      query: "all-listing",
      content: <div>{tableContent}</div>,
    },
    {
      label: "Approved Listing",
      query: "approved-listing",
      content: <div>{tableContent}</div>,
    },
    {
      label: "Pending Listing",
      query: "pending-listing",
      content: <div>{tableContent}</div>,
    },
    {
      label: "Closed Listing",
      query: "closed-listing",
      content: <div>{tableContent}</div>,
    },
    {
      label: "Under review",
      query: "under-review",
      content: <div>{tableContent}</div>,
    },
    {
      label: "Declined Listing",
      query: "declined-listing",
      content: <div>{tableContent}</div>,
    },
    {
      label: "Deleted Listing",
      query: "deleted-listing",
      content: <div>{tableContent}</div>,
    },
  ];
  const resetAll = useCallback(() => {
    resetDisable();
    setEditData({});
    setOpenDelete(false);
  }, [resetDisable, setEditData]);
  const handleDisablePropertyAction = useCallback(async () => {
    const values = {
      params: {
        action: 1,
      },
      id: (editData as IListingItem)?.id,
    };

    try {
      await toggleDisableProperty(values).unwrap();
      notify.success({
        message: "Property status updated successfully",
      });
      resetAll();
    } catch (error) {
      notify.error({
        message: "Unable to take action",
        subtitle: getErrorMessage(error as IApiError),
      });
    }
  }, [resetAll, editData, toggleDisableProperty]);
  return (
    <>
      <TabUnderline
        tabs={tabs}
        onChange={handleTabChange}
        activeTab={activeTab}
      />

      <Modal
        mobileLayoutType="normal"
        isOpen={openDelete}
        closeModal={() => {
          if (isDisableSuccess) resetAll();
          setOpenDelete(false);
        }}
      >
        <ConfirmListingDialog
          isError={false}
          title={"Delete Property Listing"}
          paragraph={
            <div className="flex flex-col gap-1">
              <Typography variant="p-m" className="text-base">
                Are you sure you want to delete this listing?
              </Typography>
              <Typography variant="p-m" className="text-base">
                This change will impact the financials of listed properties
                across the respective categories on the customer end.
              </Typography>
              <Typography variant="p-m" className="text-base">
                The listing will be deleted from the system.
              </Typography>
            </div>
          }
          onCancel={() => {
            if (isDisableSuccess) resetAll();
            setOpenDelete(false);
          }}
          onApprove={!isDisableSuccess ? handleDisablePropertyAction : resetAll}
          isLoading={isDisabling}
          cancleBtnText={isDisableSuccess ? "Close" : "No, Cancel"}
          proceedBtnText={isDisableSuccess ? "Done" : "Yes, Delete Listing"}
        />
      </Modal>
    </>
  );
};
