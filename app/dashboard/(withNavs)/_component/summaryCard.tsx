import React from "react";
import { Typography } from "@/components";

type Props = {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
};

export const SummaryCard = ({ label, value, icon }: Props) => {
  return (
    <div className="rounded-lg border border-solid border-[#EAECF0] bg-white p-[clamp(16px,3vw,24px)]">
      {icon && <div className="mb-2">{icon}</div>}
      <Typography fontWeight="medium" variant="p-m" color="TGBA">
        {label}
      </Typography>
      <Typography
        variant="h-xxl"
        className="text-[2.25rem]"
        fontWeight="semibold"
        color={"TGDD"}
      >
        {value}
      </Typography>
    </div>
  );
};
