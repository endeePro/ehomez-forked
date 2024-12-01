import { cookieValues } from "@/constants/data";
import { BaseQueryFn } from "@reduxjs/toolkit/query";
import axios, { AxiosError, AxiosRequestConfig, Method } from "axios";
import { getCookie } from "cookies-next";

interface AxiosBaseQueryParams {
  baseUrl: string;
  baseHeaders?: AxiosRequestConfig["headers"];
}

interface QueryArgs {
  url: string;
  method: Method;
  data?: AxiosRequestConfig["data"];
  params?: AxiosRequestConfig["params"];
  headers?: AxiosRequestConfig["headers"];
}

interface CustomError {
  status?: number;
  error: string;
  type?: string;
  title?: string;
  errors?: Record<string, string[]>;
  traceId?: string;
}

export const axiosBaseQuery =
  ({
    baseUrl = "",
    baseHeaders = {},
  }: AxiosBaseQueryParams): BaseQueryFn<QueryArgs, unknown, CustomError> =>
  async ({ url, method, data, params, headers = {} }) => {
    try {
      const token = getCookie(cookieValues.token) as string | undefined;
      const authHeaders: Record<string, string> = token
        ? { Authorization: `Bearer ${token}` }
        : {};

      const result = await axios({
        url: baseUrl + url,
        method,
        params,
        data,
        headers: { ...baseHeaders, ...authHeaders, ...headers },
      });

      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError as AxiosError;
      let customError: CustomError = {
        status: err.response?.status,
        error: err.message,
      };

      if (
        typeof err.response?.data === "object" &&
        err.response?.data !== null
      ) {
        const errorData = err.response.data as Record<string, unknown>;
        customError = {
          ...customError,
          ...errorData,
          error: (errorData.error as string) || customError.error,
        };

        // Handle the specific error format with 'errors' property
        if (typeof errorData.errors === "object" && errorData.errors !== null) {
          const errors = errorData.errors as Record<string, string[]>;
          const firstErrorKey = Object.keys(errors)[0];
          if (
            firstErrorKey &&
            Array.isArray(errors[firstErrorKey]) &&
            errors[firstErrorKey].length > 0
          ) {
            customError.error = errors[firstErrorKey][0];
          }
        }
      }

      return { error: customError };
    }
  };
