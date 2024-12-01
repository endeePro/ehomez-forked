import { Response } from "@/redux/api/genericInterface";
import { baseApi } from "@/redux/baseApi";

import { IForgotPasswordSchema } from "@/app/(auth)/forgot-password/schema";

import {
  IChangePasswordPayload,
  IForgotPasswordResPayload,
  ILoginPayload,
  ILoginUserResponse,
  IResetPasswordPayload,
  IUser,
  IVerifyUserResponse,
} from "./interface";

const baseName = "/Authentication";
const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    verifyIfUser: builder.query<Response<IVerifyUserResponse>, string>({
      query: (email) => ({
        url: `${baseName}/verify-email/${email}`,
        method: "GET",
      }),
    }),
    login: builder.mutation<Response<ILoginUserResponse>, ILoginPayload>({
      query: (payload) => ({
        url: `${baseName}/login`,
        method: "POST",
        data: payload,
      }),
    }),
    sendResetPassword: builder.mutation<
      Response<IForgotPasswordResPayload>,
      IForgotPasswordSchema
    >({
      query: (payload) => ({
        url: `/user/forgot-password`,
        method: "POST",
        data: payload,
      }),
    }),
    resetPassword: builder.mutation<Response, IResetPasswordPayload>({
      query: (payload) => ({
        url: `/user/reset-password`,
        method: "POST",
        data: payload,
      }),
    }),
    changePassword: builder.mutation<Response, IChangePasswordPayload>({
      query: (payload) => ({
        url: `/user/change-password`,
        method: "POST",
        data: payload,
      }),
    }),
    getUserDetails: builder.query<Response<IUser>, "">({
      query: () => ({
        url: `/user/profile`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useVerifyIfUserQuery,
  useLazyVerifyIfUserQuery,
  useLoginMutation,
  useSendResetPasswordMutation,
  useResetPasswordMutation,
  useGetUserDetailsQuery,
  useChangePasswordMutation,
} = authApi;
