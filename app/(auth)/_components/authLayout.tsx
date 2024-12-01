"use client";

import React from "react";
import Link from "next/link";
import { CheckMarkSuccessIcon } from "@/assets/svgs";
import { AppLogo, Typography } from "@/components";

export default function AuthLayout({
  children,
  heading,
  subHeading,
  path,
  linkTextOne,
  linkTextTwo,
  showSecIcon = false,
}: {
  heading: string;
  subHeading: string;
  path: string;
  linkTextOne: string | null;
  linkTextTwo: string;
  showSecIcon?: boolean;
  children: React.ReactNode;
}) {
  return (
    <main className="flex h-screen w-screen flex-col">
      <div className="sticky top-0 mt-[clamp(35px,5vw,92px)] w-full bg-N0 px-[clamp(24px,5vw,112px)] py-4">
        <Link href={"/"}>
          <button className="rounded-full bg-[#EAECF0] p-[8px_12px]">
            <svg
              width="12"
              height="20"
              viewBox="0 0 12 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10 18L2 10L10 2"
                stroke="#1A2564"
                strokeWidth="2.66667"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </Link>
      </div>
      <div className="flex min-h-screen w-full justify-center px-6 pt-[clamp(28px,3vw,48px)]">
        <div className="flex w-full max-w-[430px] flex-col items-center">
          <div className="flex w-full max-w-[370x] flex-col items-center">
            {" "}
            <AppLogo varients={"auth"} />
            {showSecIcon && <CheckMarkSuccessIcon className="mt-6" />}
            <Typography
              align="center"
              fontWeight={"semibold"}
              variant="h-xl"
              className="mt-6"
            >
              {heading}
            </Typography>
            <Typography
              variant="p-m"
              align="center"
              className="mt-2 text-wrap text-gray-500"
            >
              {subHeading}
            </Typography>
          </div>
          {children}
          {linkTextOne && (
            <Link href={path} className="mt-4">
              <Typography align="center" className="text-gray-500">
                {linkTextOne}{" "}
                <b className="text-[#434E2D] group-hover:underline">
                  {linkTextTwo}
                </b>
              </Typography>
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}
