/* eslint-disable @typescript-eslint/no-explicit-any */
import { Modal, Select, DatePicker, Input } from "antd";
import dayjs from "dayjs";

export default function ReminderFormModal({
  open,
  onCancel,
  onOk,
  form,
  setForm,
  customers,
  vehicles,
}: any) {
  return (
    <Modal title="Create Reminder" open={open} onOk={onOk} onCancel={onCancel}>
      <Select
        placeholder="Customer"
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

      <Select
        placeholder="Vehicle"
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

      <DatePicker
        style={{ width: "100%", marginBottom: 10 }}
        value={form.nextDate ? dayjs(form.nextDate) : null}
        onChange={(d) =>
          setForm({
            ...form,
            nextDate: d?.toISOString(),
          })
        }
      />

      <Input
        placeholder="Note"
        value={form.note}
        onChange={(e) => setForm({ ...form, note: e.target.value })}
      />
    </Modal>
  );
}
