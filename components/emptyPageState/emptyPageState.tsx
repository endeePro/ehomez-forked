"use client";

import { Typography } from "../typography";

interface IEmptyProps {
  title: string;
  text: string;
  buttonGroup?: React.ReactElement;
}

export const EmptyPageState: React.FC<IEmptyProps> = ({
  title,
  text,
  buttonGroup,
}) => {
  return (
    <div className="max-w-[360px]">
      <Typography
        variant={"c-xxl"}
        color="N800"
        className="mb-6 text-center"
        fontWeight="bold"
      >
        {title}
      </Typography>
      <Typography variant="p-m" className="text-center">
        {text}
      </Typography>
      {buttonGroup}
    </div>
  );
};
