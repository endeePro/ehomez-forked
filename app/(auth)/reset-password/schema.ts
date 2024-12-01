import * as Yup from "yup";

import {
  getPasswordConfirmationSchema,
  getPasswordValidationSchema,
} from "../authGlobalSchema";

export const resetPasswordSchema = Yup.object().shape({
  password: getPasswordValidationSchema(),
  confirmPassword: getPasswordConfirmationSchema(),
});

export type IResetPasswordSchema = Yup.InferType<typeof resetPasswordSchema>;
