"use client";

import { Typography } from "../typography";

interface IPageHeaderProps {
  title: string | React.ReactNode;
  subTitle?: string;
  buttonGroup?: React.ReactElement;
}

export const PageHeader: React.FC<IPageHeaderProps> = ({
  title,
  subTitle,
  buttonGroup,
}) => {
  return (
    <div className="flex flex-wrap items-start justify-between mmlg:gap-4">
      <div className="flex flex-col gap-1">
        {typeof title === "string" ? (
          <Typography variant="c-xxl" fontWeight="medium" color="TGDD">
            {title}
          </Typography>
        ) : (
          title
        )}
        {subTitle && (
          <Typography variant="c-l" color="TGD">
            {subTitle}
          </Typography>
        )}
      </div>
      <div className="w-fit mmlg:w-full [&>*]:w-full">{buttonGroup}</div>
    </div>
  );
};
