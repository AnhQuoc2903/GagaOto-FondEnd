/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "./axios";

export const getUsers = (params?: any) => axios.get("/users", { params });

export const createUser = (data: {
  name: string;
  email: string;
  password: string;
  role: "ADMIN" | "MANAGER" | "TECHNICIAN";
}) => axios.post("/users", data);

// 🔥 NEW
export const updateUser = (id: string, data: any) =>
  axios.put(`/users/${id}`, data);

export const toggleUser = (id: string) =>
  axios.put(`/users/${id}/toggle-active`);
