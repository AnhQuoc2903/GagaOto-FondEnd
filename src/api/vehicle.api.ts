/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "./axios";

export const getVehicles = () => axios.get("/vehicles");

export const createVehicle = (data: {
  customer: string;
  plate: string;
  brand?: string;
  model?: string;
  year?: number;
}) => axios.post("/vehicles", data);

export const updateVehicle = (id: string, data: any) =>
  axios.put(`/vehicles/${id}`, data);

export const deleteVehicle = (id: string) => axios.delete(`/vehicles/${id}`);
