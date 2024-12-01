import React, { forwardRef, useImperativeHandle } from "react";
import { SMSelectDropDown, TextField, Typography } from "@/components";
import { billType } from "@/constants/data";
import { fieldSetterAndClearer } from "@/utils/helpers";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";
import * as Yup from "yup";

export interface IBillingFormData {
  billType: string;
  price: string;
}

interface ChildFormProps {
  onSubmit: SubmitHandler<IBillingFormData>;
  initialData: IBillingFormData;
}

const validationSchema = Yup.object().shape({
  billType: Yup.string().required("Billing type is required"),
  price: Yup.string().required("Rental price is required"),
});

export const BillingForm = forwardRef<HTMLButtonElement, ChildFormProps>(
  ({ onSubmit, initialData }, ref) => {
    const {
      setValue,
      handleSubmit,
      clearErrors,
      watch,
      register,
      formState: { errors },
    } = useForm<IBillingFormData>({
      defaultValues: initialData,
      resolver: yupResolver(validationSchema),
    });
    console.log(initialData);
    const submitRef = React.useRef<HTMLButtonElement | null>(null);
    useImperativeHandle(ref, () => submitRef.current!);

    return (
      <form
        className="flex w-full flex-col gap-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <fieldset className="flex w-full border-b border-solid border-[#EAECF0] pb-6 mmd:flex-col mmd:gap-2">
          <div className="w-[200px]">
            <Typography variant="c-m" className="text-[#344054]">
              Listing Configured Value
            </Typography>
          </div>
          <div className="flex w-full max-w-[512px] flex-1 flex-col gap-4 lg:mx-auto">
            <div className="flex w-full flex-col gap-1">
              <label className="text-sm font-medium text-[#344054]">
                Property Billing Type
              </label>
              <SMSelectDropDown
                options={billType}
                placeholder="Select apartment Type"
                isMulti={false}
                id="billingType"
                name="billingType"
                value={
                  billType.filter(
                    (value) => value.value === watch("billType"),
                  )[0]
                }
                onChange={(value) => {
                  fieldSetterAndClearer({
                    value: value.value,
                    setterFunc: setValue,
                    setField: "billType",
                    clearErrors,
                  });
                }}
                isError={!!errors.billType}
                errorText={errors.billType?.message}
              />
            </div>
            <div className="flex w-full flex-col gap-1">
              <label className="text-sm font-medium text-[#344054]">
                Rental Price
              </label>
              <TextField
                name="price"
                inputType="input"
                type="text"
                placeholder="Enter Rental Price"
                register={register}
                error={!!errors.price}
                errorText={errors.price?.message}
              />
            </div>
          </div>
        </fieldset>
        {/* Invisible submit button */}
        <button type="submit" ref={submitRef} style={{ display: "none" }}>
          Submit
        </button>
      </form>
    );
  },
);

BillingForm.displayName = "Billing";
