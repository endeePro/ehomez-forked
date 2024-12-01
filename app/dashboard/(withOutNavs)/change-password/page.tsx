"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, notify, TextField, Typography } from "@/components";
import { AuthRouteConfig } from "@/constants/routes";
import { useChangePasswordMutation } from "@/redux/api";
import { IApiError } from "@/redux/api/genericInterface";
import { getErrorMessage } from "@/utils/getErrorMessges";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

import AuthLayout from "@/app/(auth)/_components/authLayout";

import { changePasswordSchema, IChangePasswordSchema } from "./schema";

const ChangeUserPassword = () => {
  const params = useSearchParams();
  const { push } = useRouter();
  const id = params.get("id");
  const [changePassword, { isLoading }] = useChangePasswordMutation();
  const [showSuccess, setShowSuccess] = useState(false);
  const {
    handleSubmit,
    register,
    formState: { errors, isValid },
  } = useForm<IChangePasswordSchema>({
    resolver: yupResolver(changePasswordSchema),
    mode: "onChange",
  });
  const onSubmit = (values: IChangePasswordSchema) => {
    console.log("onSubmit", values);

    const payload = {
      userId: id ?? "",
      oldPassword: values.oldPassword ?? "",
      newPassword: values.password ?? "",
    };
    changePassword(payload)
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
  if (!id) {
    return push(AuthRouteConfig.HOME);
  }
  return (
    <AuthLayout
      heading={
        showSuccess ? "Password Changed Successfully" : "Change Password"
      }
      subHeading={
        showSuccess
          ? "Your password has been successfully updated, Click below to go back"
          : "Enter your Former password to proceed to Continue the change action."
      }
      linkTextOne={null}
      showSecIcon={showSuccess}
      linkTextTwo=""
      path=""
    >
      {!showSuccess && (
        <form
          className="mt-8 flex w-full flex-col gap-3"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div>
            <label htmlFor="password" className="mb-2 flex items-center gap-1">
              <Typography variant={"p-m"} className="text-gray-700">
                Old Password
              </Typography>{" "}
              <sup className="mt-[2px] text-R400">*</sup>
            </label>
            <TextField
              inputType="input"
              name="oldPassword"
              type="oldPassword"
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
                New Password
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
                Confirm New Password
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
            Change Password
          </Button>
        </form>
      )}
      {showSuccess && (
        <div className="mt-6 w-full">
          <Link href={"/dashboard/settings"} replace>
            <Button
              variant={"secondary"}
              className="mt-3 h-[45px] w-full whitespace-nowrap rounded-[30px] md:my-8"
            >
              Go back to profile
            </Button>
          </Link>
        </div>
      )}
    </AuthLayout>
  );
};

export default ChangeUserPassword;
