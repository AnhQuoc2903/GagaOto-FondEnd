/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Table, message, Popconfirm, InputNumber, Modal } from "antd";
import { useEffect, useState, useCallback } from "react";
import {
  getInventory,
  createInventory,
  updateInventory,
  deleteInventory,
  importStock,
  exportStock,
  adjustStock,
} from "../../api/inventory.api";
import InventoryFormModal from "../../components/inventory/InventoryFormModal";

export default function InventoryPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);

  const [form, setForm] = useState({
    name: "",
    quantity: "",
    price: "",
    minStock: "",
  });

  const [stockModal, setStockModal] = useState(false);
  const [stockValue, setStockValue] = useState(0);
  const [stockType, setStockType] = useState<"import" | "export" | "adjust">(
    "import",
  );

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getInventory();
      setData(res.data.data);
    } catch {
      message.error("Load failed");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const openAdd = () => {
    setEditing(null);
    setForm({ name: "", quantity: "", price: "", minStock: "" });
    setIsModalOpen(true);
  };

  const openEdit = (record: any) => {
    setEditing(record);
    setForm({
      name: record.name,
      quantity: record.quantity,
      price: record.price,
      minStock: record.minStock,
    });
    setIsModalOpen(true);
  };

  // SUBMIT
  const handleSubmit = async () => {
    try {
      const payload = {
        name: form.name,
        quantity: Number(form.quantity),
        price: Number(form.price),
        minStock: Number(form.minStock),
      };

      if (editing) {
        await updateInventory(editing._id, payload);
        message.success("Updated");
      } else {
        await createInventory(payload);
        message.success("Created");
      }

      setIsModalOpen(false);
      load();
    } catch {
      message.error("Error");
    }
  };

  const handleDelete = async (id: string) => {
    await deleteInventory(id);
    message.success("Deleted");
    load();
  };

  const openStock = (record: any, type: "import" | "export" | "adjust") => {
    setEditing(record);
    setStockType(type);
    setStockValue(0);
    setStockModal(true);
  };

  const handleStock = async () => {
    try {
      if (stockType === "import") {
        await importStock(editing._id, { quantity: stockValue });
      } else if (stockType === "export") {
        await exportStock(editing._id, { quantity: stockValue });
      } else {
        await adjustStock(editing._id, { quantity: stockValue });
      }

      message.success("Success");
      setStockModal(false);
      load();
    } catch {
      message.error("Stock failed");
    }
  };

  return (
    <div>
      <h2 className="text-xl mb-4">Inventory</h2>

      <Button type="primary" onClick={openAdd} className="mb-4">
        Add Inventory
      </Button>

      <Table
        loading={loading}
        rowKey="_id"
        dataSource={data}
        columns={[
          { title: "Name", dataIndex: "name" },
          { title: "Quantity", dataIndex: "quantity" },
          { title: "Price", dataIndex: "price" },
          { title: "Min Stock", dataIndex: "minStock" },

          {
            title: "Action",
            render: (_, record) => (
              <div className="flex gap-2">
                <Button onClick={() => openEdit(record)}>Edit</Button>

                <Popconfirm
                  title="Delete?"
                  onConfirm={() => handleDelete(record._id)}
                >
                  <Button danger>Delete</Button>
                </Popconfirm>

                <Button onClick={() => openStock(record, "import")}>
                  Import
                </Button>

                <Button onClick={() => openStock(record, "export")}>
                  Export
                </Button>

                <Button onClick={() => openStock(record, "adjust")}>
                  Adjust
                </Button>
              </div>
            ),
          },
        ]}
      />

      <InventoryFormModal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleSubmit}
        form={form}
        setForm={setForm}
        isEdit={!!editing}
      />

      <Modal
        title={
          stockType === "import"
            ? "Import Stock"
            : stockType === "export"
              ? "Export Stock"
              : "Adjust Stock"
        }
        open={stockModal}
        onOk={handleStock}
        onCancel={() => setStockModal(false)}
      >
        <InputNumber
          min={1}
          style={{ width: "100%" }}
          value={stockValue}
          onChange={(val) => setStockValue(val || 0)}
        />
      </Modal>
    </div>
  );
}
