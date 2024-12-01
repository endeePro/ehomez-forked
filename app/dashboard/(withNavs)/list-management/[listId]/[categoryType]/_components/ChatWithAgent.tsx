"use client";

import React from "react";
import { EmptyStateInfoIcon } from "@/assets/svgs";
import { Button, EmptyState } from "@/components";
import { PropertyById } from "@/redux/api/property";

export const ChatWithAgent = ({
  propertyInfo,
}: {
  propertyInfo: PropertyById;
}) => {
  const isListingApproved = propertyInfo.propertyStatus === 2;
  const phoneNumber = propertyInfo.phone; 
  const whatsappLink = `https://wa.me/${phoneNumber}?text=Hello, I'm interested in your property listing`;
  return (
    <div className="flex">
      <div className="mx-auto flex min-h-[50vh] w-full items-center justify-center">
        {!isListingApproved && (
          <EmptyState
            icon={<EmptyStateInfoIcon />}
            title="No Existing Chat with Agent"
            text={`This listing is yet to be Approved therefore you can’t chat with the agent. Take action on listing before this is enabled.`}
            buttonGroup={
              <div className="mt-6 w-full [&>*]:w-full">
                <Button
                  className="cursor-pointer rounded-3xl"
                  variant={"secondary"}
                  disabled
                >
                  Start Chat
                </Button>
              </div>
            }
          />
        )}

        {isListingApproved && (
          <EmptyState
            icon={
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-GB">
                <span className="text-3xl">💬</span>
              </div>
            }
            title="Chat with Agent"
            text={`This listing has been approved! You can now chat directly with the agent to get more information or schedule a visit.
`}
            buttonGroup={
              <div className="mt-6 w-full [&>*]:w-full">
                <Button
                  className="cursor-pointer rounded-3xl"
                  variant={"secondary"}
                  onClick={() => window.open(whatsappLink, "_blank")}
                >
                  <span className="mr-2">💬</span>
                  <span>Start WhatsApp Chat</span>
                </Button>
              </div>
            }
          />
        )}
      </div>
    </div>
  );
};
