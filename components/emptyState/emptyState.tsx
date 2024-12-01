"use client";

import { Typography } from "../typography";

interface IEmptyProps {
  title: string;
  text: string;
  buttonGroup?: React.ReactElement;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<IEmptyProps> = ({
  title,
  text,
  buttonGroup,
  icon,
}) => {
  return (
    <div className="flex max-w-[360px] flex-col">
      {icon && <div className="mx-auto mb-4">{icon}</div>}
      <Typography
        variant={"c-xxl"}
        color="GB"
        className="mb-2 text-center"
        fontWeight="bold"
      >
        {title}
      </Typography>
      <Typography variant="p-m" color="GBA" className="text-center">
        {text}
      </Typography>
      {buttonGroup}
    </div>
  );
};
