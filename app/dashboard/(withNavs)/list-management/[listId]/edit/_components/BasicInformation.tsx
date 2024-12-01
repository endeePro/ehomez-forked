import React, { forwardRef, useImperativeHandle, useMemo } from "react";
import { SMSelectDropDown, TextField, Typography } from "@/components";
import { useGetApartmentsQuery } from "@/redux/api/property";
import { fieldSetterAndClearer, formatSelectItems } from "@/utils/helpers";
import { yupResolver } from "@hookform/resolvers/yup";
import { City, State } from "country-state-city";
import { SubmitHandler, useForm } from "react-hook-form";
import * as Yup from "yup";

export interface IBasicInformationFormData {
  name: string;
  address: string;
  shortDescription: string;
  longDescription: string;
  lga: string;
  location: string;
  numberOfToilets: number;
  numberOfRooms: number;
  apartmentTypeId: string;
  state: string;
}

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Listing name is required"),
  address: Yup.string().required("Address is required"),
  shortDescription: Yup.string().required("Short description is required"),
  longDescription: Yup.string().required("Long description is required"),
  lga: Yup.string().required("LGA is required"),
  location: Yup.string().required("Location is required"),
  numberOfToilets: Yup.number()
    .typeError("Number of toilets must be a whole number")
    .required("Number of toilets is required")
    .min(1, "Must have at least 1 toilet")
    .integer("Must be a whole number"),
  numberOfRooms: Yup.number()
    .typeError("Number of rooms must be a whole number")
    .required("Number of rooms is required")
    .min(1, "Must have at least 1 room")
    .integer("Must be a whole number"),
  apartmentTypeId: Yup.string().required("Apartment type is required"),
  state: Yup.string().required("State is required"),
});

interface ChildFormProps {
  onSubmit: SubmitHandler<IBasicInformationFormData>;
  initialData: IBasicInformationFormData;
}

export const BasicInformationForm = forwardRef<
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
  } = useForm<IBasicInformationFormData>({
    defaultValues: initialData,
    resolver: yupResolver(validationSchema),
    mode: "onChange",
  });

  const selectedState = watch("state");

  const statesInNigeria = useMemo(
    () =>
      State.getStatesOfCountry("NG").map((state) => ({
        label: state.name,
        value: state.isoCode,
      })),
    [],
  );

  const lgaOptions = useMemo(
    () =>
      selectedState?.length > 0
        ? City.getCitiesOfState("NG", selectedState).map((city) => ({
            label: city.name,
            value: city.name,
          }))
        : [],
    [selectedState],
  );

  const { data, isLoading } = useGetApartmentsQuery(undefined);
  const submitRef = React.useRef<HTMLButtonElement | null>(null);
  useImperativeHandle(ref, () => submitRef.current!);

  const apartmentsType = useMemo(
    () =>
      formatSelectItems<{ name: string; id: string }>(
        data?.data || [],
        "name",
        "id",
      ),
    [data?.data],
  );

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
            Apartment Type
          </Typography>
        </div>
        <div className="w-full max-w-[512px] flex-1 lg:mx-auto">
          <SMSelectDropDown
            // @ts-expect-error
            options={apartmentsType}
            placeholder="Select apartment Type"
            isMulti={false}
            loading={isLoading}
            id="apartmentTypeId"
            name="apartmentTypeId"
            // @ts-expect-error
            value={
              apartmentsType.filter(
                (value) => value.value === watch("apartmentTypeId"),
              )[0]
            }
            onChange={(value) => {
              fieldSetterAndClearer({
                value: value.value,
                setterFunc: setValue,
                setField: "apartmentTypeId",
                clearErrors,
              });
            }}
            isError={!!errors.apartmentTypeId}
            errorText={errors.apartmentTypeId?.message}
          />
        </div>
      </fieldset>
      <fieldset className="flex border-b border-solid border-[#EAECF0] pb-6 mmd:flex-col mmd:gap-2">
        <div className="w-[200px]">
          <Typography variant="c-m" className="text-[#344054]">
            Number of Rooms
          </Typography>
        </div>
        <div className="max-w-[512px] flex-1 lg:mx-auto">
          <TextField
            name="numberOfRooms"
            inputType="input"
            type="number"
            placeholder="Enter number of rooms"
            register={register}
            error={!!errors.numberOfRooms}
            errorText={errors.numberOfRooms?.message}
          />
        </div>
      </fieldset>
      <fieldset className="flex border-b border-solid border-[#EAECF0] pb-6 mmd:flex-col mmd:gap-2">
        <div className="w-[200px]">
          <Typography variant="c-m" className="text-[#344054]">
            Number of Toilets
          </Typography>
        </div>
        <div className="max-w-[512px] flex-1 lg:mx-auto">
          <TextField
            name="numberOfToilets"
            inputType="input"
            type="number"
            placeholder="Enter number of toilets"
            register={register}
            error={!!errors.numberOfToilets}
            errorText={errors.numberOfToilets?.message}
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
                clearFields: ["lga"],
                clearErrors,
              });
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
            disabled={selectedState?.length < 1}
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
            Location
          </Typography>
        </div>
        <div className="max-w-[512px] flex-1 lg:mx-auto">
          <TextField
            name="location"
            inputType="input"
            type="text"
            placeholder="Enter location"
            register={register}
            error={!!errors.location}
            errorText={errors.location?.message}
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

      {/* Invisible Submit Button */}
      <button type="submit" ref={submitRef} className="sr-only">
        Submit
      </button>
    </form>
  );
});

BasicInformationForm.displayName = "BasicInformation";
