import axios from "./axios";

export interface InventoryPayload {
  name?: string;
  quantity?: number;
  price?: number;
  minStock?: number;
}

export const getInventory = () => axios.get("/inventory");

export const createInventory = (data: InventoryPayload) =>
  axios.post("/inventory", data);

export const updateInventory = (id: string, data: InventoryPayload) =>
  axios.put(`/inventory/${id}`, data);

export const deleteInventory = (id: string) => axios.delete(`/inventory/${id}`);

export const importStock = (id: string, data: { quantity: number }) =>
  axios.post(`/inventory/${id}/import`, data);

export const exportStock = (id: string, data: { quantity: number }) =>
  axios.post(`/inventory/${id}/export`, data);

export const adjustStock = (id: string, data: { quantity: number }) =>
  axios.post(`/inventory/${id}/adjust`, data);

export const getInventoryLogs = () => axios.get("/inventory/logs");

export const getLowStock = () => axios.get("/inventory/low-stock");
