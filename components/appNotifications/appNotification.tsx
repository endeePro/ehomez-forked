"use client";

import React, { useState } from "react";
import { AlertIcon } from "@/assets/svgs";
import {
  useGetNotificationsQuery,
  useMarkNotificationAsReadMutation,
} from "@/redux/api";
import {
  FocusableItem,
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuItem,
} from "@szhsin/react-menu";

import { Avatar } from "../avatar";
import { Typography } from "../typography";

export const AppNotification = () => {
  const { data, isLoading } = useGetNotificationsQuery();
  const [markNotificationAsRead] = useMarkNotificationAsReadMutation();
  const [activeTab, setActiveTab] = useState("all");

  const notifications = data?.data || [];
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const filteredNotifications = notifications.filter((notification) => {
    if (activeTab === "unread") return !notification.isRead;
    if (activeTab === "read") return notification.isRead;
    return true;
  });

  const handleMarkAllAsRead = async () => {
    try {
      await Promise.all(
        notifications
          .filter((n) => !n.isRead)
          .map((n) => markNotificationAsRead({ notificationId: n.id })),
      );
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    // @ts-expect-error
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 24) {
      return `${diffInHours}hrs ago`;
    }
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Menu
      menuButton={
        <MenuButton className="hover:SLGNH relative h-fit w-fit cursor-pointer rounded-[8px] bg-SLGN p-2 ring-[1px] ring-SLGB">
          <AlertIcon />
          {unreadCount > 0 && (
            <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
              {unreadCount}
            </div>
          )}
        </MenuButton>
      }
      className="[&>ul.szh-menu]:!top-[30px] [&>ul.szh-menu]:!dropdown-menu-box-shadow"
      transition
      align="end"
      arrow
      position="auto"
    >
      <div className="h-screen !max-h-[650px] w-screen max-w-[420px]">
        <FocusableItem className="flex w-full items-center justify-between pt-4 hover:!bg-white">
          {({ ref }) => (
            <>
              <Typography variant="c-l" color="text-light">
                Notifications ({notifications.length})
              </Typography>
              {unreadCount > 0 && (
                <MenuButton
                  ref={ref}
                  onClick={handleMarkAllAsRead}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Typography color="GB" variant="p-s">
                    Mark all as read
                  </Typography>
                </MenuButton>
              )}
            </>
          )}
        </FocusableItem>

        <MenuDivider />

        <div className="flex gap-2 border-b px-4 py-2">
          {["all", "unread", "read"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-md px-3 py-1 ${
                activeTab === tab
                  ? "bg-blue-100 text-blue-600"
                  : "hover:bg-gray-100"
              }`}
            >
              <Typography variant="p-s">
                {tab.charAt(0).toUpperCase() + tab.slice(1)} (
                {tab === "all"
                  ? notifications.length
                  : tab === "unread"
                    ? unreadCount
                    : notifications.length - unreadCount}
                )
              </Typography>
            </button>
          ))}
        </div>

        <MenuGroup className="h-[calc(100%_-_120px)] flex-1 flex-grow overflow-y-scroll">
          {isLoading ? (
            <div className="flex h-full items-center justify-center">
              <Typography variant="p-m">Loading...</Typography>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <Typography variant="p-m" color="text-light">
                No notifications
              </Typography>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <MenuItem
                key={notification.id}
                className={`inline-flex w-full items-start gap-2 !px-5 !py-4 ${
                  !notification.isRead ? "bg-blue-50" : ""
                }`}
                onClick={() => {
                  if (!notification.isRead) {
                    markNotificationAsRead({ notificationId: notification.id });
                  }
                }}
              >
                <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-md">
                  <img
                    src={notification.featuredImage}
                    alt={notification.name}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="flex flex-1 flex-col gap-1">
                  <Typography variant="p-m" fontWeight="bold">
                    {notification.name}
                  </Typography>
                  <Typography variant="p-s" color="text-light">
                    {notification.message}
                  </Typography>
                  <Typography variant="p-s" color="N50">
                    {formatRelativeTime(notification.createdOn)} |{" "}
                    {notification.state}
                  </Typography>
                </div>
              </MenuItem>
            ))
          )}
        </MenuGroup>
      </div>
    </Menu>
  );
};

export default AppNotification;
