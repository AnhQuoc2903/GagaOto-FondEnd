import { Table } from "antd";
import { useEffect, useState } from "react";
import { getLowStock } from "../../api/inventory.api";

export default function LowStockPage() {
  const [data, setData] = useState([]);

  useEffect(() => {
    getLowStock().then((res) => setData(res.data));
  }, []);

  return (
    <Table
      rowKey="_id"
      dataSource={data}
      columns={[
        { title: "Name", dataIndex: "name" },
        { title: "Quantity", dataIndex: "quantity" },
        { title: "Min Stock", dataIndex: "minStock" },
      ]}
    />
  );
}
