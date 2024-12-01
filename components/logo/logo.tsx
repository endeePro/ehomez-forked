"use client";

import React from "react";
import Image from "next/image";
import { logoPic } from "@/assets/images";
import { SecLogo } from "@/assets/svgs";

import { Typography } from "../typography";

interface IProps {
  varients: "default" | "secondary" | "auth";
}
export const AppLogo = ({ varients }: IProps) => {
  return (
    <div className="font flex items-center gap-3">
      {varients === "secondary" && <SecLogo />}
      {varients === "default" && (
        <div className="relative aspect-square h-[clamp(30px,4vw,50px)]">
          <Image alt="logo" src={logoPic} fill />
        </div>
      )}
      {varients === "auth" && (
        <div className="relative aspect-square h-[clamp(70px,4vw,108px)]">
          <Image alt="logo" src={logoPic} fill />
        </div>
      )}
      {varients !== "auth" && (
        <Typography
          variant={varients === "secondary" ? "h-m" : "h-s"}
          fontWeight="bold"
          color={varients === "secondary" ? "GB" : "N0"}
        >
          {varients === "secondary" ? "Property Pro" : "E-Homes"}
        </Typography>
      )}
    </div>
  );
};
