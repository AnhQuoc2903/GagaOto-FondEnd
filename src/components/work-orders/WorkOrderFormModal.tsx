/* eslint-disable @typescript-eslint/no-explicit-any */
import { Modal, Select, Input, DatePicker } from "antd";
import dayjs from "dayjs";

export default function WorkOrderFormModal({
  open,
  onCancel,
  onOk,
  form,
  setForm,
  customers,
  vehicles,
  users,
}: any) {
  return (
    <Modal
      title="Create Work Order"
      open={open}
      onOk={onOk}
      onCancel={onCancel}
      okButtonProps={{
        disabled: !form.customer || !form.vehicle,
      }}
    >
      {/* CUSTOMER */}
      <Select
        placeholder="Select Customer"
        style={{ width: "100%", marginBottom: 10 }}
        value={form.customer}
        onChange={(val) => setForm({ ...form, customer: val })}
      >
        {customers.map((c: any) => (
          <Select.Option key={c._id} value={c._id}>
            {c.name}
          </Select.Option>
        ))}
      </Select>

      {/* VEHICLE */}
      <Select
        placeholder="Select Vehicle"
        style={{ width: "100%", marginBottom: 10 }}
        value={form.vehicle}
        onChange={(val) => setForm({ ...form, vehicle: val })}
      >
        {vehicles.map((v: any) => (
          <Select.Option key={v._id} value={v._id}>
            {v.plate}
          </Select.Option>
        ))}
      </Select>

      {/* 🔥 TECHNICIAN */}
      <Select
        placeholder="Assign Technician"
        style={{ width: "100%", marginBottom: 10 }}
        value={form.technician}
        onChange={(val) => setForm({ ...form, technician: val })}
        allowClear
      >
        {users
          .filter((u: any) => u.role === "TECHNICIAN")
          .map((u: any) => (
            <Select.Option key={u._id} value={u._id}>
              {u.name}
            </Select.Option>
          ))}
      </Select>

      {/* 🔥 PRIORITY */}
      <Select
        placeholder="Priority"
        style={{ width: "100%", marginBottom: 10 }}
        value={form.priority}
        onChange={(val) => setForm({ ...form, priority: val })}
      >
        <Select.Option value="LOW">LOW</Select.Option>
        <Select.Option value="MEDIUM">MEDIUM</Select.Option>
        <Select.Option value="HIGH">HIGH</Select.Option>
      </Select>

      <Input
        type="number"
        placeholder="Labor Cost"
        value={form.laborCost}
        onChange={(e) =>
          setForm({ ...form, laborCost: Number(e.target.value) })
        }
      />

      {/* 🔥 DEADLINE */}
      <DatePicker
        style={{ width: "100%", marginBottom: 10 }}
        placeholder="Deadline"
        value={form.deadline ? dayjs(form.deadline) : null}
        onChange={(date) =>
          setForm({
            ...form,
            deadline: date ? date.toISOString() : null,
          })
        }
      />

      {/* DESCRIPTION */}
      <Input.TextArea
        placeholder="Description"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />
    </Modal>
  );
}
