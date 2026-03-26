/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "./axios";

export const getCustomers = (params?: any) =>
  axios.get("/customers", { params });

export const getCustomerById = (id: string) => axios.get(`/customers/${id}`);

export const createCustomer = (data: {
  name: string;
  phone: string;
  address?: string;
  note?: string;
}) => axios.post("/customers", data);

export const updateCustomer = (id: string, data: any) =>
  axios.put(`/customers/${id}`, data);

export const deleteCustomer = (id: string) => axios.delete(`/customers/${id}`);
