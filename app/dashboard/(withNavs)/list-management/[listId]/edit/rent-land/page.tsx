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
  IRentLandPayload,
  useGetPropertyByIdQuery,
  useUpdateRentLandListingMutation,
} from "@/redux/api/property";
import {
  initFormState,
  resetState,
  setBasicInformationRentLand,
  setBillingInformation,
  setListingMedia,
  setOwnershipDocs,
  setPropertyMeasurements,
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
  BasicInformationRentLandForm,
  BillingForm,
  IBasicInformationRentLandFormData,
  IBillingFormData,
  IListingMediaFormData,
  IOwnershipDocsFormData,
  IPropertyMeasurementFormData,
  ListingMediaForm,
  OwnershipDocsForm,
  PropertyMeasurementForm,
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

const tabQuerys = ["basic-info", "measurement", "docs", "evidence", "billing"];

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

  const [rentLandMutate, { isLoading, isSuccess, reset: resetMutation }] =
    useUpdateRentLandListingMutation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || tabQuerys[0];
  const submitButtonRef = useRef<HTMLButtonElement | null>(null);
  const [showCommissionModal, setShowCommissionModal] =
    useState<boolean>(false);
  const [commission, setCommission] = useState<string>("");

  const {
    basicInformationRentLand,
    propertyMeasurements,
    ownershipDocs,
    listingMedia,
    billing,
    metaData,
  } = useSelector((state: RootState) => state.propertyForm);

  const activeTabIndex = findTabIndex(activeTab);

  const filledTabSeq = useMemo(
    () => [
      metaData.basicInformationRentLandIsComplete,
      metaData.propertyMeasurementsIsComplete,
      metaData.ownershipIsComplete,
      metaData.listingMediaIsComplete,
      metaData.billingIsComplete,
    ],
    [metaData],
  );

  const dispatch = useDispatch();

  const handleBasicInformationFormSubmit = (
    data: IBasicInformationRentLandFormData,
  ) => {
    dispatch(setBasicInformationRentLand(data));
    handleTabChange(tabs[1].query);
  };

  const handlePropertyMeasurementFormSubmit = (
    data: IPropertyMeasurementFormData,
  ) => {
    dispatch(setPropertyMeasurements(data));
    handleTabChange(tabs[2].query);
  };

  const handleOwnerShipDocsFormSubmit = (data: IOwnershipDocsFormData) => {
    dispatch(setOwnershipDocs(data));
    handleTabChange(tabs[3].query);
  };

  const handleListingMediaFormSubmit = (data: IListingMediaFormData) => {
    dispatch(setListingMedia(data));
    handleTabChange(tabs[4].query);
  };

  const handleBillingFormSubmit = (data: IBillingFormData) => {
    dispatch(setBillingInformation(data));
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
        <BasicInformationRentLandForm
          onSubmit={handleBasicInformationFormSubmit}
          initialData={
            basicInformationRentLand as IBasicInformationRentLandFormData
          }
          ref={submitButtonRef}
        />
      ),
    },
    {
      label: "Land Property Measurement",
      query: "measurement",
      content: (
        <PropertyMeasurementForm
          onSubmit={handlePropertyMeasurementFormSubmit}
          initialData={propertyMeasurements as IPropertyMeasurementFormData}
          ref={submitButtonRef}
        />
      ),
    },
    {
      label: "Land Ownership documentations",
      query: "docs",
      content: (
        <OwnershipDocsForm
          onSubmit={handleOwnerShipDocsFormSubmit}
          initialData={ownershipDocs as IOwnershipDocsFormData}
          ref={submitButtonRef}
        />
      ),
    },
    {
      label: "Land Pictorial Evidence",
      query: "evidence",
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
        <BillingForm
          onSubmit={handleBillingFormSubmit}
          initialData={billing as IBillingFormData}
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

  const handleSubmitLandListing = async () => {
    if (!filledTabSeq.every(Boolean)) {
      notify.error({ message: "Please complete all tabs" });
      setShowCommissionModal(false);
      return;
    }

    if (
      basicInformationRentLand &&
      propertyMeasurements &&
      ownershipDocs &&
      listingMedia &&
      billing
    ) {
      const createFileArray = (mediaArray: string[]) =>
        mediaArray
          .filter((e) => e !== "" && !isLink(e))
          .map(
            (media) =>
              base64ToFile(media, getMimeTypeFromBase64(media)) as File,
          );

      const values: IRentLandPayload = {
        ...basicInformationRentLand,
        ...propertyMeasurements,
        ...billing,
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
        certificateOfOwnership: createFileArray([
          ownershipDocs.certificateOfOwnership,
        ])[0],
        governorConsent: createFileArray([ownershipDocs.governorConsent])[0],
        deedOfAssignment: createFileArray([ownershipDocs.deedOfAssignment])[0],
        landPurchaseReceipt: createFileArray([
          ownershipDocs.landPurchaseReceipt,
        ])[0],
        landSurvey: createFileArray([ownershipDocs.landSurvey])[0],
        listingType: "2",
        propertyType: "1",
        ...commissionObject,
      };

      try {
        await rentLandMutate({ payload: values, propertyId: id }).unwrap();
        notify.success({
          message: "Land listing submitted successfully",
        });
      } catch (err: unknown) {
        console.error(err);
        notify.error({
          message: "Unable to Create Listing",
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
        const form = "rent-land";
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
        title="Edit Land Listing"
        subTitle="Edit Land Listing with ease"
        buttonGroup={
          <div className="flex gap-3">
            {activeTab !== tabs[tabs.length - 1].query && (
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
            {activeTab === tabs[tabs.length - 1].query && (
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
            !isSuccess ? () => handleSubmitLandListing() : () => handleRefetch()
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
