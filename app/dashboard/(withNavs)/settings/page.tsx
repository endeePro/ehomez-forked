"use client";

import React from "react";
import Link from "next/link";
import { TextField, Typography } from "@/components";
import { useGetUserDetailsQuery } from "@/redux/api";

import Loading from "@/app/loading";

interface UserInfoProps {
  label: string;
  value: string;
}

const UserInfo: React.FC<UserInfoProps> = ({ label, value }) => (
  <div className="flex border-b border-solid border-[#EAECF0] pb-6 mmd:flex-col mmd:gap-2">
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

const UserAvatarIcon: React.FC<{ name: string }> = ({ name }) => (
  <div className="ml-5 flex flex-col gap-2 px-5 mlg:ml-[unset]">
    <div className="mx-auto flex aspect-square w-[clamp(100px,18vw,189px)] items-center justify-center rounded-full border-[6px] border-solid border-SLGB">
      <span className="font-brCobane text-[clamp(50px,8vw,89px)] font-semibold">
        {name
          .split(" ")
          .map((n) => n[0])
          .join("")}
      </span>
    </div>
    <div>
      <Typography fontWeight="regular" variant="p-xxl" color="GB">
        {name}
      </Typography>
      <Typography variant="p-m" color="GB">
        Last signed in 46 minutes ago
      </Typography>
    </div>
  </div>
);

const Settings: React.FC = () => {
  const { data: userResponse, isLoading, error } = useGetUserDetailsQuery("");

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
    { label: "Phone Number", value: user.phoneNumber },
    { label: "Role", value: user.roles.join(", ") },
  ];

  return (
    <div className="py-6">
      <Typography color="GB" fontWeight="semibold" variant="h-l">
        Settings
      </Typography>
      <div className="mt-[42px] flex w-full flex-wrap justify-between gap-6 mmlg:items-center mmlg:justify-center">
        <UserAvatarIcon name={`${user.firstName} ${user.lastName}`} />
        <div className="flex w-full max-w-[690px] flex-col gap-4">
          {userInfo.map((info, index) => (
            <UserInfo key={index} label={info.label} value={info.value} />
          ))}

          <div className="rounded-[24px] bg-SLGL p-[24px]">
            <Typography variant="h-l" fontWeight="medium" color="GB">
              Change Password
            </Typography>
            <Typography variant="p-s" className="gray-500 mt-1">
              Modify your security across the system.
            </Typography>
            <Link
              href={"/dashboard/change-password?id=" + user.userId}
              className="mt-4 flex h-[56px] items-center justify-between rounded-[8px] bg-white px-4"
            >
              <div className="flex items-center gap-2">
                <svg
                  width="24"
                  height="25"
                  viewBox="0 0 24 25"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="24" height="24.4091" rx="12" fill="#D0D9D6" />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M8.31765 11.3486V10.2277C8.31765 9.25124 8.70555 8.31475 9.39603 7.62428C10.0865 6.9338 11.023 6.5459 11.9995 6.5459C12.9759 6.5459 13.9124 6.9338 14.6029 7.62428C15.2934 8.31475 15.6813 9.25124 15.6813 10.2277V11.3486C16.2895 11.3939 16.6849 11.5084 16.9746 11.7981C17.454 12.277 17.454 13.0488 17.454 14.5914C17.454 16.1339 17.454 16.9057 16.9746 17.3846C16.4956 17.8641 15.7238 17.8641 14.1813 17.8641H9.81765C8.2751 17.8641 7.50329 17.8641 7.02438 17.3846C6.54492 16.9057 6.54492 16.1339 6.54492 14.5914C6.54492 13.0488 6.54492 12.277 7.02438 11.7981C7.31347 11.5084 7.70947 11.3939 8.31765 11.3486ZM9.13583 10.2277C9.13583 9.46823 9.43753 8.73986 9.97457 8.20282C10.5116 7.66578 11.24 7.36408 11.9995 7.36408C12.759 7.36408 13.4873 7.66578 14.0244 8.20282C14.5614 8.73986 14.8631 9.46823 14.8631 10.2277V11.3208C14.6542 11.3186 14.4273 11.3186 14.1813 11.3186H9.81765C9.5711 11.3186 9.34474 11.3186 9.13583 11.3208V10.2277ZM9.81765 15.1368C9.96231 15.1368 10.1011 15.0793 10.2033 14.977C10.3056 14.8748 10.3631 14.736 10.3631 14.5914C10.3631 14.4467 10.3056 14.308 10.2033 14.2057C10.1011 14.1034 9.96231 14.0459 9.81765 14.0459C9.67299 14.0459 9.53425 14.1034 9.43195 14.2057C9.32966 14.308 9.27219 14.4467 9.27219 14.5914C9.27219 14.736 9.32966 14.8748 9.43195 14.977C9.53425 15.0793 9.67299 15.1368 9.81765 15.1368ZM11.9995 15.1368C12.1441 15.1368 12.2829 15.0793 12.3852 14.977C12.4875 14.8748 12.5449 14.736 12.5449 14.5914C12.5449 14.4467 12.4875 14.308 12.3852 14.2057C12.2829 14.1034 12.1441 14.0459 11.9995 14.0459C11.8548 14.0459 11.7161 14.1034 11.6138 14.2057C11.5115 14.308 11.454 14.4467 11.454 14.5914C11.454 14.736 11.5115 14.8748 11.6138 14.977C11.7161 15.0793 11.8548 15.1368 11.9995 15.1368ZM14.7267 14.5914C14.7267 14.736 14.6693 14.8748 14.567 14.977C14.4647 15.0793 14.3259 15.1368 14.1813 15.1368C14.0366 15.1368 13.8979 15.0793 13.7956 14.977C13.6933 14.8748 13.6358 14.736 13.6358 14.5914C13.6358 14.4467 13.6933 14.308 13.7956 14.2057C13.8979 14.1034 14.0366 14.0459 14.1813 14.0459C14.3259 14.0459 14.4647 14.1034 14.567 14.2057C14.6693 14.308 14.7267 14.4467 14.7267 14.5914Z"
                    fill="#133F30"
                  />
                </svg>
                <Typography variant="p-m" className="text-gray-600">
                  Change Password
                </Typography>
              </div>
              <svg
                width="16"
                height="17"
                viewBox="0 0 16 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 12.2041L10 8.2041L6 4.2041"
                  stroke="#475467"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
