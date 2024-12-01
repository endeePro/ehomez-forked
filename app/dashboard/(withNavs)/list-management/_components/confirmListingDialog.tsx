import React, { FC, ReactElement, ReactNode } from "react";
import { ModalErooricon, ModalSuccessIcon } from "@/assets/svgs";
import { Button, Typography } from "@/components";

interface ConfirmListingDialogProps {
  isError: boolean;
  title: string | null;
  paragraph: string | ReactNode | ReactElement;
  onCancel: () => void;
  onApprove: () => void;
  cancleBtnText?: string;
  proceedBtnText?: string;
  isLoading?: boolean;
  type?: "button" | "submit" | "reset" | undefined;
  variant?:
    | "danger"
    | "primary"
    | "secondary"
    | "neutral"
    | "tertiary"
    | "plain"
    | null;
}

export const ConfirmListingDialog: FC<ConfirmListingDialogProps> = ({
  isError,
  title,
  paragraph,
  onCancel,
  onApprove,
  cancleBtnText = "No, Cancel",
  proceedBtnText = "Yes, Approve",
  isLoading = false,
  variant = "primary",
  type = "button",
}) => {
  return (
    <div className="w-[90vw] max-w-[448px] rounded-xl bg-N0 p-6 transition-all duration-300 ease-in-out">
      <div>{!isError ? <ModalErooricon /> : <ModalSuccessIcon />}</div>
      <div className="mt-3 flex h-full flex-col justify-between">
        {title && (
          <Typography variant="h-l" className="mb-3 text-2xl">
            {title}
          </Typography>
        )}
        {typeof paragraph === "string" ? (
          <Typography variant="p-m" className="text-base">
            {paragraph}
          </Typography>
        ) : (
          paragraph
        )}
        <div className="mt-8 flex justify-end gap-2">
          <Button
            variant="neutral"
            type="button"
            className="w-full rounded-full border border-solid border-[#D0D5DD]"
            onClick={onCancel}
            disabled={isLoading}
          >
            {cancleBtnText}
          </Button>
          <Button
            loading={isLoading}
            className="w-full rounded-full"
            onClick={onApprove}
            type={type}
            disabled={isLoading}
            variant={variant}
          >
            {proceedBtnText}
          </Button>
        </div>
      </div>
    </div>
  );
};
