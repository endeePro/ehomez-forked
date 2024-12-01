import * as yup from "yup";

import {
  getEmailValidationSchema,
  getPasswordValidationSchema,
} from "./(auth)/authGlobalSchema";

export const LoginSchema = yup.object().shape({
  emailAddress: getEmailValidationSchema(),
  password: getPasswordValidationSchema(),
});

export type ILoginSchema = yup.InferType<typeof LoginSchema>;
