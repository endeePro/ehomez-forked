import * as Yup from "yup";

const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

export const getPasswordValidationSchema = () =>
  Yup.string()
    .required("Password is required")
    .test(
      "uppercase",
      "Password must contain at least one uppercase letter",
      (value) => /[A-Z]/.test(value),
    )
    .test("number", "Password must contain at least one number", (value) =>
      /\d/.test(value),
    )
    .test(
      "special",
      "Password must contain at least one special character (@$!%*#?&)",
      (value) => /[@$!%*#?_&]/.test(value),
    )
    .min(6, "Password must be at least 8 characters long");

export const getPasswordConfirmationSchema = () =>
  Yup.string()
    .oneOf([Yup.ref("password"), " "], "Passwords must match")
    .required("Confirm Password is required");

export const getEmailValidationSchema = () =>
  Yup.string().email("Invalid email address").required("Email is required");

export const getNameValidationSchema = (field: string) =>
  Yup.string().required(`Please enter your ${field} name.`);

export const getEmailOrPhoneNumberValidationSchema = () =>
  Yup.string()
    .required(`Please enter your phonenumber or email`)
    .test(
      "email-or-phone-number",
      "Invalid email or phone number",
      function (value) {
        // If the value contains "@" or a-z, validate it as an email address
        if (value.includes("@") || /[a-zA-Z]/.test(value)) {
          return (
            emailRegex.test(value) ||
            this.createError({
              message: "Invalid email format: mariaokon@gmail.com",
            })
          );
        } else {
          // Validate it as a phone number
          const pN = value?.trim();

          const startWithZero = pN?.startsWith("0");
          if (startWithZero && /^(\d\d{10})$/.test(pN as string)) {
            return true;
          } else if (startWithZero && !/^(\d\d{10})$/.test(pN as string)) {
            return this.createError({
              message: "Use a valid phone format: 090 754 193 60",
            });
          } else if (!startWithZero && /^(\d\d{9})$/.test(pN as string)) {
            return true;
          }
          return this.createError({
            message: "Use a valid phone format: 90 754 193 60",
          });
        }
      },
    );
