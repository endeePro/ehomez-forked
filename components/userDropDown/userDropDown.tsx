"use client";

import React from "react";
import Link from "next/link";

import { Avatar } from "../avatar";

export const UserDropDown = () => {
  return (
    <Link href={"/dashboard/settings"}>
      <Avatar size={"sm"} fullname="Ndubuisi Obinna" />
    </Link>
  );
};
