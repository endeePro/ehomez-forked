import { Response } from "@/redux/api/genericInterface";
import { baseApi } from "@/redux/baseApi";

import {
  IAgentChartReq,
  IAgentChartRes,
  ICreateRoleReq,
  INotification,
  IOverviewRes,
  IRoleById,
  IRolePermission,
  IRoleRes,
  IRoleStat,
  ITrendingChartRes,
  IUserCount,
  IUserPub,
  IUserPubWithRole,
} from "./interface";

const baseName = "/Dashboard";
const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOverview: builder.query<Response<IOverviewRes>, number>({
      query: (dateRangeQueryType) => ({
        url: `${baseName}/overview?dateRangeQueryType=${dateRangeQueryType}`,
        method: "GET",
      }),
      providesTags: (result) =>
        result ? [{ type: "Overview", id: "LIST" }] : ["Overview"],
    }),
    getTrendingChart: builder.query<Response<ITrendingChartRes[]>, string>({
      query: (year) => ({
        url: `${baseName}/listing-chart/${year}`,
        method: "GET",
      }),
      providesTags: (result, error, year) =>
        result ? [{ type: "TrendingChart", id: year }] : ["TrendingChart"],
    }),
    getAgentChart: builder.query<Response<IAgentChartRes>, IAgentChartReq>({
      query: ({ year, userType }) => ({
        url: `${baseName}/agent-chart/${year}/${userType}`,
        method: "GET",
      }),
      providesTags: (result, error, { year, userType }) =>
        result
          ? [{ type: "AgentChart", id: `${year}-${userType}` }]
          : ["AgentChart"],
    }),
    createRole: builder.mutation<Response<string>, ICreateRoleReq>({
      query: (payload) => ({
        url: `/Role`,
        method: "POST",
        data: payload,
      }),
      invalidatesTags: (arg) => ["Roles", "Role", "RoleStat"],
    }),
    updateRole: builder.mutation<
      Response<string>,
      { roleId: string; payload: ICreateRoleReq }
    >({
      query: ({ roleId, payload }) => ({
        url: `/Role/${roleId}`,
        method: "PUT",
        data: payload,
      }),
      invalidatesTags: (arg) => ["Roles", "Role", "RoleStat"],
    }),
    getRoles: builder.query<Response<IRoleRes[]>, void>({
      query: () => ({
        url: `/Role`,
        method: "GET",
      }),
      providesTags: (result) =>
        result ? [{ type: "Role", id: "LIST" }] : ["Role"],
    }),
    getRoleById: builder.query<Response<IRoleById>, { roleId: string }>({
      query: (data) => ({
        url: `/Role/${data.roleId}`,
        method: "GET",
      }),
      providesTags: (result, error, arg) =>
        result ? [{ type: "Role", id: arg.roleId }] : ["Role"],
    }),
    toggleRole: builder.mutation<Response<unknown>, string>({
      query: (query) => ({
        url: `/Role/toggle/${query}`,
        method: "PUT",
      }),
      invalidatesTags: (arg) => ["Roles", "Role", "RoleStat"],
    }),
    getRoleStat: builder.query<Response<IRoleStat>, void>({
      query: () => ({
        url: `/Role/stat`,
        method: "GET",
      }),
      providesTags: ["RoleStat"],
    }),
    getRolePermissions: builder.query<IRolePermission[], void>({
      query: () => ({
        url: `/Role/permissions`,
        method: "GET",
      }),
      providesTags: ["RolePermissions"],
    }),
    getUsersCount: builder.query<
      Response<IUserCount>,
      { dateRangeQueryType: number; userType: number }
    >({
      query: (params) => ({
        url: `/User/count`,
        method: "GET",
        params,
      }),
      providesTags: ["UserCount"],
    }),
    getUsers: builder.query<
      Response<IUserPub[]>,
      {
        userType?: number;
        pageSize: number;
        pageIndex: number;
        dateRangeQueryType: number;
      }
    >({
      query: (params) => ({
        url: `/user`,
        method: "GET",
        params,
      }),
      providesTags: (result) =>
        result ? [{ type: "Users", id: "User" }] : ["Users"],
    }),
    getUserById: builder.query<Response<IUserPubWithRole>, { userId: string }>({
      query: ({ userId }) => ({
        url: `/user/${userId}/profile`,
        method: "GET",
      }),
    }),
    createAdmin: builder.mutation<
      Response<{
        userName: string;
        dateCreated: string;
        phoneNumber: string;
        fullName: string;
      }>,
      {
        emailAddress: string;
        firstName: string;
        lastName: string;
        middleName: string;
        phoneNumber: string;
        roleId: string;
      }
    >({
      query: (data) => ({
        url: `/User/create-admin`,
        method: "POST",
        data,
      }),
      invalidatesTags: (arg) => ["Users", "User"],
    }),
    updateUser: builder.mutation<
      Response<string>,
      {
        userId: string;
        payload: {
          firstName: string;
          lastName: string;
          middleName?: string;
          phoneNumber: string;
          roleId: string;
          emailAddress: string;
        };
      }
    >({
      query: ({ userId, payload }) => ({
        url: `/User/details/`,
        method: "PUT",
        data: payload,
      }),
      invalidatesTags: (arg) => ["Users", "User"],
    }),
    getNotifications: builder.query<Response<INotification[]>, void>({
      query: () => ({
        url: `/notification/admin`,
        method: "GET",
      }),
      providesTags: ["notification"],
    }),
    markNotificationAsRead: builder.mutation<
      Response<string>,
      { notificationId: string }
    >({
      query: ({ notificationId }) => ({
        url: `/notification/mark-as-read/${notificationId}`,
        method: "PUT",
      }),
      invalidatesTags: (arg) => ["notification"],
    }),
  }),
});

export const {
  useGetOverviewQuery,
  useGetTrendingChartQuery,
  useGetAgentChartQuery,
  useLazyGetOverviewQuery,
  useLazyGetTrendingChartQuery,
  useLazyGetAgentChartQuery,
  useGetRoleStatQuery,
  useGetUsersCountQuery,
  useGetRolesQuery,
  useGetUsersQuery,
  useGetUserByIdQuery,
  useGetRoleByIdQuery,
  useGetRolePermissionsQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useCreateAdminMutation,
  useToggleRoleMutation,
  useUpdateUserMutation,
  useGetNotificationsQuery,
  useMarkNotificationAsReadMutation,
} = dashboardApi;
