"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button, Modal, notify, PageHeader, TabUnderline } from "@/components";
import { AuthRouteConfig } from "@/constants/routes";
import { useUserIP } from "@/hooks";
import { RootState } from "@/redux";
import { IApiError } from "@/redux/api/genericInterface";
import {
  IRentPropertyPayload,
  useGetPropertyByIdQuery,
  useUpdateRentShortletListingMutation,
} from "@/redux/api/property";
import {
  initFormState,
  resetState,
  setBasicInformation,
  setBillingShortlet,
  setListingMedia,
} from "@/redux/api/property/formState.slice";
import { getErrorMessage } from "@/utils/getErrorMessges";
import {
  base64ToFile,
  formsToPreFill,
  getMimeTypeFromBase64,
  isLink,
} from "@/utils/helpers";
import { useDispatch, useSelector } from "react-redux";

import {
  BasicInformationForm,
  BillingFormShortlet,
  IBasicInformationFormData,
  IBillingShortletFormData,
  IListingMediaFormData,
  ListingMediaForm,
} from "../_components";
import {
  ConfirmListingDialog,
  SelectComission,
  SuccessfulListingMessage,
} from "../../../_components";

type Tab = {
  label: string;
  query: string;
  content: React.ReactNode;
};

const tabQuerys = ["basic-info", "listing-media", "billing"];

const findTabIndex = (query: string) => tabQuerys.indexOf(query);

const Page: React.FC = () => {
  const { ip } = useUserIP();
  const pathName = usePathname();
  const pathSplit = pathName.split("/");
  const id = pathSplit[pathSplit.length - 3];
  const { isFetching, refetch } = useGetPropertyByIdQuery(
    {
      id: id,
    },
    {
      skip: !id,
    },
  );

  const [rentShortletMutate, { isLoading, isSuccess, reset: resetMutation }] =
    useUpdateRentShortletListingMutation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || tabQuerys[0];
  const submitButtonRef = useRef<HTMLButtonElement | null>(null);
  const [showCommissionModal, setShowCommissionModal] =
    useState<boolean>(false);
  const [commission, setCommission] = useState<string>("");
  const { basicInformation, listingMedia, billingShortlet, metaData } =
    useSelector((state: RootState) => state.propertyForm);

  const activeTabIndex = findTabIndex(activeTab);

  const filledTabSeq = useMemo(
    () => [
      metaData.basicInformationIsComplete,
      metaData.listingMediaIsComplete,
      metaData.billingShortletIsComplete,
    ],
    [metaData],
  );

  const dispatch = useDispatch();

  const handleBasicInformationFormSubmit = (
    data: IBasicInformationFormData,
  ) => {
    dispatch(setBasicInformation(data));
    handleTabChange(tabs[1].query);
  };

  const handleListingMediaFormSubmit = (data: IListingMediaFormData) => {
    dispatch(setListingMedia(data));
    handleTabChange(tabs[2].query);
  };

  const handleBillingFormSubmit = (data: IBillingShortletFormData) => {
    dispatch(setBillingShortlet(data));
    setShowCommissionModal(true);
  };

  const commissionObject = commission.includes("-")
    ? { commissionId: commission }
    : { commission };

  const tabs: Tab[] = [
    {
      label: "Basic Information",
      query: "basic-info",
      content: (
        <BasicInformationForm
          onSubmit={handleBasicInformationFormSubmit}
          initialData={basicInformation as IBasicInformationFormData}
          ref={submitButtonRef}
        />
      ),
    },
    {
      label: "Listing Media",
      query: "listing-media",
      content: (
        <ListingMediaForm
          onSubmit={handleListingMediaFormSubmit}
          initialData={listingMedia as IListingMediaFormData}
          ref={submitButtonRef}
        />
      ),
    },
    {
      label: "Billing",
      query: "billing",
      content: (
        <BillingFormShortlet
          onSubmit={handleBillingFormSubmit}
          initialData={billingShortlet as IBillingShortletFormData}
          ref={submitButtonRef}
        />
      ),
    },
  ];
  const handleTabChange = useCallback(
    async (query: string) => {
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set("tab", query);
      router.push(`?${newSearchParams.toString()}`, {
        scroll: true,
      });
    },
    [searchParams, router],
  );

  const handleSubmitPropertyListing = async () => {
    if (!filledTabSeq.every(Boolean)) {
      notify.error({ message: "Please complete all tabs" });
      setShowCommissionModal(false);
      return;
    }

    if (basicInformation && listingMedia && billingShortlet) {
      const createFileArray = (mediaArray: string[]) =>
        mediaArray
          .filter((e) => e !== "" && !isLink(e))
          .filter((media) => media)
          .map(
            (media) =>
              base64ToFile(media, getMimeTypeFromBase64(media)) as File,
          );

      const values: IRentPropertyPayload = {
        ...basicInformation,
        ...billingShortlet,
        featuredImage: createFileArray([listingMedia.featuredImage])[0],
        iPAddress: ip as string,
        supplementaryImages: createFileArray([
          listingMedia.supplementaryImage1 ?? "",
          listingMedia.supplementaryImage2 ?? "",
          listingMedia.supplementaryImage3 ?? "",
          listingMedia.supplementaryImage4 ?? "",
        ]),
        supplementaryVideos: createFileArray([
          listingMedia.supplementaryVideo ?? "",
        ]),
        listingType: 3,
        propertyType: 2,
        ...commissionObject,
      };

      try {
        await rentShortletMutate({ payload: values, propertyId: id }).unwrap();
        notify.success({ message: "Property listing updated successfully" });
      } catch (err) {
        notify.error({
          message: "Unable to update Listing",
          subtitle: getErrorMessage(err as IApiError),
        });
      }
    }
  };

  const resetAll = () => {
    router.push(AuthRouteConfig.ADMIN_LIST_MANAGEMENT);
    resetMutation();
  };

  const handleRefetch = useCallback(async () => {
    try {
      const result = await refetch();
      if (result?.data) {
        const refreshedData = result.data;
        console.log("Refreshed Data:", refreshedData);
        const form = "short-let";
        dispatch(
          initFormState({
            propertyData: refreshedData.data,
            formsToUpdate: formsToPreFill(form),
          }),
        );
        handleTabChange(tabQuerys[0]);
        setShowCommissionModal(false);
        notify.success({ message: "Data refreshed successfully." });
      } else {
        notify.error({ message: "Failed to retrieve refreshed data." });
      }
    } catch (error) {
      notify.error({
        message: "Error refreshing data",
        subtitle: getErrorMessage(error as IApiError),
      });
    }
  }, [refetch]);

  useEffect(() => {
    if (
      activeTabIndex !== 0 &&
      filledTabSeq.slice(0, activeTabIndex).some((bool) => !bool)
    ) {
      handleTabChange(tabQuerys[0]);
      notify.error({ message: "Please complete previous tabs" });
    }
  }, [activeTab, activeTabIndex, filledTabSeq, handleTabChange]);

  return (
    <div className="flex w-full flex-col gap-10">
      <PageHeader
        title="Edit Property Listing"
        subTitle="Edit Listing with ease"
        buttonGroup={
          <div className="flex gap-3">
            {activeTab !== tabs[2].query && (
              <Button
                type="submit"
                disabled={isLoading}
                variant="plain"
                className="w-full border border-N40 bg-white hover:bg-N30"
                onClick={() => submitButtonRef.current?.click()}
              >
                Continue
              </Button>
            )}
            {activeTab === tabs[2].query && (
              <Button
                onClick={() => submitButtonRef.current?.click()}
                variant="primary"
                type="submit"
                className="w-full whitespace-nowrap"
                loading={isLoading}
                disabled={isLoading}
              >
                Save and Publish to Live
              </Button>
            )}
          </div>
        }
      />

      <TabUnderline
        tabs={tabs}
        onChange={(query) => {
          const reqTabIndex = findTabIndex(query);
          if (activeTabIndex <= reqTabIndex) {
            return submitButtonRef.current?.click();
          }
          return handleTabChange(query);
        }}
        activeTab={activeTab}
      />

      <Modal
        mobileLayoutType="normal"
        isOpen={showCommissionModal}
        closeModal={() => {
          if (isSuccess) resetAll();
          setShowCommissionModal(false);
        }}
      >
        <ConfirmListingDialog
          isError={isSuccess}
          title={!isSuccess ? "Edit Commission for Listing" : null}
          paragraph={
            <>
              {!isSuccess ? (
                <SelectComission
                  commissonValue={commission}
                  setCommisonValue={setCommission}
                />
              ) : (
                <SuccessfulListingMessage
                  title="Property Listing Updated"
                  message="Congratulations! property has been successfully updated."
                />
              )}
            </>
          }
          onCancel={() => {
            if (isSuccess) resetAll();
            setShowCommissionModal(false);
          }}
          onApprove={
            !isSuccess
              ? () => handleSubmitPropertyListing()
              : () => handleRefetch()
          }
          isLoading={isLoading || isFetching}
          cancleBtnText={isSuccess ? "Close" : "No, Cancel"}
          proceedBtnText={isSuccess ? "Continue" : "Yes, save"}
        />
      </Modal>
    </div>
  );
};

export default Page;
