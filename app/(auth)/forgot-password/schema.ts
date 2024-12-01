import * as Yup from "yup";

import { getEmailValidationSchema } from "../authGlobalSchema";

export const forgotPasswordSchema = Yup.object().shape({
  emailAddress: getEmailValidationSchema(),
});

export type IForgotPasswordSchema = Yup.InferType<typeof forgotPasswordSchema>;
