import * as Yup from "yup";

import {
  getPasswordConfirmationSchema,
  getPasswordValidationSchema,
} from "@/app/(auth)/authGlobalSchema";

export const changePasswordSchema = Yup.object().shape({
  oldPassword: getPasswordValidationSchema(),
  password: getPasswordValidationSchema(),
  confirmPassword: getPasswordConfirmationSchema(),
});

export type IChangePasswordSchema = Yup.InferType<typeof changePasswordSchema>;
