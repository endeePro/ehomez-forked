import React from "react";
import { EmptyState } from "@/components";
import { propertyStatuses } from "@/constants/data";
import { PropertyById } from "@/redux/api/property";
import { FaCheckCircle } from "react-icons/fa";
import { IoMdCloseCircle } from "react-icons/io";
import { RiChatHistoryFill } from "react-icons/ri";

import { StatusBadge } from "../../../_components";

export const ApprovalHistory = ({
  propertyInfo,
}: {
  propertyInfo: PropertyById;
}) => {
  const approvalHistories = propertyInfo.approvalHistories;
  if (!approvalHistories || approvalHistories.length === 0) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <EmptyState
          title="No Approval History"
          text="There is no approval history for this property yet."
          icon={
            <span className="text-GB">
              <RiChatHistoryFill size={40} />
            </span>
          }
        />
      </div>
    );
  }

  return (
    <div className="relative pl-8">
      <ul className="space-y-8">
        {approvalHistories.map((history, index) => (
          <li key={index} className="group relative flex items-start">
            {/* Timeline line */}
            <div className="absolute left-[14px] top-[30px] h-[calc(100%_+_8px)] w-1 bg-gray-300 group-last-of-type:hidden"></div>

            {/* Timeline indicator */}
            <div className="z-10 flex h-8 w-8 items-center justify-center rounded-full text-GB">
              {history.propertyStatus === 2 ? (
                <FaCheckCircle className="h-8 w-8" />
              ) : (
                <IoMdCloseCircle className="h-8 w-8" />
              )}
            </div>

            <div className="ml-4 w-full rounded-lg border bg-white p-4 shadow-sm">
              <span className="absolute right-4 top-4 text-sm text-gray-500">
                {/* {new Date(history.createdOn).toLocaleDateString()} */}
                <StatusBadge
                  status={propertyStatuses[history.propertyStatus - 1]}
                  statusText={propertyStatuses[history.propertyStatus - 1]}
                />
              </span>

              <div className="text-sm text-gray-600">
                <p>
                  Status:{" "}
                  <span className="font-medium">
                    {propertyStatuses[history.propertyStatus - 1]}
                  </span>
                </p>
                <p>
                  Admin:{" "}
                  <span className="font-medium">{history.adminActionBy}</span>
                </p>
                <p>Commission: {history.commission}</p>
              </div>
              <span className="font-medium text-gray-800">
                {history.comment}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
