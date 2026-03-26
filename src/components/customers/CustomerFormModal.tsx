/* eslint-disable @typescript-eslint/no-explicit-any */
import { Modal, Input } from "antd";

export default function CustomerFormModal({
  open,
  onCancel,
  onOk,
  form,
  setForm,
  isEdit,
}: any) {
  return (
    <Modal
      title={isEdit ? "Edit Customer" : "Add Customer"}
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
        placeholder="Phone"
        value={form.phone}
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
      />

      <Input
        className="mb-2"
        placeholder="Address"
        value={form.address}
        onChange={(e) => setForm({ ...form, address: e.target.value })}
      />

      <Input.TextArea
        placeholder="Note"
        value={form.note}
        onChange={(e) => setForm({ ...form, note: e.target.value })}
      />
    </Modal>
  );
}