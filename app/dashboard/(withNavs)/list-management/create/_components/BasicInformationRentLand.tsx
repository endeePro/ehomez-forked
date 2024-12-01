import React, {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import { SMSelectDropDown, TextField, Typography } from "@/components";
import { landTypes } from "@/constants/data";
import { fieldSetterAndClearer } from "@/utils/helpers";
import { yupResolver } from "@hookform/resolvers/yup";
import { City, State } from "country-state-city";
import { SubmitHandler, useForm } from "react-hook-form";
import * as Yup from "yup";

export interface IBasicInformationRentLandFormData {
  name: string;
  address: string;
  shortDescription: string;
  longDescription: string;
  lga: string;
  landType: string;
  state: string;
}

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Listing name is required"),
  address: Yup.string().required("Address is required"),
  shortDescription: Yup.string().required("Short description is required"),
  longDescription: Yup.string().required("Long description is required"),
  lga: Yup.string().required("LGA is required"),
  landType: Yup.string().required("Property type is required"),
  state: Yup.string().required("State is required"),
});

interface ChildFormProps {
  onSubmit: SubmitHandler<IBasicInformationRentLandFormData>;
  initialData: IBasicInformationRentLandFormData;
}

export const BasicInformationRentLandForm = forwardRef<
  HTMLButtonElement,
  ChildFormProps
>(({ onSubmit, initialData }, ref) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    clearErrors,
  } = useForm<IBasicInformationRentLandFormData>({
    defaultValues: initialData,
    resolver: yupResolver(validationSchema),
    mode: "onChange",
  });

  const [selectedState, setSelectedState] = useState<string | null>(null);

  // Get Nigerian states
  const statesInNigeria = useMemo(
    () =>
      State.getStatesOfCountry("NG").map((state) => ({
        label: state.name,
        value: state.isoCode,
      })),
    [],
  );

  // Get LGAs (cities) based on the selected state
  const lgaOptions = useMemo(
    () =>
      selectedState
        ? City.getCitiesOfState("NG", selectedState).map((city) => ({
            label: city.name,
            value: city.name,
          }))
        : [],
    [selectedState],
  );

  const submitRef = React.useRef<HTMLButtonElement | null>(null);
  useImperativeHandle(ref, () => submitRef.current!);

  return (
    <form
      className="flex w-full flex-col gap-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <fieldset className="flex border-b border-solid border-[#EAECF0] pb-6 mmd:flex-col mmd:gap-2">
        <div className="w-[200px]">
          <Typography variant="c-m" className="text-[#344054]">
            Property Name
          </Typography>
        </div>
        <div className="max-w-[512px] flex-1 lg:mx-auto">
          <TextField
            name="name"
            inputType="input"
            type="text"
            placeholder="Enter property name"
            register={register}
            error={!!errors.name}
            errorText={errors.name?.message}
          />
        </div>
      </fieldset>
      <fieldset className="flex w-full border-b border-solid border-[#EAECF0] pb-6 mmd:flex-col mmd:gap-2">
        <div className="w-[200px]">
          <Typography variant="c-m" className="text-[#344054]">
            Land Type
          </Typography>
        </div>
        <div className="w-full max-w-[512px] flex-1 lg:mx-auto">
          <SMSelectDropDown
            options={landTypes}
            placeholder="Select Land Type"
            isMulti={false}
            id="landType"
            name="landType"
            value={
              landTypes.filter((value) => value.value === watch("landType"))[0]
            }
            onChange={(value) => {
              fieldSetterAndClearer({
                value: value.value,
                setterFunc: setValue,
                setField: "landType",
                clearErrors,
              });
            }}
            isError={!!errors.landType}
            errorText={errors.landType?.message}
          />
        </div>
      </fieldset>

      <fieldset className="flex border-b border-solid border-[#EAECF0] pb-6 mmd:flex-col mmd:gap-2">
        <div className="w-[200px]">
          <Typography variant="c-m" className="text-[#344054]">
            Address
          </Typography>
        </div>
        <div className="max-w-[512px] flex-1 lg:mx-auto">
          <TextField
            name="address"
            inputType="input"
            type="text"
            placeholder="Enter address"
            register={register}
            error={!!errors.address}
            errorText={errors.address?.message}
          />
        </div>
      </fieldset>
      {/* State */}
      <fieldset className="flex w-full border-b border-solid border-[#EAECF0] pb-6 mmd:flex-col mmd:gap-2">
        <div className="w-[200px]">
          <Typography variant="c-m" className="text-[#344054]">
            State
          </Typography>
        </div>
        <div className="max-w-[512px] flex-1 lg:mx-auto">
          <SMSelectDropDown
            options={statesInNigeria}
            placeholder="Select a state"
            isMulti={false}
            value={statesInNigeria.find(
              (value) => value.value === watch("state"),
            )}
            onChange={(value) => {
              fieldSetterAndClearer({
                value: value.value,
                setterFunc: setValue,
                setField: "state",
                clearErrors,
              });
              setSelectedState(value.value); // Set the selected state
              setValue("lga", ""); // Reset LGA when state changes
            }}
            isError={!!errors.state}
            errorText={errors.state?.message}
          />
        </div>
      </fieldset>

      {/* LGA */}
      <fieldset className="flex w-full border-b border-solid border-[#EAECF0] pb-6 mmd:flex-col mmd:gap-2">
        <div className="w-[200px]">
          <Typography variant="c-m" className="text-[#344054]">
            LGA
          </Typography>
        </div>
        <div className="max-w-[512px] flex-1 lg:mx-auto">
          <SMSelectDropDown
            options={lgaOptions}
            placeholder="Select an LGA"
            isMulti={false}
            disabled={!selectedState}
            value={lgaOptions.find((value) => value.value === watch("lga"))}
            onChange={(value) => {
              fieldSetterAndClearer({
                value: value.value,
                setterFunc: setValue,
                setField: "lga",
                clearErrors,
              });
            }}
            isError={!!errors.lga}
            errorText={errors.lga?.message}
          />
        </div>
      </fieldset>
      <fieldset className="flex border-b border-solid border-[#EAECF0] pb-6 mmd:flex-col mmd:gap-2">
        <div className="w-[200px]">
          <Typography variant="c-m" className="text-[#344054]">
            Short Description
          </Typography>
        </div>
        <div className="max-w-[512px] flex-1 lg:mx-auto">
          <TextField
            name="shortDescription"
            inputType="textarea"
            placeholder="Enter short description"
            register={register}
            error={!!errors.shortDescription}
            errorText={errors.shortDescription?.message}
          />
        </div>
      </fieldset>
      <fieldset className="flex border-b border-solid border-[#EAECF0] pb-6 mmd:flex-col mmd:gap-2">
        <div className="w-[200px]">
          <Typography variant="c-m" className="text-[#344054]">
            Long Description
          </Typography>
        </div>
        <div className="max-w-[512px] flex-1 lg:mx-auto">
          <TextField
            name="longDescription"
            inputType="textarea"
            placeholder="Enter long description"
            register={register}
            error={!!errors.longDescription}
            errorText={errors.longDescription?.message}
            className="!h-[100px]"
          />
        </div>
      </fieldset>
      {/* Invisible submit button */}
      <button type="submit" ref={submitRef} className="sr-only">
        Submit
      </button>
    </form>
  );
});

BasicInformationRentLandForm.displayName = "BasicInformationRentLand";
