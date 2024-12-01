export const getAllroutes = (route: object) => [...Object.values(route)];
export const LandingPages = {
  HOME: "/",
};
const AuthPages = {
  LOGIN: "/",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
};

const StaffPages = {
  ORGANIZATIONAL_SETUP_COMPANIES: "/dashboard",
  ORGANIZATIONAL_SETUP_LOCATIONS: "/staff/organizational-setup/locations",
  ORGANIZATIONAL_SETUP_DEPARTMENTS: "/staff/organizational-setup/departments",
  ORGANIZATIONAL_SETUP_BUSINESS_UNITS:
    "/staff/organizational-setup/business-units",
  ORGANIZATIONAL_SETUP_SETTINGS: "/staff/organizational-setup/settings",
  ADMIN_LIST_MANAGEMENT: "/dashboard/list-management",
  ADMIN_CUSTOMER_MANAGEMENT: "/dashboard/customer-management",
  ADMIN_CONFIGURATIONS: "/dashboard/configurations",
  ADMIN_AUDIT_TRAIL: "/dashboard/audit-trail",
  ADMIN_USER_MANAGEMENT: "/dashboard/user-management",
  ADMIN_INVOICE_MANAGEMENT: "/dashboard/invoice-management",
  ADMIN_INVOICE_GENERATION: "/dashboard/invoice-management/generate",
  ADMIN_INVOICE_VIEW: "/dashboard/invoice-management/view/:invoiceId",
};

export const UNAUTHENTICATED_ROUTES = [
  ...getAllroutes(LandingPages),
  ...getAllroutes(AuthPages),
];
export const ADMIN_ROUTES = ["/dashboard"];

export const STAFF_ROUTES = [...getAllroutes(StaffPages)];

export const AUTHENTICATED_ROUTES = [...ADMIN_ROUTES];

export const AuthRouteConfig = {
  ...LandingPages,
  ...AuthPages,
  ...StaffPages,
};
