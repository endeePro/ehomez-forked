import React, { forwardRef, useImperativeHandle } from "react";
import { SMSelectDropDown, TextField, Typography } from "@/components";
import { measurementUnits } from "@/constants/data";
import { fieldSetterAndClearer } from "@/utils/helpers";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";
import * as Yup from "yup";

export interface IPropertyMeasurementFormData {
  measurementUnit: string;
  landExactMeasurement: string;
}

interface ChildFormProps {
  onSubmit: SubmitHandler<IPropertyMeasurementFormData>;
  initialData: IPropertyMeasurementFormData;
}

const validationSchema = Yup.object().shape({
  measurementUnit: Yup.string().required("Billing type is required"),
  landExactMeasurement: Yup.string().required("Rental price is required"),
});

export const PropertyMeasurementForm = forwardRef<
  HTMLButtonElement,
  ChildFormProps
>(({ onSubmit, initialData }, ref) => {
  const {
    setValue,
    handleSubmit,
    clearErrors,
    watch,
    register,
    formState: { errors },
  } = useForm<IPropertyMeasurementFormData>({
    defaultValues: initialData,
    resolver: yupResolver(validationSchema),
  });

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
            Measurement Unit
          </Typography>
        </div>
        <div className="w-full max-w-[512px] flex-1 lg:mx-auto">
          <SMSelectDropDown
            options={measurementUnits}
            placeholder="Select apartment Type"
            isMulti={false}
            id="measurementUnit"
            name="measurementUnit"
            value={
              measurementUnits.filter(
                (value) => value.value === watch("measurementUnit"),
              )[0]
            }
            onChange={(value) => {
              fieldSetterAndClearer({
                value: value.value,
                setterFunc: setValue,
                setField: "measurementUnit",
                clearErrors,
              });
            }}
            isError={!!errors.measurementUnit}
            errorText={errors.measurementUnit?.message}
          />
        </div>
      </fieldset>
      <fieldset className="flex w-full border-b border-solid border-[#EAECF0] pb-6 mmd:flex-col mmd:gap-2">
        <div className="w-[200px]">
          <Typography variant="c-m" className="text-[#344054]">
            Land Exact Measurement
          </Typography>
        </div>
        <div className="w-full max-w-[512px] flex-1 lg:mx-auto">
          <TextField
            name={"landExactMeasurement"}
            inputType="input"
            type="number"
            placeholder="Enter a value"
            register={register}
            error={!!errors.landExactMeasurement}
            errorText={errors.landExactMeasurement?.message}
          />
        </div>
      </fieldset>
      {/* Invisible submit button */}
      <button type="submit" ref={submitRef} style={{ display: "none" }}>
        Submit
      </button>
    </form>
  );
});

PropertyMeasurementForm.displayName = "PropertyMeasurementForm";
