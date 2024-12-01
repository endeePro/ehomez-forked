"use client";

import React, { useCallback, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  ButtonDropdown,
  Modal,
  notify,
  PageHeader,
  PageLoader,
  TabUnderline,
  TextField,
} from "@/components";
import { useUserIP } from "@/hooks";
import { IApiError } from "@/redux/api/genericInterface";
import {
  ITogglePropertyAction,
  PropertyById,
  useDisablePropertyActionMutation,
  useGetPropertyByIdQuery,
  useTogglePropertyActionMutation,
} from "@/redux/api/property";
import { getErrorMessage } from "@/utils/getErrorMessges";

import {
  ConfirmListingDialog,
  SelectComission,
  SuccessfulListingMessage,
} from "../../_components";
import {
  ApprovalHistory,
  BasicInformation,
  BasicInformationSale,
  ChatWithAgent,
  LandDocs,
  ListingInquiry,
  ListingMedias,
} from "./_components";

type IcategoryType =
  | "rent-apartment"
  | "rent-land"
  | "sale-apartment"
  | "sale-land"
  | "short-let";

type Tab = {
  label: string;
  query: string;
  count?: number;
  content: React.ReactNode;
};

const PropertyListingPage = ({
  params: { listId, categoryType },
}: {
  params: {
    listId: string;
    categoryType: IcategoryType;
  };
}) => {
  const { data, isError, isLoading, isFetching } = useGetPropertyByIdQuery({
    id: listId,
  });
  const router = useRouter();
  const { ip } = useUserIP();
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "basic-info";

  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);
  const [showCommissionModal, setShowCommissionModal] =
    useState<boolean>(false);
  const [showCloseModal, setShowCloseModal] = useState<boolean>(false);
  const [commission, setCommission] = useState<string>("");
  const [comment, setComment] = useState("");

  const [
    togglePropertyAction,
    { isLoading: isTogglingAction, isSuccess, reset },
  ] = useTogglePropertyActionMutation();
  const [
    toggleDisableProperty,
    {
      isLoading: isDisabling,
      isSuccess: isDisableSuccess,
      reset: resetDisable,
    },
  ] = useDisablePropertyActionMutation();

  const handleTabChange = useCallback(
    (query: string) => {
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set("tab", query);
      router.push(`?${newSearchParams.toString()}`, {
        scroll: false,
      });
    },
    [router, searchParams],
  );

  const handleBtnClick = useCallback(
    (action: string) => {
      switch (action) {
        case "approve":
          setShowCommissionModal(true);
          break;
        case "reject":
          router.push(pathName + "/reject");
          break;
        case "close":
          setShowCloseModal(true);
          break;
        default:
          break;
      }
    },
    [router],
  );

  const resetAll = useCallback(() => {
    resetDisable();
    reset();
    setComment("");
    setCommission("");
    setIsConfirmed(false);
    setShowCommissionModal(false);
    setShowCloseModal(false);
  }, [reset, resetDisable]);

  const handleSubmitPropertyListingAction = useCallback(async () => {
    if (comment.length < 1 && (data?.data.propertyStatus as number) === 2) {
      notify.error({ message: "Comment is required to Decline Listing" });
      return;
    }
    if (commission.length < 1) {
      notify.error({ message: "Commission is required" });
      return;
    }
    const commissionObject = commission.includes("-")
      ? { commissionId: commission }
      : { commission };
    const commentObject = data?.data.propertyStatus === 2 ? { comment } : {};

    const values: ITogglePropertyAction = {
      data: {
        ipAddress: ip as string,
        propertyStatus: data?.data.propertyStatus === 1 ? 2 : 3,
        ...commissionObject,
        ...commentObject,
      },
      id: listId,
    };

    try {
      await togglePropertyAction(values).unwrap();
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
  }, [
    commission,
    data?.data.propertyStatus,
    ip,
    listId,
    resetAll,
    togglePropertyAction,
    comment,
  ]);
  const handleDisablePropertyAction = useCallback(async () => {
    const values = {
      params: {
        action: data?.data.propertyStatus === 2 ? 2 : 3,
      },
      id: listId,
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
  }, [data?.data.propertyStatus, listId, resetAll, toggleDisableProperty]);

  if (isLoading || isFetching) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <PageLoader />
      </div>
    );
  }

  if (isError) {
    return <div>Error loading property details</div>;
  }

  const propertyInfo = data?.data as PropertyById;

  const tabs: Tab[] = [
    {
      label: "Basic Information",
      query: "basic-info",
      content:
        categoryType === "rent-apartment" || categoryType === "short-let" ? (
          <BasicInformation data={propertyInfo} />
        ) : (
          <BasicInformationSale data={propertyInfo} />
        ),
    },
    {
      label: "Listing Media",
      query: "listing-media",
      content: <ListingMedias data={propertyInfo} />,
    },
    ...(categoryType !== "rent-apartment" && categoryType !== "short-let"
      ? [
          {
            label: categoryType.includes("land")
              ? "Land Ownership Documentations"
              : "Apartment Ownership Documentations",
            query: "land-docs",
            content: (
              <LandDocs
                data={propertyInfo}
                type={categoryType.includes("land") ? "land" : "apartment"}
              />
            ),
          },
        ]
      : []),
    {
      label: "Chat with Agent",
      query: "agent-chat",
      content: <ChatWithAgent propertyInfo={propertyInfo} />,
    },
    {
      label: "Listing Inquiry",
      query: "listing-inquiry",
      content: <ListingInquiry />,
    },
    {
      label: "Aprroval History",
      query: "comment",
      content: <ApprovalHistory propertyInfo={propertyInfo} />,
    },
  ];

  return (
    <div className="flex w-full flex-col gap-10">
      <PageHeader
        title="View Listing Specific Details"
        subTitle="An overview of property listing on E-Homes platform"
        buttonGroup={
          <ButtonDropdown
            heading="Take Actions"
            btnText="Take Actions"
            iconType="arrow-down"
            noMargin
            buttonGroup={[
              {
                name:
                  data?.data.propertyStatus === 1
                    ? "Approve Listing"
                    : "Decline Listing",
                onClick: () => handleBtnClick("approve"),
              },
              {
                name: "Reject Listing",
                onClick: () => handleBtnClick("reject"),
              },
              {
                name:
                  data?.data.propertyStatus === 2
                    ? "Close Listing"
                    : "Open Listing",
                onClick: () => handleBtnClick("close"),
              },
            ]}
          />
        }
      />
      <TabUnderline
        tabs={tabs}
        onChange={handleTabChange}
        activeTab={activeTab}
      />

      <Modal
        mobileLayoutType="normal"
        isOpen={showCommissionModal}
        closeModal={() => {
          if (isSuccess) resetAll();
          setShowCommissionModal(false);
          setIsConfirmed(false);
        }}
      >
        <ConfirmListingDialog
          isError={isSuccess}
          title={
            isConfirmed && !isSuccess
              ? "Set Commission for Listing"
              : isConfirmed && isSuccess
                ? null
                : data?.data.propertyStatus === 1
                  ? "Approve Property Listing?"
                  : "Decline Property Listing"
          }
          paragraph={
            isConfirmed ? (
              <>
                {!isSuccess ? (
                  <div>
                    <SelectComission
                      commissonValue={commission}
                      setCommisonValue={setCommission}
                    />
                    {data?.data.propertyStatus === 2 && (
                      <div className="mt-6">
                        <TextField
                          inputType={"textarea"}
                          name={"comment"}
                          value={comment}
                          label="Comment"
                          placeholder="Enter Comment"
                          onChange={(e) => {
                            console.log(e.target.value);
                            setComment(e.target.value);
                          }}
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <SuccessfulListingMessage />
                )}
              </>
            ) : data?.data.propertyStatus === 1 ? (
              `Are you sure you want to approve this property listing? Approving this action will make the property live on the E-Homes app, and customers will be able to inquire about it.`
            ) : (
              `Are you sure you want to decline this property listing? Declining will prevent it from being listed on the E-Homes app.`
            )
          }
          onCancel={() => {
            if (isSuccess) resetAll();
            setShowCommissionModal(false);
            setIsConfirmed(false);
          }}
          onApprove={
            isConfirmed && !isSuccess
              ? handleSubmitPropertyListingAction
              : isSuccess
                ? resetAll
                : () => setIsConfirmed(true)
          }
          isLoading={isTogglingAction}
          cancleBtnText={isSuccess ? "Close" : "No, Cancel"}
          proceedBtnText={
            isSuccess
              ? "Done"
              : data?.data.propertyStatus === 1
                ? "Yes, Approve"
                : "Yes, Decline"
          }
        />
      </Modal>

      <Modal
        mobileLayoutType="normal"
        isOpen={showCloseModal}
        closeModal={() => {
          if (isDisableSuccess) resetAll();
          setShowCloseModal(false);
        }}
      >
        <ConfirmListingDialog
          isError={false}
          title={
            data?.data.propertyStatus === 2
              ? "Close This Listing"
              : "Open This Listing"
          }
          paragraph={
            <>
              {data?.data.propertyStatus === 2
                ? `Are you sure close out this listing? \n Kindly note that by closing out a listing, this listing won’t show on the customer end anymore. `
                : `Are you sure open this listing? \n Kindly note that by opening a listing, this listing will show on the customer end.`}
            </>
          }
          onCancel={() => {
            if (isDisableSuccess) resetAll();
            setShowCloseModal(false);
          }}
          onApprove={!isDisableSuccess ? handleDisablePropertyAction : resetAll}
          isLoading={isDisabling}
          cancleBtnText={isDisableSuccess ? "Close" : "No, Cancel"}
          proceedBtnText={
            isDisableSuccess
              ? "Done"
              : data?.data.propertyStatus === 2
                ? "Yes, Close listing"
                : "Yes, Open Listing"
          }
        />
      </Modal>
    </div>
  );
};

export default PropertyListingPage;
