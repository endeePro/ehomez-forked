"use client";

import React, { useEffect, useRef, useState } from "react";
import { notFound } from "next/navigation";
import {
  ButtonDropdown,
  Checkbox,
  Modal,
  notify,
  PageHeader,
  PageLoader,
  TextField,
  Typography,
} from "@/components";
import {
  useGetRoleByIdQuery,
  useGetRolePermissionsQuery,
  useToggleRoleMutation,
  useUpdateRoleMutation,
} from "@/redux/api";
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

type Props = {
  params: {
    roleId: string;
  };
};

const RoleDetails = ({ params }: Props) => {
  const { roleId } = params;
  const { data: dataPermissions } = useGetRolePermissionsQuery();
  const { data, isLoading, refetch } = useGetRoleByIdQuery({ roleId });
  const [updateRole, { isLoading: isUpdating }] = useUpdateRoleMutation();
  const [toggleRole, { isLoading: isToggling }] = useToggleRoleMutation();
  const [showDeactivateRoleModal, setShowDeactivateRoleModal] = useState(false);
  const [showEditRoleModal, setShowEditRoleModal] = useState(false);
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

  useEffect(() => {
    if (data && dataPermissions) {
      reset({
        name: data.data.name,
        description: data.data.description,
        permissions: data.data.permission.map((value) => {
          const permission = dataPermissions.find((p) => p.name === value);
          return permission ? permission.value : 0;
        }),
      });
    }
  }, [data, dataPermissions, reset]);

  if (roleId === undefined || roleId.length < 1) notFound();
  if (isLoading) return <PageLoader />;

  const onSubmit = async ({
    name,
    description,
    permissions,
  }: IRoleDetailsFormData) => {
    try {
      const res = await updateRole({
        roleId,
        payload: {
          name,
          description,
          permissions: permissions as number[],
        },
      }).unwrap();
      setShowEditRoleModal(false);
      notify.success({
        message: "Role Updated",
        subtitle: res.responseMessage,
      });
      refetch();
    } catch (error) {
      notify.error({
        message: "Unable to Update Role",
        subtitle: getErrorMessage(error as IApiError),
      });
    }
  };

  const handleDeactivate = async () => {
    try {
      const res = await toggleRole(roleId).unwrap();
      setShowDeactivateRoleModal(false);
      notify.success({
        message: "Role Updated",
        subtitle: res.responseMessage,
      });
      refetch();
    } catch (error) {
      notify.error({
        message: "Unable to Update Role",
        subtitle: getErrorMessage(error as IApiError),
      });
    }
  };

  const handleEdit = () => {
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
          isOpen={showDeactivateRoleModal}
          closeModal={() => setShowDeactivateRoleModal(false)}
        >
          <ConfirmListingDialog
            isError={false}
            title="Deactivate this Role"
            paragraph={
              <Typography variant="p-m" className="text-base">
                Are you sure you want to deactivate this role? Role information
                and activities would be temporarily removed from this system and
                users under this role won't have access to system
                functionalities.
              </Typography>
            }
            onCancel={() => setShowDeactivateRoleModal(false)}
            onApprove={handleDeactivate}
            isLoading={isToggling}
            cancleBtnText="No, Cancel"
            proceedBtnText="Yes, Deactivate"
            variant="danger"
            type="button"
          />
        </Modal>
        <Modal
          mobileLayoutType="normal"
          isOpen={showEditRoleModal}
          closeModal={() => setShowEditRoleModal(false)}
        >
          <ConfirmListingDialog
            isError={false}
            title="Save and Update Changes?"
            paragraph={
              <Typography variant="p-m" className="text-base">
                Are you sure you want to Save and Update Changes for this role?
                This might impact user permission levels and types.
              </Typography>
            }
            onCancel={() => setShowEditRoleModal(false)}
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
  };

  return (
    <div>
      {renderModal()}
      <PageHeader
        title="View Specific Role Detail"
        subTitle="Manage Role and Permission"
        buttonGroup={
          <ButtonDropdown
            heading="Quick Actions:"
            btnText="Quick Actions"
            iconType="arrow-down"
            noMargin
            buttonGroup={[
              {
                name: "Deactivate Role",
                onClick: () => setShowDeactivateRoleModal(true),
              },
              {
                name: "Save and Update Changes",
                onClick: () => setShowEditRoleModal(true),
              },
            ]}
          />
        }
      />

      <form
        className="mt-8 flex flex-col gap-4"
        ref={formRef}
        onSubmit={handleSubmit(onSubmit, () => setShowEditRoleModal(false))}
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
                  const checked = e.target.checked;
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

export default RoleDetails;
