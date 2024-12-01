"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Checkbox,
  Modal,
  notify,
  PageHeader,
  TextField,
  Typography,
  ValidationText,
} from "@/components";
import { IApiError } from "@/redux/api/genericInterface";
import {
  ICommission,
  useGetCommissionByIdQuery,
  useUpdateCommissionMutation,
} from "@/redux/api/property";
import { getErrorMessage } from "@/utils/getErrorMessges";
import { fieldSetterAndClearer } from "@/utils/helpers";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";
import * as Yup from "yup";

import { ConfirmListingDialog } from "../../../list-management/_components";

export interface IEditCommissionConfigFormData {
  name: string;
  commissionType: number;
  value: number;
}

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  commissionType: Yup.number()
    .typeError("Commission Type must be a valid number")
    .required("Commission Type is required, check one of the boxes above"),
  value: Yup.number()
    .typeError("Value must be a valid number")
    .required("Value is required"),
});

const EditCommissionPage = ({
  params: { commissionId },
}: {
  params: { commissionId: string };
}) => {
  const { push } = useRouter();
  const { data, isLoading } = useGetCommissionByIdQuery({
    id: commissionId,
  });
  const [updateCommission, { isLoading: isUpdating, isSuccess }] =
    useUpdateCommissionMutation();

  const [showModal, setShowModal] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    clearErrors,
    trigger,
  } = useForm<IEditCommissionConfigFormData>({
    resolver: yupResolver(validationSchema),
    mode: "onChange",
  });

  useEffect(() => {
    if (data) {
      const commission: ICommission = data?.data;
      setValue("name", commission.name);
      setValue("commissionType", commission.commissionType);
      setValue("value", commission.value);
    }
  }, [data, setValue]);

  const onSubmit: SubmitHandler<IEditCommissionConfigFormData> = async (
    updatedData,
  ) => {
    try {
      await updateCommission({
        id: commissionId,
        data: updatedData,
      }).unwrap();
      notify.success({ message: "Commission Config Updated Successfully" });
      setShowModal(false);
      push("/dashboard/configurations/commissions", { scroll: true });
    } catch (error) {
      notify.error({
        message: "Unable to Update Commission Config",
        subtitle: getErrorMessage(error as IApiError),
      });
    }
  };

  const handleOpenModal = async () => {
    const isValid = await trigger();
    if (isValid) {
      setShowModal(true);
    } else {
      notify.error({ message: "Please complete the form before proceeding." });
    }
  };

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
      <PageHeader
        title="Edit Listing Commission Configuration"
        subTitle="Update Configuration applicable to listing on site"
        buttonGroup={
          <Button
            onClick={handleOpenModal}
            type="button"
            className="button-primary"
            disabled={isLoading || isUpdating}
          >
            Update Configuration
          </Button>
        }
      />

      <div className="mt-8 flex flex-col gap-4">
        <fieldset className="flex border-b border-solid border-[#EAECF0] pb-6 mmd:flex-col mmd:gap-2">
          <div className="w-[200px]">
            <Typography variant="c-m" className="text-[#344054]">
              Listing Configuration Name
            </Typography>
          </div>
          <div className="max-w-[512px] flex-1 lg:mx-auto">
            <TextField
              name="name"
              inputType="input"
              type="text"
              placeholder="Enter name"
              register={register}
              error={!!errors.name}
              errorText={errors.name?.message}
            />
          </div>
        </fieldset>

        <fieldset className="flex border-b border-solid border-[#EAECF0] pb-6 mmd:flex-col mmd:gap-2">
          <div className="w-[200px]">
            <Typography variant="c-m" className="text-[#344054]">
              Listing Configured Value
            </Typography>
          </div>
          <div className="flex max-w-[512px] flex-1 flex-col gap-2 lg:mx-auto">
            <Checkbox
              checked={watch("commissionType") === 1}
              id="percent"
              label="Percentage (%)"
              value="1"
              onSelect={(e) => {
                fieldSetterAndClearer({
                  value: Number(e.target.value),
                  setterFunc: setValue,
                  setField: "commissionType",
                  clearErrors,
                });
              }}
            />
            {watch("commissionType") === 1 && (
              <TextField
                name="value"
                inputType="input"
                label="Enter Associated Value"
                type="number"
                placeholder="Enter value"
                register={register}
                error={!!errors.value}
                errorText={errors.value?.message}
              />
            )}

            <Checkbox
              checked={watch("commissionType") === 2}
              id="fixed"
              label="Define x Value (In ₦)"
              value="2"
              onSelect={(e) => {
                fieldSetterAndClearer({
                  value: Number(e.target.value),
                  setterFunc: setValue,
                  setField: "commissionType",
                  clearErrors,
                });
              }}
            />
            {watch("commissionType") === 2 && (
              <TextField
                name="value"
                inputType="input"
                label="Enter Associated Value"
                type="number"
                placeholder="Enter value"
                register={register}
                error={!!errors.value}
                errorText={errors.value?.message}
              />
            )}
            {errors.commissionType?.message && (
              <ValidationText
                message={errors.commissionType?.message as string}
                status="error"
              />
            )}
          </div>
        </fieldset>
      </div>

      <Modal
        mobileLayoutType="normal"
        isOpen={showModal}
        closeModal={() => setShowModal(false)}
      >
        <ConfirmListingDialog
          isError={isSuccess}
          title="Save and Update Changes"
          paragraph={
            <div className="flex flex-col gap-1">
              <Typography variant="p-m" className="text-base">
                Are you sure you want to Save and update this new changes on the
                listing commission configurations.
              </Typography>
              <Typography variant="p-m" className="text-base">
                Kindly note that this changes would impact the financial of the
                listed properties on the customer end across the designed
                property listing category
              </Typography>
            </div>
          }
          onCancel={() => setShowModal(false)}
          onApprove={handleSubmit(onSubmit)}
          isLoading={isUpdating}
          cancleBtnText="No, Cancel"
          proceedBtnText="Yes, Save"
          type="button"
        />
      </Modal>
    </form>
  );
};

export default EditCommissionPage;
