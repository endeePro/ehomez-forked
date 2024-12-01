"use client";

import { DatePicker } from "antd";
import { Dayjs } from "dayjs";

import { ValidationText } from "../validationText";
import styles from "./styles.module.css";

const { RangePicker } = DatePicker;

interface RangeSelectorProps {
  name: string;
  setValue: (name: string, dateString: [string, string]) => void;
  clearErrors: (name: string) => void;
  error?: boolean;
  errorText?: string;
  format?: string;
  disabledDate?: (currentDate: Dayjs) => boolean;
  defaultValue?: [Dayjs, Dayjs];
}

export const RangeSelector: React.FC<RangeSelectorProps> = ({
  name,
  setValue,
  clearErrors,
  error,
  errorText,
  format,
  disabledDate,
  defaultValue,
}) => {
  return (
    <div className={`${styles.dtP} ${error ? styles["rse-error-field"] : ""}`}>
      <RangePicker
        name={name}
        color="red"
        defaultValue={defaultValue}
        format={format}
        disabledDate={disabledDate}
        onChange={(_, dateString) => {
          setValue(name, dateString as [string, string]);
          clearErrors(name);
        }}
        needConfirm
      />
      {error && (
        <div
          className={`${styles.validation} ${
            errorText?.length ? styles.validationShow : ""
          }`}
        >
          <ValidationText status={"error"} message={errorText as string} />
        </div>
      )}
    </div>
  );
};
