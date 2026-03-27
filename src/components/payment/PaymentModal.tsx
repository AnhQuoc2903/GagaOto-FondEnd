/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
import { Modal, InputNumber, Select, Input } from "antd";
import { useState, useEffect } from "react";

export default function PaymentModal({ open, onCancel, onOk, remaining }: any) {
  const [form, setForm] = useState({
    amount: 0,
    method: "CASH",
    note: "",
  });

  useEffect(() => {
    if (open) {
      setForm({
        amount: Math.max(Number(remaining || 0), 0),
        method: "CASH",
        note: "",
      });
    }
  }, [open, remaining]);

  return (
    <Modal
      title="Thanh toán"
      open={open}
      onOk={() => onOk(form)}
      onCancel={onCancel}
      okText="Xác nhận"
    >
      <p style={{ marginBottom: 8 }}>
        Còn nợ: <b>{new Intl.NumberFormat("vi-VN").format(remaining)} ₫</b>
      </p>
      <InputNumber
        style={{ width: "100%", marginBottom: 10 }}
        placeholder={`Nhập số tiền (tối đa ${remaining})`}
        value={form.amount}
        onChange={(v) => setForm({ ...form, amount: Number(v) || 0 })}
      />

      <Select
        style={{ width: "100%", marginBottom: 10 }}
        value={form.method}
        onChange={(v) => setForm({ ...form, method: v })}
      >
        <Select.Option value="CASH">Tiền mặt</Select.Option>
        <Select.Option value="BANK">Chuyển khoản</Select.Option>
      </Select>

      <Input
        placeholder="Ghi chú"
        value={form.note}
        onChange={(e) => setForm({ ...form, note: e.target.value })}
      />
    </Modal>
  );
}
