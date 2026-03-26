/* eslint-disable @typescript-eslint/no-explicit-any */
import { Modal, Select, InputNumber, Form, Space, Divider } from "antd";
import { useState } from "react";

export default function AddPartModal({
  open,
  onCancel,
  onOk,
  inventories,
  form,
  setForm,
}: any) {
  const [selectedInventory, setSelectedInventory] = useState<any>(null);
  const maxQuantity = selectedInventory?.quantity || 0;

  const handleInventoryChange = (value: string) => {
    const inventory = inventories.find((i: any) => i._id === value);
    setSelectedInventory(inventory);
    setForm({ ...form, inventory: value, quantity: 1 });
  };

  const total = (
    (selectedInventory?.price || 0) * (form.quantity || 0)
  ).toFixed(2);

  return (
    <Modal
      title="Add Part to Work Order"
      open={open}
      onOk={onOk}
      onCancel={onCancel}
      okText="Add Part"
      cancelText="Cancel"
      okButtonProps={{
        disabled: !form.inventory || !form.quantity,
      }}
      width={500}
    >
      <Form layout="vertical">
        <Form.Item label="Part" required>
          <Select
            placeholder="Select a part from inventory"
            style={{ width: "100%" }}
            value={form.inventory || undefined}
            onChange={handleInventoryChange}
            showSearch
            size="large"
          >
            {inventories?.map((i: any) => (
              <Select.Option key={i._id} value={i._id}>
                <Space>
                  <span style={{ fontWeight: 500 }}>{i.name}</span>
                  <span style={{ color: "#8c8c8c", fontSize: 12 }}>
                    Stock: {i.quantity}
                  </span>
                  {i.price && (
                    <span style={{ color: "#1890ff", fontSize: 12 }}>
                      ${i.price}
                    </span>
                  )}
                </Space>
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Quantity"
          required
          extra={selectedInventory && `Available: ${maxQuantity} units`}
        >
          <InputNumber
            style={{ width: "100%" }}
            min={1}
            max={maxQuantity}
            value={form.quantity}
            onChange={(val) => setForm({ ...form, quantity: val || 1 })}
            size="large"
            disabled={!selectedInventory}
          />
        </Form.Item>

        {selectedInventory && (
          <>
            <Divider style={{ margin: "12px 0" }} />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "12px",
                background: "#fafafa",
                borderRadius: 6,
              }}
            >
              <span style={{ fontSize: 16, fontWeight: 500 }}>Total:</span>
              <span style={{ fontSize: 18, fontWeight: 600, color: "#1890ff" }}>
                ${total}
              </span>
            </div>
          </>
        )}
      </Form>
    </Modal>
  );
}
