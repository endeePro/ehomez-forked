"use client";

import React, { useEffect, useRef } from "react";
import { notFound } from "next/navigation";
import {
  ButtonDropdown,
  Modal,
  notify,
  PageHeader,
  PageLoader,
  SMSelectDropDown,
  TextField,
  Typography,
} from "@/components";
import {
  useGetRolesQuery,
  useGetUserByIdQuery,
  useUpdateUserMutation,
} from "@/redux/api";
import { IApiError } from "@/redux/api/genericInterface";
import { getErrorMessage } from "@/utils/getErrorMessges";
import { fieldSetterAndClearer } from "@/utils/helpers";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";

import { ConfirmListingDialog } from "../../../list-management/_components";

const validationSchema = yup.object({
  emailAddress: yup
    .string()
    .email("Invalid email")
    .required("Email is required"),
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  middleName: yup.string(),
  phoneNumber: yup.string().required("Phone number is required"),
  roleId: yup.string().required("Role is required"),
});

type IUpdateUserDetailsFormData = yup.InferType<typeof validationSchema>;

type Props = {
  params: {
    userId: string;
  };
};

const UserDetails = ({ params }: Props) => {
  const { userId } = params;
  const { data: userData, isLoading: isLoadingUser } = useGetUserByIdQuery({
    userId,
  });
  const { data: rolesData, isLoading: isLoadingRoles } = useGetRolesQuery();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [showDeactivateUserModal, setShowDeactivateUserModal] =
    React.useState(false);
  const [showEditUserModal, setShowEditUserModal] = React.useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    clearErrors,
    reset,
    watch,
  } = useForm<IUpdateUserDetailsFormData>({
    resolver: yupResolver(validationSchema),
    mode: "onChange",
  });

  useEffect(() => {
    if (userData && rolesData) {
      const roleId = rolesData.data?.find(
        (role) => role.name === userData.data.roles[0],
      )?.id;

      reset({
        firstName: userData.data.firstName ?? "",
        lastName: userData.data.lastName ?? "",
        middleName: userData.data.middleName ?? "",
        phoneNumber: userData.data.phoneNumber ?? "",
        emailAddress: userData.data.emailAddress ?? "",
        roleId: roleId ?? "",
      });
    }
  }, [userData, rolesData, reset]);

  if (userId === undefined || userId.length < 1) notFound();
  if (isLoadingUser || isLoadingRoles) return <PageLoader />;

  const onSubmit = async (formData: IUpdateUserDetailsFormData) => {
    try {
      const res = await updateUser({
        userId,
        payload: formData,
      }).unwrap();
      setShowEditUserModal(false);
      notify.success({
        message: "User Updated",
        subtitle: res.responseMessage,
      });
    } catch (error) {
      notify.error({
        message: "Unable to Update User",
        subtitle: getErrorMessage(error as IApiError),
      });
    }
  };

  const handleDeactivate = () => {
    // Implement deactivate logic
    setShowDeactivateUserModal(false);
  };

  const handleEdit = () => {
    if (formRef.current) {
      formRef.current.dispatchEvent(
        new Event("submit", { cancelable: true, bubbles: true }),
      );
    }
  };

  const renderModal = () => (
    <>
      <Modal
        mobileLayoutType="normal"
        isOpen={showDeactivateUserModal}
        closeModal={() => setShowDeactivateUserModal(false)}
      >
        <ConfirmListingDialog
          isError={false}
          title="Deactivate this user"
          paragraph={
            <Typography variant="p-m" className="text-base">
              Are you sure you want to deactivate this user? User information
              and activities would be temporarily removed from this system and
              the user won't have access to system functionalities.
            </Typography>
          }
          onCancel={() => setShowDeactivateUserModal(false)}
          onApprove={handleDeactivate}
          isLoading={false}
          cancleBtnText="No, Cancel"
          proceedBtnText="Yes, Deactivate"
          variant="danger"
          type="button"
        />
      </Modal>
      <Modal
        mobileLayoutType="normal"
        isOpen={showEditUserModal}
        closeModal={() => setShowEditUserModal(false)}
      >
        <ConfirmListingDialog
          isError={false}
          title="Save and Update Changes?"
          paragraph={
            <Typography variant="p-m" className="text-base">
              Are you sure you want to Save and Update Changes for this user?
              This might impact user permissions and access levels.
            </Typography>
          }
          onCancel={() => setShowEditUserModal(false)}
          onApprove={handleEdit}
          isLoading={isUpdating}
          cancleBtnText="No, Cancel"
          proceedBtnText="Yes, Update"
          variant="primary"
          type="button"
        />
      </Modal>
    </>
  );

  return (
    <div>
      {renderModal()}
      <PageHeader
        title="View Specific User Detail"
        subTitle="Manage User and roles"
        buttonGroup={
          <ButtonDropdown
            heading="Quick Actions:"
            btnText="Quick Actions"
            iconType="arrow-down"
            noMargin
            buttonGroup={[
              {
                name: "Deactivate User",
                onClick: () => setShowDeactivateUserModal(true),
              },
              {
                name: "Save and Update Changes",
                onClick: () => setShowEditUserModal(true),
              },
            ]}
          />
        }
      />

      <form
        className="mt-8 flex flex-col gap-4"
        ref={formRef}
        onSubmit={handleSubmit(onSubmit, () => {
          setShowEditUserModal(false);
        })}
      >
        {[
          { name: "emailAddress", label: "Email Address", type: "email" },
          { name: "firstName", label: "First Name", type: "text" },
          { name: "lastName", label: "Last Name", type: "text" },
          { name: "middleName", label: "Middle Name", type: "text" },
          { name: "phoneNumber", label: "Phone Number", type: "tel" },
        ].map((field) => (
          <fieldset
            key={field.name}
            className="flex border-b border-solid border-[#EAECF0] pb-6 mmd:flex-col mmd:gap-2"
          >
            <div className="w-[200px]">
              <Typography variant="c-m" className="text-[#344054]">
                {field.label}
              </Typography>
            </div>
            <div className="max-w-[512px] flex-1 lg:mx-auto">
              <TextField
                name={
                  field.name as
                    | "emailAddress"
                    | "firstName"
                    | "lastName"
                    | "middleName"
                    | "phoneNumber"
                    | "roleId"
                }
                inputType="input"
                type={field.type}
                placeholder={`Enter ${field.label.toLowerCase()}`}
                register={register}
                error={!!errors[field.name as keyof IUpdateUserDetailsFormData]}
                errorText={
                  errors[field.name as keyof IUpdateUserDetailsFormData]
                    ?.message
                }
              />
            </div>
          </fieldset>
        ))}

        <fieldset className="flex border-b border-solid border-[#EAECF0] pb-6 mmd:flex-col mmd:gap-2">
          <div className="w-[200px]">
            <Typography variant="c-m" className="text-[#344054]">
              Role
            </Typography>
          </div>
          <div className="max-w-[512px] flex-1 lg:mx-auto">
            <SMSelectDropDown
              name="roleId"
              value={
                rolesData?.data
                  ?.filter((role) => role.id === watch("roleId"))
                  .map((role) => ({ value: role.id, label: role.name }))[0]
              }
              options={
                rolesData?.data
                  .filter((role) => role.isActive)
                  .map((role) => ({
                    value: role.id,
                    label: role.name,
                  })) || []
              }
              placeholder="Select role"
              onChange={(e) =>
                fieldSetterAndClearer({
                  value: e.value,
                  setterFunc: setValue,
                  setField: "roleId",
                  clearErrors,
                })
              }
            />
          </div>
        </fieldset>
      </form>
    </div>
  );
};

export default UserDetails;
