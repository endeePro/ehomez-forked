import React from "react";
import {
  Button,
  notify,
  SMSelectDropDown,
  TextField,
  Typography,
} from "@/components";
import { IApiError } from "@/redux/api/genericInterface";
import { IInquiryInfo, useUpdateInquiryMutation } from "@/redux/api/property";
import { getErrorMessage } from "@/utils/getErrorMessges";
import { fieldSetterAndClearer } from "@/utils/helpers";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";

const schema = yup.object().shape({
  response: yup.string().notRequired(),
  status: yup.string().required(),
});

type FormData = yup.InferType<typeof schema>;

const inquiryStatus = [
  { label: "Reschedule Enquiry", value: "1" },
  { label: "Cancel Enquiry", value: "2" },
  { label: "Approve Enquiry", value: "3" },
];

const TakeInquiryAction = ({ props }: { props: IInquiryInfo }) => {
  const [mutate, { isLoading }] = useUpdateInquiryMutation();
  const {
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
    clearErrors,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      await mutate({
        payload: {
          status: Number(data.status),
          response: data.response as string | undefined,
        },
        id: props.id,
      }).unwrap();
      notify.success({ message: "inquiry updated" });
    } catch (err) {
      notify.error({
        message: "Unable to take inquiry action",
        subtitle: getErrorMessage(err as IApiError),
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-[100vw] max-w-[450px] flex-col gap-4 bg-white px-4 py-6"
    >
      <TextField
        name="requestType"
        inputType="input"
        type="text"
        placeholder="Start typing"
        label="Request Type"
        value={props.bookPhysicalVisitation ? "Yes" : "No"}
        flexStyle="col"
        disabled
      />
      <TextField
        name="visit"
        inputType="input"
        type="text"
        placeholder="Start typing"
        label="Physical Visitation"
        value={props.bookPhysicalVisitation ? "Yes" : "No"}
        flexStyle="col"
        disabled
      />
      <TextField
        name="date"
        inputType="input"
        type="text"
        placeholder="Start typing"
        label="Inquiry Date"
        value={new Date(props.proposedDate).toDateString()}
        flexStyle="col"
        disabled
      />
      <TextField
        name="message"
        inputType="textarea"
        type="text"
        label="Inquiry Message"
        value={props.message}
        flexStyle="col"
        className="!h-[92px]"
        disabled
      />

      <div className="col-span-1 flex w-full flex-col gap-6">
        <TextField
          name="response"
          value={watch("response") ?? ""}
          onChange={(e) => setValue("response", e.target.value)}
          inputType="textarea"
          type="text"
          placeholder="Start typing"
          label="Response Message"
          flexStyle="col"
          className="!h-[92px]"
          error={!!errors.response}
          errorText={errors.response?.message}
        />

        <div className="flex w-full flex-col gap-2">
          <Typography
            variant="c-m"
            fontWeight={"semibold"}
            className="text-[#344054]"
          >
            Decision
          </Typography>
          <SMSelectDropDown
            options={inquiryStatus}
            placeholder="Change status"
            isMulti={false}
            value={inquiryStatus.find(
              (value) => value.value === watch("status"),
            )}
            onChange={(value) => {
              fieldSetterAndClearer({
                value: value.value,
                setterFunc: setValue,
                setField: "status",
                clearErrors,
              });
            }}
            isError={!!errors.status}
            errorText={errors.status?.message}
          />
        </div>
      </div>
      <hr className="mt-3" />
      <div className="w-full py-3">
        <Button
          disabled={isLoading}
          loading={isLoading}
          className="w-full"
          type="submit"
        >
          Respond
        </Button>
      </div>
    </form>
  );
};

export { TakeInquiryAction };
