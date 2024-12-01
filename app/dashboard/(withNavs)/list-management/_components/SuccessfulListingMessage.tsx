import React, { FC } from "react";
import { BigHouseImage } from "@/assets/svgs";
import { Typography } from "@/components";

interface SuccessfulListingMessageProps {
  title?: string;
  message?: string;
  image?: React.ReactNode;
}

export const SuccessfulListingMessage: FC<SuccessfulListingMessageProps> = ({
  title = "New Property Listed",
  message = "Congratulations! A new property has been successfully listed.",
  image = <BigHouseImage />,
}) => {
  return (
    <div className="flex flex-col gap-2">
      {image}
      <Typography variant="h-l" className="mb-3 text-2xl">
        {title}
      </Typography>
      <Typography variant="p-m" className="text-base">
        {message}
      </Typography>
    </div>
  );
};
