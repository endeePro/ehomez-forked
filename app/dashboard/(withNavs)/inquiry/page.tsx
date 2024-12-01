"use client";

import React from "react";
import { PageHeader } from "@/components";

import { ListingInquiry } from "../list-management/[listId]/[categoryType]/_components";

type Props = {};

const Inquiries = (props: Props) => {
  return (
    <div className="flex w-full flex-col gap-10">
      <PageHeader
        title="Inquiry requests"
        subTitle="Overview of all inquiries"
      />

      <ListingInquiry withId={false} />
    </div>
  );
};

export default Inquiries;
