/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "./axios";

// GET ALL
export const getQuotations = (params?: any) =>
  axios.get("/quotations", { params });

// CREATE
export const createQuotation = (data: any) => axios.post("/quotations", data);

export const updateQuotation = (id: string, data: any) =>
  axios.put(`/quotations/${id}`, data);

// APPROVE
export const approveQuotation = (id: string) =>
  axios.put(`/quotations/${id}/approve`);

// REJECT
export const rejectQuotation = (id: string) =>
  axios.put(`/quotations/${id}/reject`);

export const exportQuotationPDF = (id: string) =>
  axios.get(`/quotations/${id}/pdf`, {
    responseType: "blob",
  });
