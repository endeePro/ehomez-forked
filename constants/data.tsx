import {
  FrequencyIcon,
  HomeIcon,
  HouseCogIcon,
  HouseIcon,
  UserCogIcon,
  UsersIcon,
} from "@/assets/svgs";
import { OptionType } from "@/components";
import { LuGitPullRequestDraft } from "react-icons/lu";

export const PropertyType = ["Land", "Apartment"];

export const ListingType = ["Sale", "Rent", "Shortlet"];

export const propertyStatuses = [
  "Pending",
  "Approved",
  "Declined",
  "Closed",
  "UnderReview",
  "Deleted",
];
export const pageSizes = {
  sm: 5,
  md: 10,
  lg: 20,
  xl: 50,
};

export const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const timePeriods: OptionType[] = [
  { label: "All", value: "7" },
  { label: "Today", value: "1" },
  { label: "Week", value: "2" },
  { label: "Month", value: "3" },
  { label: "Quarter", value: "4" },
  { label: "BiAnnual", value: "5" },
  { label: "Annual", value: "6" },
];

export const landTypes: OptionType[] = [
  { label: "Dry", value: "1" },
  { label: "Wet", value: "2" },
  { label: "Hilltop", value: "3" },
];

export const measurementUnits: OptionType[] = [
  {
    label: "Plot",
    value: "1",
  },
  {
    label: "Square Feet",
    value: "2",
  },
];

export const years: OptionType[] = [
  { label: "2024", value: "2024" },
  { label: "2025", value: "2025" },
  { label: "2026", value: "2026" },
  { label: "2027", value: "2027" },
  { label: "2028", value: "2028" },
  { label: "2029", value: "2029" },
  { label: "2030", value: "2030" },
  { label: "2031", value: "2031" },
  { label: "2032", value: "2032" },
  { label: "2033", value: "2033" },
  { label: "2034", value: "2034" },
  { label: "2035", value: "2035" },
];

export const billType: OptionType[] = [
  {
    label: "Annually",
    value: "1",
  },
  {
    label: "BiAnnually",
    value: "2",
  },
  {
    label: "Quarterly",
    value: "3",
  },
  {
    label: "Monthly",
    value: "4",
  },
  {
    label: "Weekly",
    value: "5",
  },
  {
    label: "Daily",
    value: "6",
  },
  {
    label: "OnOffPayment",
    value: "7",
  },
];

export const Roles = {
  admin: "3",
  superAdmin: "4",
  staff: "staff",
};

export const AllowedUsersId = ["3", "4"];
export const cookieValues = {
  token: `re-token`,
  userType: `re-userType`,
};

export const sidebarModuleMenus = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: <HomeIcon />,
  },
  {
    path: "/dashboard/inquiry",
    name: "Inquiry Requests",
    icon: <LuGitPullRequestDraft />,
  },
  {
    path: "/dashboard/list-management",
    name: "Listing Management",
    icon: <HouseIcon />,
  },
  {
    path: "/dashboard/configurations",
    name: "Configurations",
    icon: <HouseCogIcon />,
  },
  {
    path: "/dashboard/audit-trail",
    name: "Audit Trail",
    icon: <FrequencyIcon />,
  },
  {
    path: "/dashboard/customer-management",
    name: "Customer Management",
    icon: <UsersIcon />,
  },
  {
    path: "/dashboard/user-management",
    name: "System User Management",
    icon: <UserCogIcon />,
  },
];
