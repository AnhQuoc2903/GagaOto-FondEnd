import axios from "./axios";

export const getWorkOrders = () => axios.get("/work-orders");

export const createWorkOrder = (data: {
  customer: string;
  vehicle: string;
  technician?: string;
  description?: string;
  priority?: "LOW" | "MEDIUM" | "HIGH";
  deadline?: string;
}) => axios.post("/work-orders", data);

// STATUS
export const updateWorkOrderStatus = (id: string, status: string) =>
  axios.put(`/work-orders/${id}/status`, { status });

// CANCEL
export const cancelWorkOrder = (id: string) =>
  axios.put(`/work-orders/${id}/cancel`);

// ASSIGN
export const assignWorkOrder = (id: string, technician: string) =>
  axios.put(`/work-orders/${id}/assign`, { technician });

// 🔥 ADD PART
export const addPartToWorkOrder = (
  id: string,
  data: { inventory: string; quantity: number },
) => axios.post(`/work-orders/${id}/parts`, data);

// 🔥 REMOVE PART
export const removePartFromWorkOrder = (id: string, partId: string) =>
  axios.delete(`/work-orders/${id}/parts/${partId}`);

export const exportInvoice = (id: string) =>
  axios.get(`/work-orders/${id}/invoice`, {
    responseType: "blob",
  });

export const getWorkOrderById = (id: string) => axios.get(`/work-orders/${id}`);
