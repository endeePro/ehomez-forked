"use client";

import React, { useState } from "react";
import {
  Button,
  Checkbox,
  Modal,
  notify,
  PageHeader,
  TextField,
  Typography,
} from "@/components";
import { useUserIP } from "@/hooks";
import { IApiError } from "@/redux/api/genericInterface";
import {
  ITogglePropertyAction,
  useTogglePropertyActionMutation,
} from "@/redux/api/property";
import { getErrorMessage } from "@/utils/getErrorMessges";
import { fieldSetterAndClearer } from "@/utils/helpers";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";

import { ConfirmListingDialog } from "../../../_components";

// Define the form schema
const schema = yup.object().shape({
  incompleteInformation: yup.boolean(),
  poorQualityPhotos: yup.boolean(),
  nonComplianceWithGuidelines: yup.boolean(),
  incorrectLocationData: yup.boolean(),
  inaccuratePricing: yup.boolean(),
  additionalContext: yup
    .string()
    .when(
      [
        "incompleteInformation",
        "poorQualityPhotos",
        "nonComplianceWithGuidelines",
        "incorrectLocationData",
        "inaccuratePricing",
      ],
      {
        is: (
          incomplete: boolean,
          poor: boolean,
          nonCompliance: boolean,
          incorrect: boolean,
          inaccurate: boolean,
        ) =>
          !incomplete && !poor && !nonCompliance && !incorrect && !inaccurate,
        then: () =>
          yup
            .string()
            .required(
              "Please provide additional context or select at least one reason for rejection",
            ),
        otherwise: () => yup.string(),
      },
    ),
});

type FormData = yup.InferType<typeof schema>;

const Page = (props: {
  params: {
    listId: string;
  };
}) => {
  console.log(props);
  const { ip } = useUserIP();
  const [comment, setComment] = useState("");
  const [togglePropertyAction, { isLoading: isTogglingAction, isSuccess }] =
    useTogglePropertyActionMutation();

  const [openReject, setOpenReject] = useState(false);

  const {
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
    clearErrors,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      incompleteInformation: false,
      poorQualityPhotos: false,
      nonComplianceWithGuidelines: false,
      incorrectLocationData: false,
      inaccuratePricing: false,
      additionalContext: "",
    },
  });

  const resetAll = () => {
    reset();
    setOpenReject(false);
    setComment("");
  };

  const onSubmit = (data: FormData) => {
    let commentStr = ``;

    if (data.incompleteInformation) {
      commentStr += `incomplete information`;
    }
    if (data.poorQualityPhotos) {
      commentStr += `, poor quality photos`;
    }
    if (data.nonComplianceWithGuidelines) {
      commentStr += `, non-compliance with guidelines`;
    }
    if (data.incorrectLocationData) {
      commentStr += `, incorrect location data`;
    }
    if (data.inaccuratePricing) {
      commentStr += `, inaccurate pricing`;
    }
    if ((data.additionalContext as string)?.length > 0) {
      commentStr += `, ${data.additionalContext}`;
    }
    setComment(commentStr);
    setOpenReject(true);
  };

  const handleRejectPropertyAction = async () => {
    const values: ITogglePropertyAction = {
      data: {
        ipAddress: ip as string,
        propertyStatus: 3,
        comment,
      },
      id: props.params.listId,
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
  };

  return (
    <>
      <form
        className="flex w-full flex-col gap-10"
        onSubmit={handleSubmit(onSubmit)}
      >
        <PageHeader
          title="Reject Property Listing"
          subTitle="Provide context and reasons to why you want to reject this listing."
          buttonGroup={
            <Button variant={"primary"} type="submit">
              Complete Rejection
            </Button>
          }
        />
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          <Checkbox
            checked={watch("incompleteInformation")}
            onSelect={(e) => {
              fieldSetterAndClearer({
                value: e.target.checked,
                setterFunc: setValue,
                setField: "incompleteInformation",
                clearErrors,
              });
            }}
          >
            <div className="-mt-1">
              <Typography variant="h-s" fontWeight="medium">
                Incomplete Information
              </Typography>
              <Typography variant="p-m" className="text-gray-500">
                Listings lacking essential details such as property size, number
                of rooms, or amenities can lead to rejection. Accurate and
                comprehensive information is crucial for potential buyers or
                renters.
              </Typography>
            </div>
          </Checkbox>

          <Checkbox
            checked={watch("poorQualityPhotos")}
            onSelect={(e) => {
              fieldSetterAndClearer({
                value: e.target.checked,
                setterFunc: setValue,
                setField: "poorQualityPhotos",
                clearErrors,
              });
            }}
          >
            <div className="-mt-1">
              <Typography variant="h-s" fontWeight="medium">
                Poor Quality Photos
              </Typography>
              <Typography variant="p-m" className="text-gray-500">
                Blurry, dark, or low-resolution images can result in a listing
                being rejected. High-quality, clear photos are necessary to
                attract interest and provide a true representation of the
                property.
              </Typography>
            </div>
          </Checkbox>

          <Checkbox
            checked={watch("nonComplianceWithGuidelines")}
            onSelect={(e) => {
              fieldSetterAndClearer({
                value: e.target.checked,
                setterFunc: setValue,
                setField: "nonComplianceWithGuidelines",
                clearErrors,
              });
            }}
          >
            <div className="-mt-1">
              <Typography variant="h-s" fontWeight="medium">
                Non-compliance with Guidelines
              </Typography>
              <Typography variant="p-m" className="text-gray-500">
                Listings that do not adhere to the platform's rules, such as
                prohibited content or incorrect categorization, may be rejected.
                Ensuring compliance with guidelines is vital for maintaining
                listing standards.
              </Typography>
            </div>
          </Checkbox>

          <Checkbox
            checked={watch("incorrectLocationData")}
            onSelect={(e) => {
              fieldSetterAndClearer({
                value: e.target.checked,
                setterFunc: setValue,
                setField: "incorrectLocationData",
                clearErrors,
              });
            }}
          >
            <div className="-mt-1">
              <Typography variant="h-s" fontWeight="medium">
                Incorrect Location Data
              </Typography>
              <Typography variant="p-m" className="text-gray-500">
                Providing an inaccurate address or mapping information can cause
                a listing to be dismissed. Correct location data helps potential
                clients find the property easily and assess its neighbourhood.
              </Typography>
            </div>
          </Checkbox>

          <Checkbox
            checked={watch("inaccuratePricing")}
            onSelect={(e) => {
              fieldSetterAndClearer({
                value: e.target.checked,
                setterFunc: setValue,
                setField: "inaccuratePricing",
                clearErrors,
              });
            }}
          >
            <div className="-mt-1">
              <Typography variant="h-s" fontWeight="medium">
                Inaccurate Pricing
              </Typography>
              <Typography variant="p-m" className="text-gray-500">
                Setting an unrealistic or incorrect price can lead to the
                rejection of a property listing. Accurate pricing is essential
                to meet market expectations and attract genuine interest.
              </Typography>
            </div>
          </Checkbox>

          <div className="col-span-1 lg:col-span-2">
            <TextField
              name="additionalContext"
              value={watch("additionalContext")}
              onChange={(e) => setValue("additionalContext", e.target.value)}
              inputType="textarea"
              type="text"
              placeholder="Start typing"
              label="Provide More additional Context here"
              flexStyle="row"
              className="!h-[92px]"
              error={!!errors.additionalContext}
              errorText={errors.additionalContext?.message}
            />
          </div>
        </div>
      </form>
      <Modal
        mobileLayoutType="normal"
        isOpen={openReject}
        closeModal={() => {
          if (isSuccess) resetAll();
          setOpenReject(false);
        }}
      >
        <ConfirmListingDialog
          isError={false}
          title={"Reject this Property Listing ?"}
          paragraph={
            <div className="flex flex-col gap-1">
              <Typography variant="p-m" className="text-base">
                Are you sure you want to reject this property Listing? Kindly
                note that this action would mean that the rejected listed
                property would not go live on the E-Homes app and therefore
                property manager would have to reapply for listing approval
              </Typography>
            </div>
          }
          onCancel={() => {
            if (isSuccess) resetAll();
            setOpenReject(false);
          }}
          onApprove={!isSuccess ? handleRejectPropertyAction : resetAll}
          isLoading={isTogglingAction}
          cancleBtnText={isSuccess ? "Close" : "No, Cancel"}
          proceedBtnText={isSuccess ? "Done" : "Yes, Reject"}
        />
      </Modal>
    </>
  );
};

export default Page;
