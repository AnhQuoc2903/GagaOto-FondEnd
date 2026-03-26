/* eslint-disable @typescript-eslint/no-explicit-any */
import { Drawer, Descriptions, Tag, Table, Timeline } from "antd";

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
  if (!workOrder) return null;

  return (
    <Drawer
      title="Work Order Details"
      placement="right"
      width={500}
      onClose={onClose}
      open={open}
    >
      <div>
        <Descriptions column={1} bordered>
          <Descriptions.Item label="Customer">
            {workOrder.customer?.name || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Phone">
            {workOrder.customer?.phone || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Vehicle">
            {workOrder.vehicle?.plate || "-"} - {workOrder.vehicle?.model || ""}
          </Descriptions.Item>
          <Descriptions.Item label="Description">
            {workOrder.description || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Priority">
            <Tag color={getPriorityColor(workOrder.priority)}>
              {workOrder.priority || "MEDIUM"}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Deadline">
            {workOrder.deadline ? (
              <span>
                {new Date(workOrder.deadline).toLocaleString()}
                {new Date(workOrder.deadline) < new Date() && (
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
            {workOrder.technician?.name || "Not assigned"}
          </Descriptions.Item>
          <Descriptions.Item label="Status">
            <Tag color={getStatusColor(workOrder.status)}>
              {workOrder.status}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Labor Cost">
            ${workOrder.laborCost?.toFixed(2) || "0.00"}
          </Descriptions.Item>
          <Descriptions.Item label="Parts Total">
            ${workOrder.partsTotal?.toFixed(2) || "0.00"}
          </Descriptions.Item>
          <Descriptions.Item label="Total Cost">
            <strong>${workOrder.total?.toFixed(2) || "0.00"}</strong>
          </Descriptions.Item>
        </Descriptions>

        <div style={{ marginTop: 24 }}>
          <h3 style={{ marginBottom: 16 }}>Used Parts</h3>
          {workOrder.usedParts?.length > 0 ? (
            <Table
              dataSource={workOrder.usedParts}
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
                    `$${record.inventory?.price?.toFixed(2) || "0.00"}`,
                },
                {
                  title: "Subtotal",
                  render: (_, record: any) =>
                    `$${((record.inventory?.price || 0) * record.quantity).toFixed(2)}`,
                },
              ]}
            />
          ) : (
            <p style={{ color: "#999", fontStyle: "italic" }}>No parts used</p>
          )}
        </div>

        <div style={{ marginTop: 24 }}>
          <h3 style={{ marginBottom: 16 }}>History Timeline</h3>
          {workOrder.history?.length > 0 ? (
            <Timeline>
              {workOrder.history.map((h: any, index: number) => (
                <Timeline.Item key={index}>
                  <div>
                    <strong>{h.action}</strong>
                    <div style={{ fontSize: 12, color: "#888" }}>
                      By: {h.user?.name || "System"}
                    </div>
                    <div style={{ fontSize: 12, color: "#888" }}>
                      Time: {new Date(h.time).toLocaleString()}
                    </div>
                    {h.details && (
                      <div style={{ fontSize: 12, marginTop: 4 }}>
                        Details: {h.details}
                      </div>
                    )}
                  </div>
                </Timeline.Item>
              ))}
            </Timeline>
          ) : (
            <p style={{ color: "#999", fontStyle: "italic" }}>
              No history available
            </p>
          )}
        </div>
      </div>
    </Drawer>
  );
}
