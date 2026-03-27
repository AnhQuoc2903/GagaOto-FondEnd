/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Card, message, Tag } from "antd";
import { useEffect, useState } from "react";
import { createPayment, getPayments } from "../../api/payment.api";
import PaymentModal from "./PaymentModal";

const formatVND = (n: number) =>
  new Intl.NumberFormat("vi-VN").format(n) + " ₫";

export default function PaymentSection({ order, reload }: any) {
  const [payments, setPayments] = useState<any[]>([]);
  const [open, setOpen] = useState(false);

  const loadPayments = async () => {
    const res = await getPayments(order._id);
    setPayments(res.data);
  };

  useEffect(() => {
    if (order?._id) loadPayments();
  }, [order]);

  const handlePay = async (data: any) => {
    try {
      await createPayment({
        ...data,
        workOrderId: order._id,
      });

      message.success("Ghi nhận thanh toán thành công");
      setOpen(false);

      await loadPayments();

      if (reload) {
        await reload();
      }
    } catch (err: any) {
      message.error(err.response?.data?.message || "Error");
    }
  };

  const remaining = (order.total || 0) - (order.paidAmount || 0);

  // 🔥 TÍNH THEO PHƯƠNG THỨC
  const cashTotal = payments
    .filter((p) => p.method === "CASH")
    .reduce((sum, p) => sum + p.amount, 0);

  const bankTotal = payments
    .filter((p) => p.method === "BANK")
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <Card title="Thông tin thanh toán" style={{ marginTop: 20 }}>
      {/* SUMMARY */}
      <p>Tổng tiền cần thanh toán : {formatVND(order.total || 0)}</p>
      <p>Đã thu: {formatVND(order.paidAmount || 0)}</p>
      <p>
        Còn nợ: <b>{formatVND(remaining)}</b>
      </p>

      <Tag
        color={
          order.paymentStatus === "PAID"
            ? "green"
            : order.paymentStatus === "PARTIAL"
              ? "orange"
              : "red"
        }
      >
        {order.paymentStatus}
      </Tag>

      {/* BUTTON */}
      <div style={{ marginTop: 10 }}>
        <Button
          type="primary"
          onClick={async () => {
            if (reload) {
              await reload(); // 🔥 reload data mới nhất
            }
            setOpen(true);
          }}
          disabled={remaining <= 0}
        >
          Ghi nhận thanh toán
        </Button>
      </div>

      {/* TOTAL BY METHOD */}
      <div style={{ marginTop: 15 }}>
        <p>💵 Tiền mặt: {formatVND(cashTotal)}</p>
        <p>🏦 Chuyển khoản: {formatVND(bankTotal)}</p>
      </div>

      {/* LIST */}
      <h4 style={{ marginTop: 20 }}>Lịch sử thanh toán</h4>

      {payments.length === 0 && <p>Chưa có thanh toán</p>}

      {payments.map((p) => (
        <div key={p._id} style={{ marginBottom: 10 }}>
          <div>
            💰 {formatVND(p.amount)} (
            {p.method === "CASH" ? "Tiền mặt" : "Chuyển khoản"})
          </div>

          <div style={{ fontSize: 12, color: "#888" }}>
            🕒 {new Date(p.createdAt).toLocaleString()}
          </div>

          <div style={{ fontSize: 12, color: "#888" }}>
            👤 {p.createdBy?.name || ""}
          </div>
        </div>
      ))}

      {/* MODAL */}
      <PaymentModal
        open={open}
        onCancel={() => setOpen(false)}
        onOk={handlePay}
        remaining={remaining}
      />
    </Card>
  );
}
