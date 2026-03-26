/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, Row, Col, message } from "antd";
import { useEffect, useState } from "react";
import { getDashboard } from "../../api/report.api";

export default function DashboardPage() {
  const [data, setData] = useState<any>({
    totalOrders: 0,
    done: 0,
    pending: 0,
  });

  const load = async () => {
    try {
      const res = await getDashboard();
      setData(res.data);
    } catch {
      message.error("Load dashboard failed");
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl mb-4 font-semibold">Dashboard</h2>

      <Row gutter={16}>
        <Col span={8}>
          <Card title="Total Orders">
            <h1>{data.totalOrders}</h1>
          </Card>
        </Col>

        <Col span={8}>
          <Card title="Done">
            <h1 style={{ color: "green" }}>{data.done}</h1>
          </Card>
        </Col>

        <Col span={8}>
          <Card title="Pending">
            <h1 style={{ color: "orange" }}>{data.pending}</h1>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
