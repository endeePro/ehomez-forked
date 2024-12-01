export interface ITrendingChartRes {
  month: string;
  saleCount: number;
  rentCount: number;
  shortletCount: number;
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
export interface RecentListing {
  propertyId: string;
  propertyName: string;
  address: string;
  state: string;
  propertyStatus: number;
  billType: number;
  price: number;
  createdOn: string;
  imageUrl: string;
}
export interface IOverviewRes {
  totalListing: number;
  totalListingValue: number;
  totalApprovedRentListing: number;
  totalApprovedRentListingValue: number;
  totalClosedRentListing: number;
  totalClosedRentListingValue: number;
  totalPropertyForRent: number;
  totalPropertyForSale: number;
  totalSortletProperty: number;
  totalListingApproved: number;
  totalListingRejected: number;
  totalListingPending: number;
  recentListings: RecentListing[];
}

export interface ICreateRoleReq {
  name: string;
  description: string;
  permissions: number[];
}

export interface IRolePermission {
  name: string;
  value: number;
}

export interface IRoleStat {
  active: number;
  total: number;
  inActive: number;
}
export interface IUserCount {
  totalActive: number;
  totalUsers: number;
}
export interface IRoleRes {
  name: string;
  description: string;
  usersInRole: number;
  numberOfPermission: number;
  isActive: boolean;
  id: string;
  createdById: any;
  createdBy: string;
  createdOn: string;
}
export interface IRoleById {
  name: string;
  permission: string[];
  description: string;
  usersInRole: number;
}
export interface IUserPub {
  id: string;
  emailAddress: string;
  fullName: string;
  phoneNumber: string;
  isActive: boolean;
  isBlocked: boolean;
  profilePicture: string;
  userType: string;
  createdOn: string;
  lastLoginDate: string;
}

export interface IUserPubWithRole {
  userId: string;
  emailAddress: string;
  name: string;
  firstName: string;
  lastName: string;
  middleName: string;
  phoneNumber: string;
  address: string;
  verified: boolean;
  permissions: string[];
  roles: string[];
}

export interface INotification {
  isRead: boolean;
  message: string;
  createdOn: string;
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
  commission: number;
  landExactMeasurement: number;
  measurementUnit: number;
  landType: number;
  billType: number;
  supplementaryImages: string[];
}
