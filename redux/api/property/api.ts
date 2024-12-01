import { Response } from "@/redux/api/genericInterface";
import { baseApi } from "@/redux/baseApi";
import { objectToFormData, queryParamsHelper } from "@/utils/helpers";

import { IEditCommissionConfigFormData } from "@/app/dashboard/(withNavs)/configurations/commissions/[commissionId]/page";
import { ICreateCommissionConfigFormData } from "@/app/dashboard/(withNavs)/configurations/commissions/add/page";

import { IOverviewRes } from "../dashboard";
import {
  IAuditTrailFilters,
  IAuditTrailInfo,
  ICommission,
  IEditRentPropertyPayload,
  IInquiryFilters,
  IInquiryInfo,
  IListingItem,
  IRentLandPayload,
  IRentPropertyPayload,
  IRentShortletPayload,
  ISaleLandPayload,
  ISalePropertyPayload,
  ITogglePropertyAction,
  PropertyById,
} from "./interface";

const baseName = "/Property";
const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPropertyOverview: builder.query<Response<IOverviewRes>, number>({
      query: (dateRangeQueryType) => ({
        url: `${baseName}/overview${`?dateRangeQueryType=${dateRangeQueryType}`}`,
        method: "GET",
      }),
      providesTags: ["PropertyOverview"],
    }),
    getPropertyListingTable: builder.query<
      Response<IListingItem[]>,
      {
        pageSize: number;
        pageIndex: number;
      }
    >({
      query: (filter) => ({
        url: `${baseName}/customer/listing${queryParamsHelper.objectToQueryString(
          filter,
        )}`,
        method: "GET",
      }),
      providesTags: ["PropertyListing"],
    }),
    getApartments: builder.query<
      Response<Array<{ id: string; name: string }>>,
      undefined
    >({
      query: () => ({
        url: `/Apartment`,
        method: "GET",
      }),
      providesTags: ["Apartments"],
    }),
    getPropertyById: builder.query<
      Response<PropertyById>,
      {
        id: string;
      }
    >({
      query: (filter) => ({
        url: `${baseName}/${filter.id}`,
        method: "GET",
      }),
      providesTags: (result, error, arg) => [{ type: "Property", id: arg.id }],
      keepUnusedDataFor: 1,
    }),
    togglePropertyAction: builder.mutation<
      Response<string>,
      ITogglePropertyAction
    >({
      query: ({ data, id }) => ({
        url: `/property/${id}/action`,
        method: "PUT",
        data,
      }),
      invalidatesTags: (result, error, arg) => [
        "PropertyListing",
        "notification",
        { type: "PropertyListing", id: arg.id },
        { type: "Property", id: arg.id },
      ],
    }),
    disablePropertyAction: builder.mutation<
      Response<string>,
      {
        id: string;
        params: {
          action: number;
        };
      }
    >({
      query: ({ params, id }) => ({
        url: `/property/${id}`,
        method: "PATCH",
        params,
      }),
      invalidatesTags: (result, error, arg) => [
        "PropertyListing",
        "notification",
        { type: "PropertyListing", id: arg.id },
        { type: "Property", id: arg.id },
      ],
    }),
    rentPropertyListing: builder.mutation<
      Response<string>,
      IRentPropertyPayload
    >({
      query: (payload) => ({
        url: `${baseName}/admin/listing`,
        method: "POST",
        data: objectToFormData(payload),
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }),
      invalidatesTags: ["PropertyListing", "notification"],
    }),
    updateRentPropertyListing: builder.mutation<
      Response<string>,
      { payload: IEditRentPropertyPayload; propertyId: string }
    >({
      query: ({ payload, propertyId }) => ({
        url: `${baseName}/${propertyId}/update`,
        method: "PUT",
        data: objectToFormData(payload),
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }),
      invalidatesTags: ["PropertyListing", "notification"],
    }),
    deletePropertyFile: builder.mutation<
      Response<string>,
      { payload: Partial<IEditRentPropertyPayload>; propertyId: string }
    >({
      query: ({ payload, propertyId }) => ({
        url: `${baseName}/${propertyId}/update`,
        method: "PUT",
        data: objectToFormData(payload),
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }),
      invalidatesTags: ["PropertyListing", "notification"],
    }),
    rentShortletListing: builder.mutation<
      Response<string>,
      IRentShortletPayload
    >({
      query: (payload) => ({
        url: `${baseName}/admin/listing`,
        method: "POST",
        data: objectToFormData(payload),
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }),
      invalidatesTags: ["PropertyListing", "notification"],
    }),
    updateRentShortletListing: builder.mutation<
      Response<string>,
      { payload: IRentShortletPayload; propertyId: string }
    >({
      query: ({ payload, propertyId }) => ({
        url: `${baseName}/${propertyId}/update`,
        method: "PUT",
        data: objectToFormData(payload),
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }),
      invalidatesTags: ["PropertyListing", "notification"],
    }),
    rentLandListing: builder.mutation<Response<string>, IRentLandPayload>({
      query: (payload) => ({
        url: `${baseName}/admin/listing`,
        method: "POST",
        data: objectToFormData(payload),
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }),
      invalidatesTags: ["PropertyListing", "notification"],
    }),
    updateRentLandListing: builder.mutation<
      Response<string>,
      { payload: IRentLandPayload; propertyId: string }
    >({
      query: ({ payload, propertyId }) => ({
        url: `${baseName}/${propertyId}/update`,
        method: "PUT",
        data: objectToFormData(payload),
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }),
      invalidatesTags: ["PropertyListing", "notification"],
    }),
    saleApartmentListing: builder.mutation<
      Response<string>,
      ISalePropertyPayload
    >({
      query: (payload) => ({
        url: `${baseName}/admin/listing`,
        method: "POST",
        data: objectToFormData(payload),
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }),
      invalidatesTags: ["PropertyListing", "notification"],
    }),
    updateSaleApartmentListing: builder.mutation<
      Response<string>,
      { payload: ISalePropertyPayload; propertyId: string }
    >({
      query: ({ payload, propertyId }) => ({
        url: `${baseName}/${propertyId}/update`,
        method: "PUT",
        data: objectToFormData(payload),
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }),
      invalidatesTags: ["PropertyListing", "notification"],
    }),
    saleLandListing: builder.mutation<Response<string>, ISaleLandPayload>({
      query: (payload) => ({
        url: `${baseName}/admin/listing`,
        method: "POST",
        data: objectToFormData(payload),
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }),
      invalidatesTags: ["PropertyListing", "notification"],
    }),
    updateSaleLandListing: builder.mutation<
      Response<string>,
      { payload: ISaleLandPayload; propertyId: string }
    >({
      query: ({ payload, propertyId }) => ({
        url: `${baseName}/${propertyId}/update`,
        method: "PUT",
        data: objectToFormData(payload),
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }),
      invalidatesTags: ["PropertyListing", "notification"],
    }),
    getCommissions: builder.query<Response<Array<ICommission>>, undefined>({
      query: () => ({
        url: `/settings/commission`,
        method: "GET",
      }),
      providesTags: ["Commissions"],
    }),
    getCommissionById: builder.query<Response<ICommission>, { id: string }>({
      query: (data) => ({
        url: `/settings/commission/${data.id}`,
        method: "GET",
      }),
      providesTags: (result, error, arg) => [
        { type: "Commission", id: arg.id },
      ],
    }),
    createCommission: builder.mutation<
      Response<string>,
      ICreateCommissionConfigFormData
    >({
      query: (data) => ({
        url: `/settings/commission`,
        method: "POST",
        data: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["Commissions"],
    }),
    updateCommission: builder.mutation<
      Response<string>,
      { data: IEditCommissionConfigFormData; id: string }
    >({
      query: ({ data, id }) => ({
        url: `/settings/commission/${id}`,
        method: "PUT",
        data: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: (result, error, arg) => [
        "Commissions",
        { type: "Commission", id: arg.id },
      ],
    }),
    deleteCommission: builder.mutation<Response<string>, { id: string }>({
      query: (data) => ({
        url: `/settings/commission/${data.id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, arg) => [
        "Commissions",
        { type: "Commission", id: arg.id },
      ],
    }),
    toggleCommissionStatus: builder.mutation<Response<string>, { id: string }>({
      query: (data) => ({
        url: `/settings/commission/${data.id}/toggle`,
        method: "PUT",
      }),
      invalidatesTags: (result, error, arg) => [
        "Commissions",
        { type: "Commission", id: arg.id },
      ],
    }),
    getAuditTrail: builder.query<
      Response<Array<IAuditTrailInfo>>,
      IAuditTrailFilters
    >({
      query: (filters) => ({
        // @ts-expect-error
        url: `/dashboard/audit-trail${queryParamsHelper.objectToQueryString(filters)}`,
        method: "GET",
      }),
      providesTags: ["AuditTrail"],
    }),
    getInquiry: builder.query<
      Response<Array<IInquiryInfo>>,
      { filters: IInquiryFilters }
    >({
      query: ({ filters }) => ({
        // @ts-expect-error
        url: `/inquiry/propertyinquiry${queryParamsHelper.objectToQueryString(filters)}`,
        method: "GET",
      }),
      providesTags: ["Inquiry"],
    }),
    updateInquiry: builder.mutation<
      Response<string>,
      {
        id: string;
        payload: {
          response?: string | undefined;
          status: number;
        };
      }
    >({
      query: ({ id, payload }) => ({
        url: `/inquiry?inquiryId=${id}`,
        method: "PUT",
        data: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: (result, error, arg) => [
        "Inquiry",
        { type: "Inquiry", id: arg.id },
      ],
    }),
  }),
});

export const {
  useGetPropertyOverviewQuery,
  useGetPropertyListingTableQuery,
  useGetPropertyByIdQuery,
  useRentPropertyListingMutation,
  useRentLandListingMutation,
  useGetApartmentsQuery,
  useGetCommissionsQuery,
  useSaleApartmentListingMutation,
  useSaleLandListingMutation,
  useRentShortletListingMutation,
  useCreateCommissionMutation,
  useDeleteCommissionMutation,
  useToggleCommissionStatusMutation,
  useGetCommissionByIdQuery,
  useUpdateCommissionMutation,
  useGetAuditTrailQuery,
  useTogglePropertyActionMutation,
  useDisablePropertyActionMutation,
  useUpdateRentPropertyListingMutation,
  useUpdateRentLandListingMutation,
  useUpdateRentShortletListingMutation,
  useDeletePropertyFileMutation,
  useUpdateSaleLandListingMutation,
  useUpdateSaleApartmentListingMutation,
  useGetInquiryQuery,
  useUpdateInquiryMutation,
} = dashboardApi;
