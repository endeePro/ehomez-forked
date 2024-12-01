"use client";

import React, { useEffect, useRef, useState } from "react";
import { notFound } from "next/navigation";
import {
  Button,
  Checkbox,
  Modal,
  notify,
  PageHeader,
  PageLoader,
  TextField,
  Typography,
} from "@/components";
import { useCreateRoleMutation, useGetRolePermissionsQuery } from "@/redux/api";
import { IApiError } from "@/redux/api/genericInterface";
import { getErrorMessage } from "@/utils/getErrorMessges";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";

import { ConfirmListingDialog } from "../../../list-management/_components";

const validationSchema = yup.object({
  name: yup
    .string()
    .required("Role name is required")
    .min(3, "Role name must be at least 3 characters"),
  description: yup
    .string()
    .required("Description is required")
    .max(500, "Description must not exceed 500 characters"),
  permissions: yup
    .array()
    .of(yup.number())
    .min(1, "At least one permission must be selected"),
});

type IRoleDetailsFormData = yup.InferType<typeof validationSchema>;

const CreateRole = () => {
  const {
    data: dataPermissions,
    isFetching,
    isLoading,
  } = useGetRolePermissionsQuery();
  const [createRoleMutation, { isLoading: isCreating }] =
    useCreateRoleMutation();

  const [showCreateRoleModal, setShowCreateRoleModal] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    clearErrors,
    reset,
  } = useForm<IRoleDetailsFormData>({
    resolver: yupResolver(validationSchema),
    mode: "onChange",
  });

  if (isLoading || isFetching) return <PageLoader />;

  const onSubmit = async ({
    name,
    description,
    permissions,
  }: IRoleDetailsFormData) => {
    try {
      const res = await createRoleMutation({
        name,
        description,
        permissions: permissions as number[],
      }).unwrap();

      setShowCreateRoleModal(false);
      notify.success({
        message: "Role Created",
        subtitle: res.responseMessage,
      });
      reset();
    } catch (error) {
      notify.error({
        message: "Unable to Create Role",
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
      <>
        <Modal
          mobileLayoutType="normal"
          isOpen={showCreateRoleModal}
          closeModal={() => setShowCreateRoleModal(false)}
        >
          <ConfirmListingDialog
            isError={false}
            title="Create a New Role ?"
            paragraph={
              <Typography variant="p-m" className="text-base">
                Are you sure you want to Create this role? Kindly note that this
                role would have access to within the system alongside it
                designated system functionality access
              </Typography>
            }
            onCancel={() => setShowCreateRoleModal(false)}
            onApprove={handleCreate}
            isLoading={isCreating}
            cancleBtnText="No, Cancel"
            proceedBtnText="Yes, Create"
            variant="primary"
            type="button"
          />
        </Modal>
      </>
    );
  };

  return (
    <div>
      {renderModal()}
      <PageHeader
        title="Create a new role "
        subTitle="Manage Role and Permission"
        buttonGroup={
          <Button onClick={() => setShowCreateRoleModal(true)}>
            Create a New Role
          </Button>
        }
      />

      <form
        className="mt-8 flex flex-col gap-4"
        ref={formRef}
        onSubmit={handleSubmit(onSubmit, () => setShowCreateRoleModal(false))}
      >
        <fieldset className="flex border-b border-solid border-[#EAECF0] pb-6 mmd:flex-col mmd:gap-2">
          <div className="w-[200px]">
            <Typography variant="c-m" className="text-[#344054]">
              Role Name
            </Typography>
          </div>
          <div className="max-w-[512px] flex-1 lg:mx-auto">
            <TextField
              name="name"
              inputType="input"
              type="text"
              placeholder="Enter role name"
              register={register}
              error={!!errors.name}
              errorText={errors.name?.message}
            />
          </div>
        </fieldset>
        <fieldset className="flex border-b border-solid border-[#EAECF0] pb-6 mmd:flex-col mmd:gap-2">
          <div className="w-[200px]">
            <Typography variant="c-m" className="text-[#344054]">
              Description
            </Typography>
          </div>
          <div className="max-w-[512px] flex-1 lg:mx-auto">
            <TextField
              name="description"
              inputType="textarea"
              placeholder="Enter role description"
              register={register}
              error={!!errors.description}
              errorText={errors.description?.message}
            />
          </div>
        </fieldset>
        <fieldset className="flex border-b border-solid border-[#EAECF0] pb-6 mmd:flex-col mmd:gap-2">
          <div className="w-[200px]">
            <Typography variant="c-m" className="text-[#344054]">
              Associated Permission
            </Typography>
          </div>
          <div className="flex max-w-[512px] flex-1 flex-col gap-2 lg:mx-auto">
            {dataPermissions?.map((permission) => (
              <Checkbox
                key={permission.value}
                checked={watch("permissions")?.includes(permission.value)}
                id={`permission-${permission.value}`}
                label={permission.name}
                value={permission.value.toString()}
                onSelect={(e) => {
                  const value = Number(e.target.value);
                  setValue(
                    "permissions",

                    [...(watch("permissions") || []), value],
                  );
                  clearErrors("permissions");
                }}
              />
            ))}
            {errors.permissions && (
              <Typography variant="c-s" className="mt-1 text-red-500">
                {errors.permissions.message}
              </Typography>
            )}
          </div>
        </fieldset>
      </form>
    </div>
  );
};

export default CreateRole;
