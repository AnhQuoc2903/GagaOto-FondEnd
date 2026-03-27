import axios from "./axios";

export const createPayment = (data: {
  workOrderId: string;
  amount: number;
  method: "CASH" | "BANK";
  note?: string;
}) => axios.post("/payments", data);

export const getPayments = (workOrderId: string) =>
  axios.get(`/payments/${workOrderId}`);
