export type UserRole = "SUPER_ADMIN" | "ADMIN" | "USER";

export interface IUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date;
}

export interface ILoginResponse {
  data: IUser;
  token?: string;
  message?: string;
}
