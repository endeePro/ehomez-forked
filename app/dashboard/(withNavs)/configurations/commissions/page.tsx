"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ActionButton,
  Button,
  ExtendedColumn,
  Modal,
  notify,
  PageHeader,
  TMTable,
  ToggleElement,
  Typography,
} from "@/components";
import { propertyStatuses } from "@/constants/data";
import { IApiError } from "@/redux/api/genericInterface";
import {
  ICommission,
  useDeleteCommissionMutation,
  useGetCommissionsQuery,
  useToggleCommissionStatusMutation,
} from "@/redux/api/property";
import { getErrorMessage } from "@/utils/getErrorMessges";

import {
  ConfirmListingDialog,
  StatusBadge,
} from "../../list-management/_components";

const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data, isLoading, isFetching, refetch } =
    useGetCommissionsQuery(undefined);
  const [
    deleteCommission,
    { isLoading: isDeleting, isSuccess: isDeleted, reset: resetDelete },
  ] = useDeleteCommissionMutation();
  const [
    toggleCommission,
    { isLoading: isToggling, isSuccess: isToggled, reset },
  ] = useToggleCommissionStatusMutation();
  const metadata = {
    currentP: 1,
    totalPages: 1,
    pageSize: data?.data.length ?? 12,
    totalCount: data?.totalCount || 0,
    hasPrevious: false,
    hasNext: false,
  };

  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [showToggleModal, setShowToggleModal] = useState<boolean>(false);
  const [editData, setEditData] = useState<ICommission | object>({});
  const columns: ExtendedColumn<ICommission>[] = useMemo(
    () => [
      {
        Header: "Configuration Detail",
        sticky: "left",
        id: "name",
        Cell: ({ cell: { row } }) => (
          <div className="flex flex-col gap-1">
            <Typography color="TGD" variant="p-m" fontWeight="regular">
              {row.original.name}
            </Typography>
            <Typography color="TGBA" variant="p-s" fontWeight="regular">
              ID: {row.original.id}
            </Typography>
          </div>
        ),
      },
      {
        Header: "Created by",
        accessor: "createdByUserName",
        Cell: ({ cell: { row } }) => (
          <div className="flex flex-col gap-1">
            <Typography color="TGD" variant="p-m" fontWeight="regular">
              {row.original.createdByUserName}
            </Typography>
            <Typography color="TGBA" variant="p-s" fontWeight="regular">
              ID: {row.original.id}
            </Typography>
          </div>
        ),
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ cell: { row } }) => (
          <StatusBadge
            status={propertyStatuses[row.original.status ? 1 : 0]}
            statusText={row.original.status ? "Active" : "Inactive"}
          />
        ),
      },
      {
        Header: "Action",
        id: "action",
        Cell: ({ cell: { row } }) => (
          <div className="relative isolate flex items-center gap-1">
            <ToggleElement
              id={row.original.id}
              checked={row.original.status}
              onChange={() => {
                setShowToggleModal(true);
                setEditData(row.original);
              }}
            />
            <Link
              href={`/dashboard/configurations/commissions/${row.original.id}`}
            >
              <ActionButton variant="info" onClick={() => null} />
            </Link>
            <ActionButton
              variant="danger"
              onClick={() => {
                setEditData(row.original);
                setOpenDelete(true);
              }}
            />
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

  const resetAll = () => {
    resetDelete();
    reset();
    refetch();
  };
  const handleDeleteCommission = async (commissionId: string) => {
    try {
      await deleteCommission({ id: commissionId });
      notify.success({ message: "Commission deleted successfully" });
      setOpenDelete(false);
      setEditData({});
      resetAll();
    } catch (error) {
      notify.error({
        message: "Unable to delete commission",
        subtitle: getErrorMessage(error as IApiError),
      });
    }
  };
  const handleToggleCommissionStatus = async (commissionId: string) => {
    try {
      await toggleCommission({ id: commissionId });
      notify.success({ message: "Commission status updated successfully" });
      setShowToggleModal(false);
      setEditData({});
      resetAll();
    } catch (error) {
      notify.error({
        message: "Unable to update commission status",
        subtitle: getErrorMessage(error as IApiError),
      });
    }
  };

  const tableContent = (
    <TMTable<ICommission>
      columns={columns}
      data={data?.data || []}
      availablePages={metadata.totalPages}
      setPageNumber={setPageNumber}
      loading={isFetching || isLoading}
      isServerSidePagination={true}
      // @ts-expect-error : is valid
      metaData={metadata}
    />
  );

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Listing Commission Configuration"
        subTitle="Manage Configuration applicable to listing on site"
        buttonGroup={
          <Link href={"/dashboard/configurations/commissions/add"}>
            <Button className="button-primary">Add New</Button>
          </Link>
        }
      />
      {tableContent}
      <Modal
        mobileLayoutType="normal"
        isOpen={showToggleModal}
        closeModal={() => {
          setShowToggleModal(false);
        }}
      >
        <ConfirmListingDialog
          isError={isToggled}
          title={
            (editData as ICommission)?.status
              ? "Deactivate Listing Configuration"
              : "Activate Listing Configuration"
          }
          paragraph={
            <div className="flex flex-col gap-1">
              <Typography variant="p-m" className="text-base">
                Are you sure you want to{" "}
                {(editData as ICommission)?.status ? "deactivate" : "activate"}{" "}
                this listing commission configuration?
              </Typography>
              <Typography variant="p-m" className="text-base">
                This change will impact the financials of listed properties
                across the respective categories on the customer end.
              </Typography>
            </div>
          }
          onCancel={() => {
            setShowToggleModal(false);
            setEditData({});
          }}
          onApprove={() =>
            handleToggleCommissionStatus((editData as ICommission)?.id)
          }
          isLoading={isToggling}
          cancleBtnText={"No, Cancel"}
          proceedBtnText={"Yes, Toggle"}
          type="button"
        />
      </Modal>
      <Modal
        mobileLayoutType="normal"
        isOpen={openDelete}
        closeModal={() => {
          setOpenDelete(false);
        }}
      >
        <ConfirmListingDialog
          isError={isDeleted}
          title={"Delete Listing Configuration"}
          paragraph={
            <div className="flex flex-col gap-1">
              <Typography variant="p-m" className="text-base">
                Are you sure you want to delete this listing commission
                configuration?
              </Typography>
              <Typography variant="p-m" className="text-base">
                This change will impact the financials of listed properties
                across the respective categories on the customer end.
              </Typography>
              <Typography variant="p-m" className="text-base">
                The listing configuration will revert to the default settings.
              </Typography>
            </div>
          }
          onCancel={() => {
            setOpenDelete(false);
            setEditData({});
          }}
          onApprove={() =>
            handleDeleteCommission((editData as ICommission)?.id)
          }
          isLoading={isDeleting}
          cancleBtnText={"No, Cancel"}
          proceedBtnText={"Yes, Delete"}
          type="button"
        />
      </Modal>
    </div>
  );
};

export default Page;
