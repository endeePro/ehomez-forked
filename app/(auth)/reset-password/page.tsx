"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, notify, TextField, Typography } from "@/components";
import { AuthRouteConfig } from "@/constants/routes";
import { useResetPasswordMutation } from "@/redux/api";
import { IApiError } from "@/redux/api/genericInterface";
import { getErrorMessage } from "@/utils/getErrorMessges";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

import AuthLayout from "../_components/authLayout";
import { IResetPasswordSchema, resetPasswordSchema } from "./schema";

const ResetPassword = () => {
  const params = useSearchParams();
  const { push } = useRouter();
  const email = params.get("email");
  const token = params.get("token");
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const [showSuccess, setShowSuccess] = useState(false);
  const {
    handleSubmit,
    register,
    formState: { errors, isValid },
  } = useForm<IResetPasswordSchema>({
    resolver: yupResolver(resetPasswordSchema),
    mode: "onChange",
  });
  const onSubmit = (values: IResetPasswordSchema) => {
    console.log("onSubmit", values);

    const payload = {
      email: email ?? "",
      token: token ?? "",
      password: values.password,
      confirmPassword: values.password,
    };
    resetPassword(payload)
      .unwrap()
      .then(() => {
        setShowSuccess(true);
        notify.success({
          message: "Passord Reset Successful!",
          subtitle: "You can proceed to log in",
        });
      })
      .catch((err: IApiError) => {
        notify.error({
          message: "Password Reset Failed",
          subtitle: getErrorMessage(err),
        });
      });
  };
  if (!email || !token) {
    return push(AuthRouteConfig.FORGOT_PASSWORD);
  }
  return (
    <AuthLayout
      heading={showSuccess ? "Password Reset Successful" : "Reset Password?"}
      subHeading={
        showSuccess
          ? "Your password has been successfully reset, Click below to log in magically"
          : "Please create a new password"
      }
      linkTextOne={showSuccess ? null : "Do you remember your password?"}
      showSecIcon={showSuccess}
      linkTextTwo="Login"
      path="/"
    >
      {!showSuccess && (
        <form className="mt-8 w-full" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="password" className="mb-2 flex items-center gap-1">
              <Typography variant={"p-m"} className="text-gray-700">
                Password
              </Typography>{" "}
              <sup className="mt-[2px] text-R400">*</sup>
            </label>
            <TextField
              inputType="input"
              name="password"
              type="password"
              placeholder="Enter Password"
              required
              register={register}
              error={!!errors.password}
              errorText={errors.password && errors.password.message}
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-2 flex items-center gap-1">
              <Typography variant={"p-m"} className="text-gray-700">
                Confirm Password
              </Typography>{" "}
              <sup className="mt-[2px] text-R400">*</sup>
            </label>
            <TextField
              inputType="input"
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              required
              register={register}
              error={!!errors.confirmPassword}
              errorText={
                errors.confirmPassword && errors.confirmPassword.message
              }
            />
          </div>
          <Button
            variant={"secondary"}
            disabled={!isValid || isLoading}
            loading={isLoading}
            className="mt-3 h-[45px] w-full whitespace-nowrap rounded-[30px] md:my-8"
          >
            Reset my password
          </Button>
        </form>
      )}
      {showSuccess && (
        <div className="mt-6 w-full">
          <Link href={"/"} replace>
            <Button
              variant={"secondary"}
              className="mt-3 h-[45px] w-full whitespace-nowrap rounded-[30px] md:my-8"
            >
              Login
            </Button>
          </Link>
        </div>
      )}
    </AuthLayout>
  );
};

export default ResetPassword;
