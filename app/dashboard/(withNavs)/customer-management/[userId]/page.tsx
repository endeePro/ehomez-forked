"use client";

import React from "react";
import { PageHeader, TextField, Typography } from "@/components";
import { useGetUserByIdQuery, useGetUserDetailsQuery } from "@/redux/api";

import Loading from "@/app/loading";

type Props = {
  params: {
    userId: string;
  };
};
interface UserInfoProps {
  label: string;
  value: string;
}

const UserInfoItem: React.FC<UserInfoProps> = ({ label, value }) => (
  <div className="flex gap-4 border-b border-solid border-[#EAECF0] pb-6 mmd:flex-col">
    <div className="w-[100px]">
      <Typography variant="c-m" className="text-[#344054]">
        {label}
      </Typography>
    </div>
    <div className="flex-1">
      <TextField
        name={label.toLowerCase().replace(" ", "")}
        value={value}
        disabled
      />
    </div>
  </div>
);

const UserInfo = (props: Props) => {
  const userId = props.params.userId ?? "";
  const {
    data: userResponse,
    isLoading,
    error,
  } = useGetUserByIdQuery({ userId });

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <div>Error loading user details</div>;
  }

  const user = userResponse?.data;

  if (!user) {
    return <div>No user data available</div>;
  }
  const userInfo: UserInfoProps[] = [
    { label: "First Name", value: user.firstName },
    { label: "Middle Name", value: user.middleName },
    { label: "Last Name", value: user.lastName },
    { label: "Email Address", value: user.emailAddress },
    { label: "Address", value: user.address },
    { label: "Phone Number", value: user.phoneNumber },
    { label: "Role", value: user.roles.join(", ") },
  ];
  return (
    <div>
      <PageHeader
        title="View Specific Customer Detail"
        subTitle={`Manage Customer Details`}
      />
      <div className="mt-5 flex w-full max-w-[690px] flex-col gap-4">
        {userInfo.map((info, index) => (
          <UserInfoItem key={index} label={info.label} value={info.value} />
        ))}
      </div>
    </div>
  );
};

export default UserInfo;
