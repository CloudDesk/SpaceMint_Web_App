export type CustomerUser = {
  authprovider?: string;
  emailverified?: boolean;
  firstname?: string;
  gender?: string;
  gstnumber?: string;
  id: number;
  isbusinessuser?: boolean;
  lastname?: string;
  useremail?: string;
  usermobilenumber?: number;
  userType?: "ecommerce";
};

export type AuthSession = {
  expiresIn: number;
  refreshToken: string;
  token: string;
  user: CustomerUser;
};

export type AuthIntent = "checkout" | "profile";

export type RegisterInput = {
  firstname?: string;
  lastname?: string;
  useremail: string;
  userpassword: string;
};

export type PasswordLoginInput = {
  username: string;
  userpassword: string;
};

export type UpdateProfileInput = {
  firstname?: string;
  gender?: string;
  gstnumber?: string;
  isbusinessuser?: boolean;
  lastname?: string;
  useremail?: string;
  usermobilenumber?: number;
};
