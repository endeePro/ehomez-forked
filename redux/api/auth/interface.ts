export interface IVerifyUserPayload {
  email: string;
}

export interface IForgotPasswordResPayload {
  emailAddress: string;
}
export interface ILoginPayload {
  emailAddress: string;
  password: string;
}

export interface IResetPasswordPayload {
  token: string;
  email: string;
  password: string;
  confirmPassword: string;
}
export interface IChangePasswordPayload {
  userId: string;
  oldPassword: string;
  newPassword: string;
}

export interface IVerifyUserResponse {
  email: string;
  fullName: string;
  passport: string | null;
}

export interface ILoginUserResponse {
  token: string;
  refreshToken: string;
  has2FAEnabled: boolean;
  expiration: string;
  userType: number;
  roles: string[];
  permissions: string[];
}

export interface IUser {
  userId: string;
  emailAddress: string;
  name: string;
  firstName: string;
  lastName: string;
  middleName: string;
  phoneNumber: string;
  address: string;
  verified: boolean;
  permissions: string[];
  roles: string[];
}
