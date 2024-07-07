export type User = {
  name: string;
  slug: string;
  email: string;
  role: "user" | "admin";
  phone?: string;
  bio?: string;
  profileImage?: string;
  createdAt?: Date;
  updatedAt?: Date;
};
