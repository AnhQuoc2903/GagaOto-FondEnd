/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, Spin, message, Divider } from "antd";
import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { getCustomerById, getCustomerDebt } from "../../api/customer.api";

const formatVND = (n: number) =>
  new Intl.NumberFormat("vi-VN").format(n) + " ₫";

export default function CustomerDetail() {
  const { id } = useParams();

  const [data, setData] = useState<any>(null);
  const [debt, setDebt] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!id) return;

    setLoading(true);
    try {
      const [customerRes, debtRes] = await Promise.all([
        getCustomerById(id),
        getCustomerDebt(id),
      ]);

      setData(customerRes.data);
      setDebt(debtRes.data);
    } catch {
      message.error("Load failed");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Spin />
      </div>
    );
  }

  if (!data) return <p>Không có dữ liệu</p>;

  return (
    <>
      {/* CUSTOMER INFO */}
      <Card title="Customer Detail">
        <p>
          <b>Name:</b> {data.name}
        </p>
        <p>
          <b>Phone:</b> {data.phone}
        </p>
        <p>
          <b>Address:</b> {data.address}
        </p>
        <p>
          <b>Note:</b> {data.note}
        </p>
      </Card>

      {/* DEBT SUMMARY */}
      {debt && (
        <Card title="Công nợ khách" style={{ marginTop: 20 }}>
          <p>
            <b>Tổng tiền:</b> {formatVND(debt.total)}
          </p>
          <p>
            <b>Đã trả:</b> {formatVND(debt.paid)}
          </p>
          <p>
            <b>Còn nợ:</b>{" "}
            <span style={{ color: "red", fontWeight: "bold" }}>
              {formatVND(debt.remaining)}
            </span>
          </p>

          <Divider />

          <h4>Các lệnh đang nợ</h4>

          {debt.details.length === 0 && <p>Không còn nợ</p>}

          {debt.details.map((d: any) => (
            <Card key={d._id} size="small" style={{ marginBottom: 10 }}>
              <p>🚗 Xe: {d.vehicle}</p>
              <p>💰 Tổng: {formatVND(d.total)}</p>
              <p>✅ Đã trả: {formatVND(d.paid)}</p>
              <p style={{ color: "red" }}>
                ❗ Còn nợ: {formatVND(d.remaining)}
              </p>
            </Card>
          ))}
        </Card>
      )}
    </>
  );
}
