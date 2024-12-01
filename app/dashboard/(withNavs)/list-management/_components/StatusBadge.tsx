import React from "react";

export const StatusBadge = ({
  status,
  statusText,
}: {
  status: string;
  statusText: string;
}) => {
  const getBadgeClasses = (status: string) => {
    const baseClasses = "px-2.5 py-1 rounded text-xs font-normal";
    switch (status) {
      case "Pending":
        return `${baseClasses} bg-[#FFFAEB] text-[#B54708]`;
      case "Approved":
        return `${baseClasses} bg-green-100 text-green-700`;
      case "Closed":
        return `${baseClasses} bg-red-100 text-red-700`;
      case "Deleted":
        return `${baseClasses} bg-red-100 text-red-700`;
      case "Declined":
        return `${baseClasses} bg-red-100 text-red-700`;
      case "Rescheduled":
        return `${baseClasses} bg-blue-700 text-blue-50`;
      default:
        return `${baseClasses} bg-gray-200 text-gray-700`;
    }
  };

  return <span className={getBadgeClasses(status)}>{statusText}</span>;
};
