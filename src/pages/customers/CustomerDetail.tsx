/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, Spin, message } from "antd";
import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { getCustomerById } from "../../api/customer.api";

export default function CustomerDetail() {
  const { id } = useParams();

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!id) return;

    setLoading(true);
    try {
      const res = await getCustomerById(id);
      setData(res.data);
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

  if (!data) {
    return <p>Không có dữ liệu</p>;
  }

  return (
    <Card title="Customer Detail">
      <p>
        <b>Name:</b> {data.name || "-"}
      </p>
      <p>
        <b>Phone:</b> {data.phone || "-"}
      </p>
      <p>
        <b>Address:</b> {data.address || "-"}
      </p>
      <p>
        <b>Note:</b> {data.note || "-"}
      </p>
    </Card>
  );
}
