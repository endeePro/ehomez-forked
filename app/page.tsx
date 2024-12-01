"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authLayoutBg } from "@/assets/images";
import { AppLogo, Button, notify, TextField, Typography } from "@/components";
import { cookieValues } from "@/constants/data";
import { AuthRouteConfig } from "@/constants/routes";
import { useLoginMutation } from "@/redux/api";
import { IApiError } from "@/redux/api/genericInterface";
import { getErrorMessage } from "@/utils/getErrorMessges";
import { yupResolver } from "@hookform/resolvers/yup";
import { setCookie } from "cookies-next";
import { useForm } from "react-hook-form";

import { ILoginSchema, LoginSchema } from "./schema";

export default function Home() {
  const [login, { isLoading }] = useLoginMutation();
  const { replace } = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ILoginSchema>({
    resolver: yupResolver(LoginSchema),
    mode: "onChange",
  });
  const onSubmit = (values: ILoginSchema) => {
    login(values)
      .unwrap()
      .then(({ data }) => {
        setCookie(cookieValues.token, data?.token);
        setCookie(cookieValues.userType, data?.userType);
        replace(AuthRouteConfig.ORGANIZATIONAL_SETUP_COMPANIES);
      })
      .catch((err: IApiError) => {
        notify.error({
          message: "Login failed",
          subtitle: getErrorMessage(err),
        });
      });
  };
  return (
    <main className="flex h-screen w-full justify-between">
      <aside className="flex flex-1 flex-grow items-center justify-center px-6">
        <form className="max-w-[510px]" onSubmit={handleSubmit(onSubmit)}>
          <div className="">
            <AppLogo varients="secondary" />
            <Typography
              color="GB"
              variant="h-xxl"
              fontWeight="bold"
              gutterBottom
              className="mt-8"
            >
              Property Management System
            </Typography>
            <Typography variant="p-xl" className="text-gray-500">
              Manage and organising property listing and asset on Ehomez
            </Typography>
          </div>
          <fieldset className="mt-12 flex flex-col gap-4">
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
                placeholder="Enter your name"
                required
                register={register}
                error={!!errors.emailAddress}
                errorText={errors.emailAddress && errors.emailAddress.message}
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="mb-2 flex items-center gap-1"
              >
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
          </fieldset>
          <Button
            variant={"secondary"}
            disabled={!isValid || isLoading}
            loading={isLoading}
            className="my-6 h-[45px] w-[170px] rounded-[30px] md:my-8"
          >
            Login
          </Button>
          <Link href={"/forgot-password"} className="mt-4">
            <Typography className="!w-fit text-gray-500">
              {`Can’t Remember Password?`}{" "}
              <b className="text-[#434E2D] group-hover:underline">
                Reset Password
              </b>
            </Typography>
          </Link>
        </form>
      </aside>
      <aside className="relative h-full w-1/2 max-w-[734px] mmd:hidden">
        <Image
          src={authLayoutBg}
          alt="auth bg"
          fill
          placeholder="blur"
          className="object-cover"
        />
      </aside>
    </main>
  );
}
