"use client";

import React, { Fragment, useEffect } from "react";
import { CloseXIcon } from "@/assets/svgs";
import { cn } from "@/utils/helpers";
import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";

import { Button } from "../buttons";
import { Typography } from "../typography";

interface ModalProps {
  isOpen: boolean;
  closeModal: () => void;
  children?: React.ReactNode;
  title?: string;
  closeOnOutsideClick?: boolean;
  footerData?: React.ReactElement;
  mobileLayoutType: "full" | "normal";
}

function Modal({
  isOpen,
  closeModal,
  children,
  title,
  closeOnOutsideClick = true,
  footerData,
  mobileLayoutType,
}: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleClose = () => {
    document.body.style.overflow = "";
    closeModal();
  };

  return (
    <Transition appear show={isOpen} as={Fragment} unmount={isOpen}>
      <Dialog
        as="div"
        className="relative z-[100000]"
        onClose={closeOnOutsideClick ? handleClose : () => null}
      >
        {/* Background Overlay */}
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 z-[99] bg-[#091E428A]" />
        </TransitionChild>

        <div className="fixed inset-0 z-[100] flex w-full items-center justify-center overflow-y-auto hideScrollBar">
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="-translate-y-[100vh] opacity-0"
            enterTo="translate-y-0 opacity-100"
            leave="ease-in duration-300"
            leaveFrom="translate-y-0 opacity-100"
            leaveTo="translate-y-[100vh] opacity-0"
          >
            <DialogPanel
              className={cn(
                mobileLayoutType === "normal" ? "" : "msm:h-screen",
                "flex max-h-screen w-fit flex-col shadow-xl md:rounded-md",
              )}
            >
              {/* Modal Header */}
              {title && (
                <div className="sticky top-0 flex items-center justify-between rounded-t-[inherit] border-b border-solid border-N40 bg-N0 px-6 py-4">
                  <Typography variant="p-l" color="N900">
                    {title}
                  </Typography>

                  <Button
                    onClick={handleClose}
                    variant={"plain"}
                    size={"plain"}
                  >
                    <CloseXIcon />
                  </Button>
                </div>
              )}

              {/* Modal Body */}
              <div className="flex-1 flex-grow bg-white">{children}</div>

              {/* Modal Footer */}
              {footerData && (
                <div className="border-t border-solid border-N40 bg-N0 px-6 py-4">
                  {footerData}
                </div>
              )}
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
}

export { Modal };
