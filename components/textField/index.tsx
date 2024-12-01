"use client";

import React, { ForwardedRef, Ref, useState } from "react";
import { PassLock } from "@/assets/svgs";
import { cn } from "@/utils/helpers";
import clsx from "clsx";
import {
  FieldValues,
  InternalFieldName,
  Path,
  UseFormRegisterReturn,
} from "react-hook-form";

import { Typography } from "../typography";
import { ValidationText } from "../validationText";
import { ITextFieldProps } from "./types";

const TextFieldComponent = <FV extends FieldValues>(
  props: ITextFieldProps<FV>,
  ref?: ForwardedRef<HTMLInputElement>,
) => {
  const {
    type = "text",
    inputType = "input",
    error = false,
    errorText = "",
    placeholder,
    icon = null,
    name,
    className,
    label,
    register,
    flexStyle = "col",
    ...rest
  } = props;

  // React hook form register
  const registerInput: UseFormRegisterReturn<Path<FV>> | object = register
    ? register(name, { required: rest.required })
    : {};

  const [showPassword, setShowPassword] = useState(false);

  const classes = cn(
    className,
    `block w-full font-brCobane h-[44px] text-sm bg-N0 text-N700 placeholder:text-N80 border rounded py-2 px-3 focus:border-GLH focus:border-2 disabled:cursor-not-allowed disabled:bg-N20 disabled:text-N70`,
    error ? "border-R400 border-2" : "border-N40",
  ); //generic styles for input

  const passwordClasses = clsx(
    `grow focus:outline-none font-brCobane`,
    className,
  ); //special styles for password input

  const iconInputsClasses = clsx(
    `grow focus:outline-none font-brCobane h-[50px]`,
    className,
  ); //special; styles for icon inputs

  const renderInput = () => {
    if (!icon) {
      //If TextField isn't expecting an icon
      return (
        <div
          className={`${flexStyle === "row" && "font-brCobane md:grid md:grid-cols-12 md:items-center"}`}
        >
          {label && label.toString().length > 0 && (
            <Typography
              variant="h-s"
              fontWeight="medium"
              color={"N700"}
              className={`${flexStyle === "row" ? "mb-2 md:col-span-3 md:mb-0" : "mb-2"} cursor-pointer`}
            >
              <label htmlFor={name}>{label}</label>
            </Typography>
          )}
          <div className={`${flexStyle === "row" && "col-span-9"}`}>
            <input
              className={classes}
              id={name}
              type={type}
              placeholder={placeholder}
              {...rest}
              ref={ref}
              {...registerInput}
            />
            {errorText.length > 0 && (
              <ValidationText
                message={errorText}
                status={error ? "error" : "success"}
              />
            )}
          </div>
        </div>
      );
    } else {
      //If Textfield is expecting an icon
      return (
        <div>
          {label && label.toString().length > 0 && (
            <Typography
              variant="h-s"
              fontWeight="medium"
              color={"N700"}
              className={`${flexStyle === "row" ? "col-span-3" : "mb-2"} cursor-pointer`}
            >
              <label htmlFor={name}>{label}</label>
            </Typography>
          )}
          <div
            className={`mb-2 flex w-full items-center justify-normal rounded border px-3 py-2 font-brCobane focus-within:border-2 focus-within:border-GBA ${error ? "border-2 border-R400" : "border-N40"}`}
          >
            <input
              className={iconInputsClasses}
              type={type}
              id={name}
              placeholder={placeholder}
              ref={ref}
              {...rest}
              {...registerInput}
            />
            <span className="cursor-pointer">{icon}</span>
          </div>
        </div>
      );
    }
  };
  return (
    <div>
      {inputType === "input" ? (
        type === "password" ? (
          <div>
            {label && label.toString().length > 0 && (
              <Typography
                variant="h-s"
                fontWeight="medium"
                color={"N700"}
                className={`${flexStyle === "row" ? "col-span-3" : "mb-2"} cursor-pointer`}
              >
                <label htmlFor={name}>{label}</label>
              </Typography>
            )}
            <div
              className={`mb-2 flex w-full items-center justify-normal rounded border px-3 py-2 font-brCobane focus-within:border-2 focus-within:border-GBA ${error ? "border-2 border-R400" : "border-N40"}`}
            >
              <input
                className={passwordClasses}
                id={name}
                type={showPassword ? "text" : type}
                placeholder={placeholder}
                ref={ref}
                {...rest}
                {...registerInput}
              />
              <span
                className="cursor-pointer"
                onClick={() => {
                  setShowPassword(!showPassword);
                }}
              >
                <PassLock />
              </span>
            </div>
          </div>
        ) : (
          renderInput()
        )
      ) : inputType === "textarea" ? (
        <div
          className={`${flexStyle === "row" && "font-brCobane md:grid md:grid-cols-12 md:items-start"}`}
        >
          {label && label.toString().length > 0 && (
            <Typography
              variant="h-s"
              fontWeight="medium"
              color={"N700"}
              className={`${flexStyle === "row" ? "col-span-4" : "mb-2"} cursor-pointer`}
            >
              <label htmlFor={name}>{label}</label>
            </Typography>
          )}
          <div className={`${flexStyle === "row" && "col-span-8"}`}>
            <textarea
              id={name}
              className={classes}
              placeholder={placeholder}
              rows={8}
              ref={ref as Ref<HTMLTextAreaElement>}
              {...(rest as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
              {...registerInput}
            />
            {errorText.length > 0 && (
              <ValidationText
                message={errorText}
                status={error ? "error" : "success"}
              />
            )}
          </div>
        </div>
      ) : inputType === "searchable" ? (
        <div className="">
          <input
            className={classes}
            type={type}
            placeholder={placeholder}
            ref={ref}
            {...rest}
            {...registerInput}
          />
        </div>
      ) : null}
    </div>
  );
};

export type InputComponentType = <
  FV extends FieldValues,
  TFieldName extends InternalFieldName,
>(
  props: ITextFieldProps<FV> & {
    ref?:
      | React.ForwardedRef<HTMLInputElement>
      | UseFormRegisterReturn<TFieldName>;
  },
) => ReturnType<typeof TextFieldComponent>;

const TextField = React.forwardRef(TextFieldComponent) as InputComponentType;
export { TextField };
export * from "./types";
