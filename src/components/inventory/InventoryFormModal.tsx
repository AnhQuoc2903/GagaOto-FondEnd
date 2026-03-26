/* eslint-disable @typescript-eslint/no-explicit-any */
import { Modal, Input } from "antd";

export default function InventoryFormModal({
  open,
  onCancel,
  onOk,
  form,
  setForm,
  isEdit,
}: any) {
  return (
    <Modal
      title={isEdit ? "Edit Inventory" : "Add Inventory"}
      open={open}
      onOk={onOk}
      onCancel={onCancel}
    >
      <Input
        className="mb-2"
        placeholder="Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      <Input
        className="mb-2"
        type="number"
        placeholder="Quantity"
        value={form.quantity}
        onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })}
      />

      <Input
        className="mb-2"
        type="number"
        placeholder="Price"
        value={form.price}
        onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
      />

      <Input
        className="mb-2"
        type="number"
        placeholder="Minimum Stock"
        value={form.minStock}
        onChange={(e) => setForm({ ...form, minStock: Number(e.target.value) })}
      />
    </Modal>
  );
}
