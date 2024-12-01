"use client";

import React, { useEffect, useState } from "react";
import { Button, notify, TextField, Typography } from "@/components";
import { useSendResetPasswordMutation } from "@/redux/api";
import { IApiError } from "@/redux/api/genericInterface";
import { getErrorMessage } from "@/utils/getErrorMessges";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

import AuthLayout from "../_components/authLayout";
import { forgotPasswordSchema, IForgotPasswordSchema } from "./schema";

const ForgotPassword = () => {
  const [sendResetToken, { isLoading }] = useSendResetPasswordMutation();
  const {
    handleSubmit,
    register,
    formState: { errors, isValid },
    watch,
  } = useForm<IForgotPasswordSchema>({
    resolver: yupResolver(forgotPasswordSchema),
    mode: "onChange",
  });
  const [showMailSent, setShowMailSent] = useState(false);

  const onSubmit = (values: IForgotPasswordSchema) => {
    sendResetToken(values)
      .unwrap()
      .then((res) => {
        setShowMailSent(true);
        notify.success({
          message: "Email Sent",
          subtitle: res.responseMessage,
        });
      })
      .catch((err: IApiError) => {
        notify.error({
          message: "Request Failed",
          subtitle: getErrorMessage(err),
        });
      });
  };

  return (
    <AuthLayout
      heading={showMailSent ? "Check your email" : "Reset Password?"}
      subHeading={
        showMailSent
          ? `We sent a password reset link to ${watch("emailAddress")}`
          : "Please enter your email in the form below and we will send you a link to reset your password."
      }
      linkTextOne={
        showMailSent ? "Go back to" : "Do you remember your password?"
      }
      linkTextTwo="Login"
      path="/"
    >
      {!showMailSent ? (
        <form className="mt-8 w-full" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="email" className="mb-2 flex items-center gap-1">
              <Typography variant={"p-m"} className="text-gray-700">
                Email
              </Typography>{" "}
              <sup className="mt-[2px] text-R400">*</sup>
            </label>
            <TextField
              inputType="input"
              name="emailAddress"
              type="text"
              placeholder="Enter your email address"
              required
              register={register}
              error={!!errors.emailAddress}
              errorText={errors.emailAddress && errors.emailAddress.message}
            />
          </div>
          <Button
            variant={"secondary"}
            disabled={!isValid || isLoading}
            loading={isLoading}
            className="mt-3 h-[45px] w-full whitespace-nowrap rounded-[30px] md:my-8"
          >
            Send password reset link
          </Button>
        </form>
      ) : (
        <EmailResendComponent
          emailAddress={watch("emailAddress")}
          onResend={onSubmit}
        />
      )}
    </AuthLayout>
  );
};

export default ForgotPassword;

const EmailResendComponent: React.FC<{
  emailAddress: string;
  onResend: (values: IForgotPasswordSchema) => void;
}> = ({ emailAddress, onResend }) => {
  const [resendClicked, setResendClicked] = useState(false);
  const [countdown, setCountdown] = useState(120); // 2 minutes in seconds

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendClicked && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);
    } else if (countdown === 0) {
      setResendClicked(false);
    }
    return () => clearInterval(timer);
  }, [resendClicked, countdown]);

  const handleResendClick = () => {
    setResendClicked(true);
    setCountdown(120);
    onResend({ emailAddress });
  };

  const openMailApp = () => {
    window.location.href = `mailto:${emailAddress}`;
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-4">
      <Button
        variant={"secondary"}
        onClick={openMailApp}
        className="mt-3 h-[45px] w-full whitespace-nowrap rounded-[30px] md:my-2"
      >
        Open mail App
      </Button>
      <Typography variant="span">
        Didn't receive the email?{" "}
        {!resendClicked ? (
          <button onClick={handleResendClick} className="font-semibold text-GB">
            Click to Resend
          </button>
        ) : (
          <span className="font-semibold text-GBA">
            Resend in {Math.floor(countdown / 60)}:
            {(countdown % 60).toString().padStart(2, "0")}
          </span>
        )}
      </Typography>
    </div>
  );
};
