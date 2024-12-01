"use client";

import React, { useRef, useState } from "react";
import {
  Button,
  Modal,
  notify,
  PageHeader,
  PageLoader,
  SMSelectDropDown,
  TextField,
  Typography,
} from "@/components";
import { useCreateAdminMutation, useGetRolesQuery } from "@/redux/api";
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
  middleName: yup.string().required("Middle name is required"),
  phoneNumber: yup.string().required("Phone number is required"),
  roleId: yup.string().required("Role is required"),
});

type ICreateUserFormData = yup.InferType<typeof validationSchema>;

const CreateUser = () => {
  const { data: roles, isLoading: rolesLoading } = useGetRolesQuery();
  const [createAdminMutation, { isLoading: isCreating }] =
    useCreateAdminMutation();

  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    clearErrors,
  } = useForm<ICreateUserFormData>({
    resolver: yupResolver(validationSchema),
    mode: "onChange",
  });

  if (rolesLoading) return <PageLoader />;

  const onSubmit = async (data: ICreateUserFormData) => {
    try {
      const res = await createAdminMutation(data).unwrap();
      setShowCreateUserModal(false);
      notify.success({
        message: "User Created",
        subtitle: res.responseMessage,
      });
      reset();
    } catch (error) {
      notify.error({
        message: "Unable to Create admin",
        subtitle: getErrorMessage(error as IApiError),
      });
    }
  };

  const handleCreate = () => {
    if (formRef.current) {
      formRef.current.dispatchEvent(
        new Event("submit", { cancelable: true, bubbles: true }),
      );
    }
  };

  const renderModal = () => {
    return (
      <Modal
        mobileLayoutType="normal"
        isOpen={showCreateUserModal}
        closeModal={() => setShowCreateUserModal(false)}
      >
        <ConfirmListingDialog
          isError={false}
          title="Create a admin?"
          paragraph={
            <Typography variant="p-m" className="text-base">
              Are you sure you want to create this admin? Kindly note that this
              user would have access to their designated system functionality
              access.
            </Typography>
          }
          onCancel={() => setShowCreateUserModal(false)}
          onApprove={handleCreate}
          isLoading={isCreating}
          cancleBtnText="No, Cancel"
          proceedBtnText="Yes, Create"
          variant="primary"
          type="button"
        />
      </Modal>
    );
  };

  return (
    <div>
      {renderModal()}
      <PageHeader
        title="Add a New Admin"
        subTitle="Create a new user with ease"
        buttonGroup={
          <Button onClick={() => setShowCreateUserModal(true)}>
            Create a admin
          </Button>
        }
      />

      <form
        className="mt-8 flex flex-col gap-4"
        ref={formRef}
        onSubmit={handleSubmit(onSubmit, (err) => {
          setShowCreateUserModal(false);
          console.log(err);
        })}
      >
        <fieldset className="flex border-b border-solid border-[#EAECF0] pb-6 mmd:flex-col mmd:gap-2">
          <div className="w-[200px]">
            <Typography variant="c-m" className="text-[#344054]">
              Email Address
            </Typography>
          </div>
          <div className="max-w-[512px] flex-1 lg:mx-auto">
            <TextField
              name="emailAddress"
              inputType="input"
              type="email"
              placeholder="Enter email address"
              register={register}
              error={!!errors.emailAddress}
              errorText={errors.emailAddress?.message}
            />
          </div>
        </fieldset>

        <fieldset className="flex border-b border-solid border-[#EAECF0] pb-6 mmd:flex-col mmd:gap-2">
          <div className="w-[200px]">
            <Typography variant="c-m" className="text-[#344054]">
              First Name
            </Typography>
          </div>
          <div className="max-w-[512px] flex-1 lg:mx-auto">
            <TextField
              name="firstName"
              inputType="input"
              type="text"
              placeholder="Enter first name"
              register={register}
              error={!!errors.firstName}
              errorText={errors.firstName?.message}
            />
          </div>
        </fieldset>

        <fieldset className="flex border-b border-solid border-[#EAECF0] pb-6 mmd:flex-col mmd:gap-2">
          <div className="w-[200px]">
            <Typography variant="c-m" className="text-[#344054]">
              Last Name
            </Typography>
          </div>
          <div className="max-w-[512px] flex-1 lg:mx-auto">
            <TextField
              name="lastName"
              inputType="input"
              type="text"
              placeholder="Enter last name"
              register={register}
              error={!!errors.lastName}
              errorText={errors.lastName?.message}
            />
          </div>
        </fieldset>

        <fieldset className="flex border-b border-solid border-[#EAECF0] pb-6 mmd:flex-col mmd:gap-2">
          <div className="w-[200px]">
            <Typography variant="c-m" className="text-[#344054]">
              Middle Name
            </Typography>
          </div>
          <div className="max-w-[512px] flex-1 lg:mx-auto">
            <TextField
              name="middleName"
              inputType="input"
              type="text"
              placeholder="Enter middle name"
              register={register}
              error={!!errors.middleName}
              errorText={errors.middleName?.message}
            />
          </div>
        </fieldset>

        <fieldset className="flex border-b border-solid border-[#EAECF0] pb-6 mmd:flex-col mmd:gap-2">
          <div className="w-[200px]">
            <Typography variant="c-m" className="text-[#344054]">
              Phone Number
            </Typography>
          </div>
          <div className="max-w-[512px] flex-1 lg:mx-auto">
            <TextField
              name="phoneNumber"
              inputType="input"
              type="tel"
              placeholder="Enter phone number"
              register={register}
              error={!!errors.phoneNumber}
              errorText={errors.phoneNumber?.message}
            />
          </div>
        </fieldset>

        <fieldset className="flex border-b border-solid border-[#EAECF0] pb-6 mmd:flex-col mmd:gap-2">
          <div className="w-[200px]">
            <Typography variant="c-m" className="text-[#344054]">
              Role
            </Typography>
          </div>
          <div className="max-w-[512px] flex-1 lg:mx-auto">
            <SMSelectDropDown
              name="roleId"
              options={
                roles?.data
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

export default CreateUser;
