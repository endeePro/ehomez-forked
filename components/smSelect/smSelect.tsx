"use client";

import React, { forwardRef } from "react";
import Image from "next/image";
import Select, {
  components,
  OptionProps,
  SingleValueProps,
} from "react-select";

import { ValidationText } from "../validationText";

export interface OptionType {
  label: string;
  value: string;
  icon?: string;
}

interface SMSelectDropDownProps {
  options?: OptionType[];
  varient?: "simple" | "custom";
  onChange?: (value: OptionType) => void;
  selectWidth?: string;
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
  defaultInputValue?: OptionType;
  value?: OptionType;
  searchable?: boolean;
  id?: string;
  width?: string;
  isError?: boolean;
  errorText?: string;
  field?: any;
  isMulti?: boolean;
  name?: string;
}

const selectStyles = ({ isError }: { isError: boolean }) => ({
  input: (styles: any) => ({
    ...styles,
    "&:not(.aui-no-focusvisible) :focus-visible": {
      boxShadow: "none",
      border: "none",
    },
  }),
  menu: (provided: any) => ({
    ...provided,
    overflowY: "auto",
    scrollbarColor: "transparent",
    scrollbarWidth: "thin",
    "&::-webkit-scrollbar": {
      width: "7px",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "transparent !important",
      borderRadius: "2.5px",
      height: "50px",
    },
    "&::-webkit-scrollbar-track": {
      background: "transparent !important",
      borderBottomRightRadius: "16px",
    },
    "&::-webkit-scrollbar-thumb, &::-webkit-scrollbar-track": {
      background: "transparent",
    },
  }),
  control: (
    styles: any,
    { isDisabled, isFocused }: { isDisabled: boolean; isFocused: boolean },
  ) => ({
    ...styles,
    borderRadius: "4px",
    outline: "none",
    cursor: "pointer",
    border: `1px solid ${isError ? "red" : "#dfe1e6"}`,
    minHeight: "40px",
    width: "100%",
    color: isDisabled ? "#97a0af" : "#97a0af",
    backgroundColor: isDisabled ? "#f4f5f7" : "#ffffff",
    "&:hover": {
      border: isFocused
        ? "1px solid #0052CC"
        : isError
          ? "1px solid red"
          : "1px solid #dfe1e6",
    },
  }),
  option: (
    styles: any,
    {
      isDisabled,
      isSelected,
    }: { isDisabled: boolean; isFocused: boolean; isSelected: boolean },
  ) => ({
    ...styles,
    fontSize: "14px",
    fontWeight: 400,
    lineHeight: "20px",
    cursor: "pointer",
    color: isDisabled ? "#97a0af" : "#172B4D",
    backgroundColor: isDisabled
      ? "#f4f5f7"
      : isSelected
        ? "#EBECF0"
        : "#ffffff",
    "&:hover": {
      backgroundColor: isSelected ? "#EBECF0" : "#DFE1E6",
    },
  }),
  placeholder: (styles: any) => ({
    ...styles,
    fontSize: "14px",
    fontWeight: 400,
    lineHeight: "20px",
    color: "#97a0af",
  }),
  valueContainer: (styles: any) => ({
    ...styles,
    borderLeft: "none",
    fontSize: "14px",
    minHeight: "40px",
  }),
  indicatorSeparator: (styles: any) => ({
    ...styles,
    display: "none",
    fontSize: "14px",
  }),
  dropdownIndicator: (styles: any) => ({
    ...styles,
    color: "#42526E",
    fontSize: "14px",
  }),
  autosizeInput: (styles: any) => ({
    ...styles,
    "&:not(.aui-no-focusvisible) :focus-visible": {
      boxShadow: "none",
    },
  }),
});

export const SMSelectDropDown = forwardRef<any, SMSelectDropDownProps>(
  (
    {
      options = [
        { label: "Un-appraised", value: "Un-appraised" },
        { label: "In-progress", value: "In-progress" },
        { label: "completed", value: "completed" },
      ],
      varient = "simple",
      onChange = () => {},
      placeholder,
      disabled,
      loading,
      defaultInputValue,
      value,
      searchable,
      id,
      width,
      name,
      isError = false,
      errorText = "",
      field,
      isMulti = false,
    },
    ref,
  ) => {
    const handleChange = async (value: OptionType) => {
      const awaitedValue = await value;
      onChange(awaitedValue);
    };

    const customOption = (props: OptionProps<OptionType>) => (
      <components.Option {...props}>
        <div className="flex items-center gap-1">
          {props.data.icon && (
            <Image
              src={props.data.icon}
              alt="icon"
              className="mr-2 object-contain"
              height={18}
              width={18}
            />
          )}
          <span className="whitespace-nowrap">{props.data.label}</span>
        </div>
      </components.Option>
    );

    const customSingleValue = (props: SingleValueProps<OptionType>) => (
      <div className="flex items-center gap-1">
        {props.data.icon && (
          <Image
            src={props.data.icon}
            alt="icon"
            className="object-contain"
            height={18}
            width={18}
          />
        )}
        <span className="whitespace-nowrap">{props.data.label}</span>
      </div>
    );

    return (
      <div className={`flex flex-col ${width ? `w-${width}` : "w-full"}`}>
        <Select
          ref={ref}
          options={options}
          onChange={handleChange}
          placeholder={placeholder}
          isDisabled={disabled}
          isLoading={loading}
          value={value}
          defaultValue={defaultInputValue}
          isSearchable={searchable}
          id={id}
          isMulti={isMulti}
          styles={selectStyles({ isError })}
          name={name}
          components={
            varient === "simple"
              ? {}
              : { Option: customOption, SingleValue: customSingleValue }
          }
          {...field}
        />
        {errorText.length > 0 && (
          <ValidationText status="error" message={errorText} />
        )}
      </div>
    );
  },
);

SMSelectDropDown.displayName = "SMSelectDropDown";
