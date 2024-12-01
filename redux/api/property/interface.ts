import {
  IBasicInformationFormData,
  IBasicInformationRentLandFormData,
  IBillingFormData,
  IBillingSalesFormData,
  IListingMediaFormData,
  IOwnershipDocsFormData,
  IPropertyMeasurementFormData,
} from "@/app/dashboard/(withNavs)/list-management/create/_components";

export interface IListingItem {
  id: string;
  createdByAdmin: boolean;
  name: string;
  featuredImage: string;
  address: string;
  propertyOwner: string;
  state: string;
  numberOfRooms: number;
  numberOfToilets: number;
  propertyType: number;
  propertyStatus: number;
  listingType: number;
  price: number;
  createdOn: string;
}
export interface IAgentChartReq {
  year: string;
  userType: string;
}
export interface IAgentChartRes {
  totalUsersForYear: string;
  monthlyStats: {
    month: string;
    count: number;
  }[];
}

export interface BillingInfo {
  billingInfoId: string;
  billType: number;
  price: number;
}

export interface SupplementaryImage {
  fileUploadId: string;
  name: string;
  path: string;
  contentType: string;
  resourceLenght: number;
  id: string;
}

export interface SupplementaryVideo {
  fileUploadId: string;
  name: string;
  path: string;
  contentType: string;
  resourceLenght: number;
  id: string;
}

export interface LandDocument {
  fileUploadId: string;
  name: string;
  path: string;
  contentType: string;
  resourceLenght: number;
  id: string;
  documentType: number;
}

export interface ApprovalHistory {
  propertyId: string;
  comment: string;
  adminActionBy: string;
  adminActionById: string;
  propertyStatus: number;
  commissionId: string;
  createdOn: string;
  commission: number;
}

export interface PropertyById {
  id: string;
  name: string;
  featuredImage: string;
  createdByAdmin: boolean;
  address: string;
  state: string;
  lga: string;
  shortDescription: string;
  longDescription: string;
  propertyType: number;
  propertyStatus: number;
  listingType: number;
  billingInfo: BillingInfo;
  landExactMeasurement: string;
  measurementUnit: number;
  numberOfRooms: number;
  numberOfToilets: number;
  commission: number;
  cleaningFee: number;
  serviceCharge: number;
  securityDeposit: number;
  landType: number;
  apartmentTypeId: string;
  supplementaryImages: SupplementaryImage[];
  supplementaryVideos: SupplementaryVideo[];
  landDocuments: LandDocument[];
  apartmentDocuments: LandDocument[];
  approvalHistories: ApprovalHistory[];
  phone: string;
}

export interface IRentPropertyPayload
  extends IBasicInformationFormData,
    Omit<
      IListingMediaFormData,
      | "supplementaryImage1"
      | "supplementaryImage2"
      | "supplementaryImage3"
      | "supplementaryImage4"
      | "supplementaryVideo"
      | "featuredImage"
    >,
    IBillingFormData {
  iPAddress: string;
  supplementaryVideos: File[];
  supplementaryImages: Array<File>;
  featuredImage: File;
  listingType: number;
  supplementaryImagesToDelete?: string[];
  supplementaryVideosToDelete?: string[];
  propertyType: number;
  commission?: string;
  commissionId?: string;
}
export interface IEditRentPropertyPayload
  extends IBasicInformationFormData,
    Omit<
      IListingMediaFormData,
      | "supplementaryImage1"
      | "supplementaryImage2"
      | "supplementaryImage3"
      | "supplementaryImage4"
      | "supplementaryVideo"
      | "featuredImage"
    >,
    IBillingFormData {
  iPAddress: string;
  supplementaryVideos: File[];
  supplementaryImages: Array<File>;
  featuredImage?: File;
  listingType: number;
  supplementaryImagesToDelete?: string[];
  supplementaryVideosToDelete?: string[];
  propertyType: number;
  commission?: string;
  commissionId?: string;
}
export interface IRentShortletPayload
  extends IBasicInformationFormData,
    Omit<
      IListingMediaFormData,
      | "supplementaryImage1"
      | "supplementaryImage2"
      | "supplementaryImage3"
      | "supplementaryImage4"
      | "supplementaryVideo"
      | "featuredImage"
    >,
    IBillingFormData {
  iPAddress: string;
  supplementaryVideos: File[];
  supplementaryImages: Array<File>;
  featuredImage: File;
  listingType: number;
  propertyType: number;
  commission?: string;
  commissionId?: string;
}
export interface IRentLandPayload
  extends IBasicInformationRentLandFormData,
    IPropertyMeasurementFormData,
    Omit<IOwnershipDocsFormData, keyof IOwnershipDocsFormData>,
    Omit<
      IListingMediaFormData,
      | "supplementaryImage1"
      | "supplementaryImage2"
      | "supplementaryImage3"
      | "supplementaryImage4"
      | "supplementaryVideo"
      | "featuredImage"
    >,
    IBillingFormData {
  iPAddress: string;
  supplementaryVideos: File[];
  supplementaryImages: Array<File>;
  featuredImage: File;
  certificateOfOwnership: File; // Base64 string
  governorConsent: File;
  deedOfAssignment: File;
  landPurchaseReceipt: File;
  landSurvey: File;
  listingType: string;
  propertyType: string;
}
export interface ISaleLandPayload
  extends IBasicInformationRentLandFormData,
    IPropertyMeasurementFormData,
    Omit<IOwnershipDocsFormData, keyof IOwnershipDocsFormData>,
    Omit<
      IListingMediaFormData,
      | "supplementaryImage1"
      | "supplementaryImage2"
      | "supplementaryImage3"
      | "supplementaryImage4"
      | "supplementaryVideo"
      | "featuredImage"
    >,
    IBillingSalesFormData {
  iPAddress: string;
  supplementaryVideos: File[];
  supplementaryImages: Array<File>;
  featuredImage: File;
  certificateOfOwnership: File; // Base64 string
  governorConsent: File;
  deedOfAssignment: File;
  landPurchaseReceipt: File;
  landSurvey: File;
  listingType: string;
  propertyType: string;
}
export interface ISalePropertyPayload
  extends IBasicInformationFormData,
    Omit<IOwnershipDocsFormData, keyof IOwnershipDocsFormData>,
    Omit<
      IListingMediaFormData,
      | "supplementaryImage1"
      | "supplementaryImage2"
      | "supplementaryImage3"
      | "supplementaryImage4"
      | "supplementaryVideo"
      | "featuredImage"
    >,
    IBillingSalesFormData {
  iPAddress: string;
  supplementaryVideos: File[];
  supplementaryImages: Array<File>;
  featuredImage: File;
  certificateOfOwnership: File; // Base64 string
  governorConsent: File;
  deedOfAssignment: File;
  landPurchaseReceipt: File;
  landSurvey: File;
  listingType: string;
  propertyType: string;
}

export interface ICommission {
  id: string;
  name: string;
  commissionType: number;
  value: number;
  status: boolean;
  createdByUserName: string;
  createdById: string;
}

export interface IAuditTrailInfo {
  id: string;
  activity: string;
  description: string;
  userName: string;
  fullName: string;
  roleName: string;
  ipAddress: string;
  location: string;
  date: string;
}
export interface IAuditTrailFilters {
  filter?: string;
  keyword?: string;
  pageSize: number;
  pageIndex: number;
}

export interface IInquiryFilters {
  filter?: string;
  keyword?: string;
  pageSize: number;
  pageIndex: number;
  propertyId?: string;
}

export interface IInquiryInfo {
  name: string;
  propertyId: string;
  userName: string;
  userId: string;
  inquiryType: number;
  status: number;
  phoneNumber: string;
  title: string;
  message: string;
  bookPhysicalVisitation: boolean;
  proposedDate: string;
  propertyName: string;
  featuredImage: string;
  id: string;
}

export interface ITogglePropertyAction {
  data: {
    comment?: string;
    propertyStatus: number;
    commissionId?: string;
    commission?: string;
    ipAddress: string;
    location?: string;
  };
  id: string;
}
