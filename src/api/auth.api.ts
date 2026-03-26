/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "./axios";

export const loginAPI = (data: { email: string; password: string }) =>
  axios.post("/auth/login", data);

export const registerAPI = (data: any) => axios.post("/auth/register", data);

export const getMe = () => axios.get("/auth/me");
