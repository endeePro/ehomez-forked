"use client";

import React, { useMemo } from "react";
import { TextField, Typography } from "@/components";
import { PropertyById, useGetApartmentsQuery } from "@/redux/api/property";
import { formatSelectItems } from "@/utils/helpers";

interface UserInfoProps {
  label: string;
  value: string;
}

const UserInfo: React.FC<UserInfoProps> = ({ label, value }) => (
  <div className="flex border-b border-solid border-[#EAECF0] pb-6 mmd:flex-col mmd:gap-2">
    <div className="w-[200px]">
      <Typography variant="c-m" className="text-[#344054]">
        {label}
      </Typography>
    </div>
    <div className="flex-1 md:mx-auto md:max-w-[512px]">
      <TextField
        name={label.toLowerCase().replace(/\s+/g, "")}
        value={value}
        disabled
        className="bg-white"
      />
    </div>
  </div>
);

export const BasicInformation = ({ data }: { data: PropertyById }) => {
  const { data: propData, isLoading } = useGetApartmentsQuery(undefined);
  // Format apartment types for dropdown
  const apartmentsType = useMemo(
    () =>
      formatSelectItems<{ name: string; id: string }>(
        propData?.data || [],
        "name",
        "id",
      ),
    [propData?.data],
  );

  const userInfo: UserInfoProps[] = [
    { label: "Property Type", value: getPropertyType(data?.propertyType) },
    { label: "Listing Type", value: getListingType(data?.listingType) },
    {
      label: "Apartment Type",
      value: apartmentsType.find((e) => e.value === data?.apartmentTypeId)
        ?.label as string,
    },
    { label: "Number of Rooms", value: data?.numberOfRooms?.toString() },
    { label: "Number of Toilets", value: data?.numberOfToilets?.toString() },
    { label: "Location", value: data?.state },
    { label: "L.G.A", value: data?.lga },
    { label: "Address", value: data.address },
    { label: "Bill Type", value: getBillType(data?.billingInfo?.billType) },
    { label: "Price", value: data?.billingInfo?.price?.toString() || "N/A" },
    { label: "Commission", value: data?.commission?.toString() || "N/A" },
    { label: "Cleaning Fee", value: data?.cleaningFee?.toString() || "N/A" },
    {
      label: "Service Charge",
      value: data?.serviceCharge?.toString() || "N/A",
    },
    {
      label: "Security Deposit",
      value: data.securityDeposit?.toString() || "N/A",
    },
    { label: "Land Type", value: getLandType(data?.landType) },
    {
      label: "Measurement Unit",
      value: getMeasurementUnit(data?.measurementUnit),
    },
    {
      label: "Exact Land Measurement",
      value: data?.landExactMeasurement?.toString() || "N/A",
    },
  ];

  return (
    <div className="flex w-full flex-col gap-4">
      {userInfo.map((info, index) => (
        <UserInfo key={index} label={info.label} value={info.value} />
      ))}
    </div>
  );
};

function getPropertyType(type: number): string {
  const propertyTypes: Record<number, string> = {
    1: "Land",
    2: "Apartment",
  };
  return propertyTypes[type] || "Unknown";
}

function getListingType(type: number): string {
  const listingTypes: Record<number, string> = {
    1: "Sale",
    2: "Rent",
    3: "Shortlet",
  };
  return listingTypes[type] || "Unknown";
}

function getApartmentType(typeId: string): string {
  const apartmentTypes: Record<string, string> = {
    1: "Flat",
    2: "Duplex",
  };
  return apartmentTypes[typeId] || "Unknown";
}

function getBillType(billType?: number): string {
  const billTypes: Record<number, string> = {
    1: "Annually",
    2: "BiAnnually",
    3: "Quarterly",
    4: "Monthly",
    5: "Weekly",
    6: "Daily",
    7: "OnOff Payment",
  };
  return billTypes[billType as number] || "Unknown";
}

function getLandType(type: number): string {
  const landTypes: Record<number, string> = {
    0: "Dry",
    1: "Wet",
    2: "Hilltop",
  };
  return landTypes[type] || "Unknown";
}

function getMeasurementUnit(unit: number): string {
  const units: Record<number, string> = {
    0: "Plot",
    1: "Square Feet",
  };
  return units[unit] || "Unknown";
}
