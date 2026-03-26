/* eslint-disable @typescript-eslint/no-explicit-any */
import { Modal, Input, Select } from "antd";

export default function VehicleFormModal({
  open,
  onCancel,
  onOk,
  form,
  setForm,
  customers,
  isEdit,
}: any) {
  return (
    <Modal
      title={isEdit ? "Edit Vehicle" : "Add Vehicle"}
      open={open}
      onOk={onOk}
      onCancel={onCancel}
    >
      <Select
        placeholder="Select Customer"
        style={{ width: "100%", marginBottom: 10 }}
        value={form.customer || undefined}
        onChange={(val) => setForm({ ...form, customer: val })}
      >
        {customers.map((c: any) => (
          <Select.Option key={c._id} value={c._id}>
            {c.name}
          </Select.Option>
        ))}
      </Select>

      <Input
        className="mb-2"
        placeholder="Plate"
        value={form.plate}
        onChange={(e) => setForm({ ...form, plate: e.target.value })}
      />

      <Input
        className="mb-2"
        placeholder="Brand"
        value={form.brand}
        onChange={(e) => setForm({ ...form, brand: e.target.value })}
      />

      <Input
        className="mb-2"
        placeholder="Model"
        value={form.model}
        onChange={(e) => setForm({ ...form, model: e.target.value })}
      />

      <Input
        type="number"
        placeholder="Year"
        value={form.year}
        onChange={(e) => setForm({ ...form, year: Number(e.target.value) })}
      />
    </Modal>
  );
}
