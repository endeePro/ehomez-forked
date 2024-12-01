"use client";

import React from "react";
import Link from "next/link";
import { PageHeader, Typography } from "@/components";

const Configurations = () => {
  const navigations = [
    {
      label: "Commission Setting",
      href: "/dashboard/configurations/commissions",
      sub: "Set the fees to charge property owner at the Point of Property Approval",
    },
  ];

  return (
    <div>
      <PageHeader
        title="Configuration"
        subTitle="Manage Configuration Setting"
      />
      <div className="mt-5 flex flex-wrap gap-3">
        {navigations.map((navigation) => (
          <Link
            key={navigation.label}
            href={navigation.href}
            className="flex items-start gap-4 rounded-lg border border-solid border-[#EAECF0] bg-white p-[clamp(16px,3vw,24px)] transition-all duration-200 ease-in-out hover:translate-y-[-5px] hover:scale-105 hover:shadow-md hover:shadow-[#F3FEE7]"
          >
            <span className="ring-solid aspect-square h-[clamp(25px,_4vw,_32px)] rounded-full bg-[#F3FEE7] ring-[1px] ring-[#16B364]">
              {" "}
            </span>
            <div>
              <Typography variant="h-m" fontWeight="semibold" color="TGDD">
                {navigation.label}
              </Typography>
              <Typography variant="p-m" color="N500" customClassName="mt-1">
                {navigation.sub}
              </Typography>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Configurations;
