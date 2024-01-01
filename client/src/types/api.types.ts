export type RegisterData = {
  userName: string;
  login: string;
  password: string;
  birthdate?: string;
};

export type LoginData = {
  login: string;
  password: string;
};

export enum Role {
  ADMIN = "admin",
  STUDENT = "student",
  ANONIM = "anonim",
}

export type User = {
  userName: string;
  userId: string;
  role: Role;
};
