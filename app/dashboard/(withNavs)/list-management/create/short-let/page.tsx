"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Modal, notify, PageHeader, TabUnderline } from "@/components";
import { useUserIP } from "@/hooks";
import { RootState } from "@/redux";
import { IApiError } from "@/redux/api/genericInterface";
import {
  IRentPropertyPayload,
  useRentShortletListingMutation,
} from "@/redux/api/property";
import {
  resetState,
  setBasicInformation,
  setBillingShortlet,
  setListingMedia,
} from "@/redux/api/property/formState.slice";
import { getErrorMessage } from "@/utils/getErrorMessges";
import { base64ToFile, getMimeTypeFromBase64 } from "@/utils/helpers";
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
} from "../../_components";

type Tab = {
  label: string;
  query: string;
  content: React.ReactNode;
};

const tabQuerys = ["basic-info", "listing-media", "billing"];

const findTabIndex = (query: string) => tabQuerys.indexOf(query);

const Page: React.FC = () => {
  const { ip } = useUserIP();
  const [rentShortletMutate, { isLoading, isSuccess, reset: resetMutation }] =
    useRentShortletListingMutation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || tabQuerys[0];
  const submitButtonRef = useRef<HTMLButtonElement | null>(null);
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);
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

    if (!commission.length) {
      notify.error({ message: "Please select a commission" });
      return;
    }

    if (basicInformation && listingMedia && billingShortlet) {
      const createFileArray = (mediaArray: string[]) =>
        mediaArray
          .filter((e) => e !== "")
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
        await rentShortletMutate(values).unwrap();
        notify.success({ message: "Property listing submitted successfully" });
      } catch (err) {
        notify.error({
          message: "Unable to Create Listing",
          subtitle: getErrorMessage(err as IApiError),
        });
      }
    }
  };

  const resetAll = () => {
    dispatch(resetState());
    resetMutation();
    setCommission("");
    setIsConfirmed(false);
    setShowCommissionModal(false);
    handleTabChange(tabQuerys[0]);
  };

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
        title="Create a New Property Listing"
        subTitle="Create a New Listing with ease"
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
                : "Approve Property Listing?"
          }
          paragraph={
            isConfirmed ? (
              <>
                {!isSuccess ? (
                  <SelectComission
                    commissonValue={commission}
                    setCommisonValue={setCommission}
                  />
                ) : (
                  <SuccessfulListingMessage />
                )}
              </>
            ) : (
              `Are you sure you want to approve this property Listing? Kindly note that this action would mean that the approved listed property would go live on the E-Homes app and therefore customers would be able to inquiry about this listing. `
            )
          }
          onCancel={() => {
            if (isSuccess) resetAll();
            setShowCommissionModal(false);
            setIsConfirmed(false);
          }}
          onApprove={
            isConfirmed && !isSuccess
              ? () => handleSubmitPropertyListing()
              : isSuccess
                ? resetAll
                : () => setIsConfirmed(true)
          }
          isLoading={isLoading}
          cancleBtnText={isSuccess ? "Close" : "No, Cancel"}
          proceedBtnText={isSuccess ? "More Listing" : "Yes, Approve"}
        />
      </Modal>
    </div>
  );
};

export default Page;
