/* eslint-disable @typescript-eslint/no-explicit-any */
import { Drawer, Descriptions, Tag, Table, Timeline, message } from "antd";
import { useEffect, useState } from "react";
import { formatVND } from "../../utils/format";
import PaymentSection from "../../components/payment/paymentSection";
import { getWorkOrderById } from "../../api/workOrder.api";

interface WorkOrderDetailDrawerProps {
  open: boolean;
  onClose: () => void;
  workOrder: any;
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "HIGH":
      return "red";
    case "MEDIUM":
      return "orange";
    case "LOW":
      return "green";
    default:
      return "blue";
  }
};

const getStatusColor = (status: string) => {
  if (status === "DONE") return "green";
  if (status === "IN_PROGRESS") return "blue";
  if (status === "CANCELLED") return "red";
  return "orange";
};

export default function WorkOrderDetailDrawer({
  open,
  onClose,
  workOrder,
}: WorkOrderDetailDrawerProps) {
  const [order, setOrder] = useState<any>(workOrder);

  // 👉 reload work order từ server
  const loadWorkOrder = async () => {
    try {
      if (!order?._id) return;

      const res = await getWorkOrderById(order._id);
      setOrder(res.data);
    } catch {
      message.error("Load work order failed");
    }
  };

  useEffect(() => {
    setOrder(workOrder);
  }, [workOrder]);

  if (!order) return null;

  return (
    <Drawer
      title="Work Order Details"
      placement="right"
      width={500}
      onClose={onClose}
      open={open}
    >
      <div>
        {/* ================= INFO ================= */}
        <Descriptions column={1} bordered>
          <Descriptions.Item label="Customer">
            {order.customer?.name || "-"}
          </Descriptions.Item>

          <Descriptions.Item label="Phone">
            {order.customer?.phone || "-"}
          </Descriptions.Item>

          <Descriptions.Item label="Vehicle">
            {order.vehicle?.plate || "-"} - {order.vehicle?.model || ""}
          </Descriptions.Item>

          <Descriptions.Item label="Description">
            {order.description || "-"}
          </Descriptions.Item>

          <Descriptions.Item label="Priority">
            <Tag color={getPriorityColor(order.priority)}>
              {order.priority || "MEDIUM"}
            </Tag>
          </Descriptions.Item>

          <Descriptions.Item label="Deadline">
            {order.deadline ? (
              <span>
                {new Date(order.deadline).toLocaleString()}
                {new Date(order.deadline) < new Date() && (
                  <Tag color="red" style={{ marginLeft: 8 }}>
                    Overdue
                  </Tag>
                )}
              </span>
            ) : (
              "-"
            )}
          </Descriptions.Item>

          <Descriptions.Item label="Technician">
            {order.technician?.name || "Not assigned"}
          </Descriptions.Item>

          <Descriptions.Item label="Status">
            <Tag color={getStatusColor(order.status)}>{order.status}</Tag>
          </Descriptions.Item>

          <Descriptions.Item label="Labor Cost">
            {formatVND(order.laborCost || 0)}
          </Descriptions.Item>

          <Descriptions.Item label="Parts Total">
            {formatVND(order.partsTotal || 0)}
          </Descriptions.Item>

          <Descriptions.Item label="Total Cost">
            <strong>{formatVND(order.total || 0)}</strong>
          </Descriptions.Item>
        </Descriptions>

        {/* ================= PARTS ================= */}
        <div style={{ marginTop: 24 }}>
          <h3 style={{ marginBottom: 16 }}>Used Parts</h3>

          {order.usedParts?.length > 0 ? (
            <Table
              dataSource={order.usedParts}
              rowKey="_id"
              pagination={false}
              size="small"
              columns={[
                {
                  title: "Part Name",
                  render: (_, record: any) => record.inventory?.name || "-",
                },
                {
                  title: "Quantity",
                  dataIndex: "quantity",
                },
                {
                  title: "Unit Price",
                  render: (_, record: any) =>
                    formatVND(record.inventory?.price || 0),
                },
                {
                  title: "Subtotal",
                  render: (_, record: any) =>
                    formatVND(
                      (record.inventory?.price || 0) * (record.quantity || 0),
                    ),
                },
              ]}
            />
          ) : (
            <p style={{ color: "#999" }}>No parts used</p>
          )}
        </div>

        {/* ================= HISTORY ================= */}
        <div style={{ marginTop: 24 }}>
          <h3 style={{ marginBottom: 16 }}>History Timeline</h3>

          {order.history?.length > 0 ? (
            <Timeline>
              {order.history.map((h: any, index: number) => (
                <Timeline.Item key={index}>
                  <div>
                    <strong>{h.action}</strong>
                    <div style={{ fontSize: 12 }}>
                      By: {h.user?.name || "System"}
                    </div>
                    <div style={{ fontSize: 12 }}>
                      {new Date(h.time).toLocaleString()}
                    </div>
                    {h.details && <div>Details: {h.details}</div>}
                  </div>
                </Timeline.Item>
              ))}
            </Timeline>
          ) : (
            <p style={{ color: "#999" }}>No history</p>
          )}
        </div>

        {/* ================= PAYMENT (🔥 QUAN TRỌNG) ================= */}
        <div style={{ marginTop: 24 }}>
          <PaymentSection order={order} reload={loadWorkOrder} />
        </div>
      </div>
    </Drawer>
  );
}
