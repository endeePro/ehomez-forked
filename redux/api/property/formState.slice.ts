import { billType, measurementUnits } from "@/constants/data";
import {
  attachMetadataToBase64,
  getMimeTypeFromFileName,
} from "@/utils/helpers";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import {
  IBasicInformationFormData,
  IBasicInformationRentLandFormData,
  IBillingFormData,
  IBillingSalesFormData,
  IBillingShortletFormData,
  IListingMediaFormData,
  IOwnershipDocsFormData,
  IPropertyMeasurementFormData,
} from "@/app/dashboard/(withNavs)/list-management/create/_components";

import { PropertyById } from "./interface";

interface FormState {
  basicInformation: IBasicInformationFormData | null;
  basicInformationRentLand: IBasicInformationRentLandFormData | null;
  propertyMeasurements: IPropertyMeasurementFormData | null;
  ownershipDocs: IOwnershipDocsFormData | null;
  listingMedia: IListingMediaFormData | null;
  billing: IBillingFormData | null;
  billingSales: IBillingSalesFormData | null;
  billingShortlet: IBillingShortletFormData | null;
  metaData: {
    basicInformationIsComplete: boolean;
    basicInformationRentLandIsComplete: boolean;
    propertyMeasurementsIsComplete: boolean;
    ownershipIsComplete: boolean;
    listingMediaIsComplete: boolean;
    billingIsComplete: boolean;
    billingSalesIsComplete: boolean;
    billingShortletIsComplete: boolean;
  };
}

const initialState: FormState = {
  basicInformation: null,
  basicInformationRentLand: null,
  propertyMeasurements: null,
  ownershipDocs: null,
  listingMedia: null,
  billing: null,
  billingSales: null,
  billingShortlet: null,
  metaData: {
    basicInformationIsComplete: false,
    basicInformationRentLandIsComplete: false,
    propertyMeasurementsIsComplete: false,
    ownershipIsComplete: false,
    listingMediaIsComplete: false,
    billingIsComplete: false,
    billingSalesIsComplete: false,
    billingShortletIsComplete: false,
  },
};

export type FormFields =
  | "basicInformation"
  | "basicInformationRentLand"
  | "propertyMeasurements"
  | "ownershipDocs"
  | "listingMedia"
  | "billing"
  | "billingSales"
  | "billingShortlet";

// Utility type to convert interface to mapping with string literal values

interface InitFormStatePayload {
  propertyData: PropertyById;
  formsToUpdate: FormFields[];
}

const formSlice = createSlice({
  name: "form",
  initialState,
  reducers: {
    setBasicInformation: (
      state,
      action: PayloadAction<IBasicInformationFormData>,
    ) => {
      state.basicInformation = action.payload;
      state.metaData.basicInformationIsComplete = true;
    },
    setBasicInformationRentLand: (
      state,
      action: PayloadAction<IBasicInformationRentLandFormData>,
    ) => {
      state.basicInformationRentLand = action.payload;
      state.metaData.basicInformationRentLandIsComplete = true;
    },
    setPropertyMeasurements: (
      state,
      action: PayloadAction<IPropertyMeasurementFormData>,
    ) => {
      state.propertyMeasurements = action.payload;
      state.metaData.propertyMeasurementsIsComplete = true;
    },
    setOwnershipDocs: (
      state,
      action: PayloadAction<IOwnershipDocsFormData>,
    ) => {
      state.ownershipDocs = action.payload;
      state.metaData.ownershipIsComplete = true;
    },
    setListingMedia: (state, action: PayloadAction<IListingMediaFormData>) => {
      state.listingMedia = action.payload;
      state.metaData.listingMediaIsComplete = true;
    },
    setBillingInformation: (state, action: PayloadAction<IBillingFormData>) => {
      state.billing = action.payload;
      state.metaData.billingIsComplete = true;
    },
    setBillingSales: (state, action: PayloadAction<IBillingSalesFormData>) => {
      state.billingSales = action.payload;
      state.metaData.billingSalesIsComplete = true;
    },
    setBillingShortlet: (
      state,
      action: PayloadAction<IBillingShortletFormData>,
    ) => {
      state.billingShortlet = action.payload;
      state.metaData.billingShortletIsComplete = true;
    },
    initFormState: (state, action: PayloadAction<InitFormStatePayload>) => {
      const { propertyData, formsToUpdate } = action.payload;

      if (formsToUpdate.includes("basicInformation")) {
        const basicInformationFormDataMapping: IBasicInformationFormData = {
          name: propertyData.name,
          address: propertyData.address,
          shortDescription: propertyData.shortDescription,
          longDescription: propertyData.longDescription,
          lga: propertyData.lga,
          location: propertyData.state,
          numberOfToilets: propertyData.numberOfToilets,
          numberOfRooms: propertyData.numberOfRooms,
          apartmentTypeId: propertyData.apartmentTypeId,
          state: propertyData.state,
        };
        state.basicInformation = basicInformationFormDataMapping;
        state.metaData.basicInformationIsComplete = !!state.basicInformation;
      }

      if (formsToUpdate.includes("basicInformationRentLand")) {
        const basicInformationFormRentLandDataMapping: IBasicInformationRentLandFormData =
          {
            name: propertyData.name,
            address: propertyData.address,
            shortDescription: propertyData.shortDescription,
            longDescription: propertyData.longDescription,
            lga: propertyData.lga,
            landType: propertyData.landType.toString(),
            state: propertyData.state,
          };

        state.basicInformationRentLand =
          basicInformationFormRentLandDataMapping;

        state.metaData.basicInformationRentLandIsComplete =
          Object.keys(state.basicInformationRentLand).length > 0;
      }

      if (formsToUpdate.includes("propertyMeasurements")) {
        const propertyMeasurementsMapping: IPropertyMeasurementFormData = {
          landExactMeasurement: propertyData.landExactMeasurement,
          measurementUnit: measurementUnits.filter(
            (value) => value.value === propertyData.measurementUnit.toString(),
          )[0].value,
        };
        state.propertyMeasurements = propertyMeasurementsMapping;
        state.metaData.propertyMeasurementsIsComplete =
          !!state.propertyMeasurements;
      }

      if (formsToUpdate.includes("ownershipDocs")) {
        const ownersDocMapping: IOwnershipDocsFormData = {
          certificateOfOwnership: attachMetadataToBase64(
            propertyData.landDocuments[0]?.path ??
              propertyData.apartmentDocuments[0]?.path,
            getMimeTypeFromFileName(
              propertyData.landDocuments[0]?.name ??
                propertyData.apartmentDocuments[0].name,
            ),
            propertyData.landDocuments[0]?.name ??
              propertyData.apartmentDocuments[0].name,
          ),
          governorConsent: attachMetadataToBase64(
            propertyData.landDocuments[1]?.path ??
              propertyData.apartmentDocuments[1]?.path,
            getMimeTypeFromFileName(
              propertyData.landDocuments[1]?.name ??
                propertyData.apartmentDocuments[1]?.name,
            ),
            propertyData.landDocuments[1]?.name ??
              propertyData?.apartmentDocuments[1]?.name,
          ),
          deedOfAssignment: attachMetadataToBase64(
            propertyData.landDocuments[2]?.path ??
              propertyData.apartmentDocuments[2].path,
            getMimeTypeFromFileName(
              propertyData.landDocuments[2]?.name ??
                propertyData?.apartmentDocuments[2].name,
            ),
            propertyData.landDocuments[2]?.name ??
              propertyData?.apartmentDocuments[2]?.name,
          ),
          landPurchaseReceipt: attachMetadataToBase64(
            propertyData.landDocuments[3]?.path ??
              propertyData.apartmentDocuments[3]?.path,
            getMimeTypeFromFileName(propertyData.landDocuments[3]?.name) ??
              propertyData?.apartmentDocuments[3]?.name,
            propertyData.landDocuments[3]?.name ??
              propertyData?.apartmentDocuments[3]?.name,
          ),
          landSurvey: attachMetadataToBase64(
            propertyData.landDocuments[4]?.path ??
              propertyData?.apartmentDocuments[4]?.path,
            getMimeTypeFromFileName(
              propertyData.landDocuments[4]?.name ??
                propertyData?.apartmentDocuments[4]?.name,
            ),
            propertyData.landDocuments[4]?.name ??
              propertyData?.apartmentDocuments[4]?.name,
          ),
        };
        state.ownershipDocs = ownersDocMapping;
        state.metaData.ownershipIsComplete = !!state.ownershipDocs;
      }

      if (formsToUpdate.includes("listingMedia")) {
        const listingMediaMapping: IListingMediaFormData = {
          featuredImage: propertyData.featuredImage,
          supplementaryImage1: propertyData.supplementaryImages[0]
            ? propertyData.supplementaryImages[0].path
            : undefined,
          supplementaryImage2: propertyData.supplementaryImages[1]
            ? propertyData.supplementaryImages[1].path
            : undefined,
          supplementaryImage3: propertyData.supplementaryImages[2]
            ? propertyData.supplementaryImages[2].path
            : undefined,
          supplementaryImage4: propertyData.supplementaryImages[3]
            ? propertyData.supplementaryImages[3].path
            : undefined,
          supplementaryVideo: propertyData.supplementaryVideos[0]
            ? propertyData.supplementaryVideos[0].path
            : undefined,
        };
        state.listingMedia = listingMediaMapping;
        state.metaData.listingMediaIsComplete = !!state.listingMedia;
      }

      if (formsToUpdate.includes("billing")) {
        const billingMapping: IBillingFormData = {
          billType: billType.filter(
            (value) =>
              Number(value.value) === propertyData.billingInfo.billType,
          )[0].value,
          price: propertyData.billingInfo.price.toString(),
        };
        state.billing = billingMapping;
        state.metaData.billingIsComplete = !!state.billing;
      }

      if (formsToUpdate.includes("billingSales")) {
        const billingSalesMapping: IBillingSalesFormData = {
          billType: billType.filter(
            (value) =>
              Number(value.value) === propertyData.billingInfo.billType,
          )[0].value,
          price: propertyData.billingInfo.price.toString(),
        };
        state.billingSales = billingSalesMapping;
        state.metaData.billingSalesIsComplete = !!state.billingSales;
      }

      if (formsToUpdate.includes("billingShortlet")) {
        const billingShortletMapping: IBillingShortletFormData = {
          billType: propertyData.billingInfo.billType.toString(),
          price: propertyData.billingInfo.price.toString(),
          securityDeposit: propertyData.securityDeposit
            ? propertyData.securityDeposit.toString()
            : undefined,
          cleaningFee: propertyData.cleaningFee
            ? propertyData.cleaningFee.toString()
            : undefined,
        };
        state.billingShortlet = billingShortletMapping;
        state.metaData.billingShortletIsComplete = !!state.billingShortlet;
      }
    },
    resetState: (state) => {
      state.basicInformation = null;
      state.basicInformationRentLand = null;
      state.propertyMeasurements = null;
      state.ownershipDocs = null;
      state.listingMedia = null;
      state.billing = null;
      state.billingSales = null;
      state.billingShortlet = null;

      state.metaData.basicInformationIsComplete = false;
      state.metaData.basicInformationRentLandIsComplete = false;
      state.metaData.propertyMeasurementsIsComplete = false;
      state.metaData.ownershipIsComplete = false;
      state.metaData.listingMediaIsComplete = false;
      state.metaData.billingIsComplete = false;
      state.metaData.billingSalesIsComplete = false;
      state.metaData.billingShortletIsComplete = false;
    },
  },
});

export const {
  setBasicInformation,
  setBasicInformationRentLand,
  setPropertyMeasurements,
  setOwnershipDocs,
  setListingMedia,
  setBillingInformation,
  setBillingSales,
  setBillingShortlet,
  resetState,
  initFormState,
} = formSlice.actions;
export default formSlice.reducer;
