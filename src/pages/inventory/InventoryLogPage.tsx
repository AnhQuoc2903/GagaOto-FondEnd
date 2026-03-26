/* eslint-disable @typescript-eslint/no-explicit-any */
import { Table, Tag } from "antd";
import { useEffect, useState } from "react";
import { getInventoryLogs } from "../../api/inventory.api";

export default function InventoryLogPage() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    getInventoryLogs().then((res) => setData(res.data));
  }, []);

  return (
    <Table
      rowKey="_id"
      dataSource={data}
      columns={[
        {
          title: "Item",
          render: (r) => r.inventory?.name || "-",
        },
        {
          title: "User",
          render: (r) => r.user?.name || "-",
        },
        {
          title: "Type",
          render: (r) => {
            const color =
              r.type === "IMPORT"
                ? "green"
                : r.type === "EXPORT"
                  ? "red"
                  : "orange";

            return <Tag color={color}>{r.type}</Tag>;
          },
        },
        {
          title: "Quantity",
          dataIndex: "quantity",
        },
        {
          title: "Date",
          render: (r) => new Date(r.createdAt).toLocaleString(),
        },
      ]}
    />
  );
}
