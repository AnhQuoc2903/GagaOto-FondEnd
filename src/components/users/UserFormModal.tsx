/* eslint-disable @typescript-eslint/no-explicit-any */
import { Modal, Input, Select } from "antd";

export default function UserFormModal({
  open,
  onCancel,
  onOk,
  form,
  setForm,
  isEdit,
}: any) {
  return (
    <Modal
      title={isEdit ? "Edit User" : "Add User"}
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
        placeholder="Email"
        value={form.email}
        disabled={isEdit} // 🔥 không cho sửa email
      />

      {!isEdit && (
        <Input.Password
          className="mb-2"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
      )}

      <Select
        style={{ width: "100%" }}
        value={form.role}
        onChange={(val) => setForm({ ...form, role: val })}
      >
        <Select.Option value="ADMIN">ADMIN</Select.Option>
        <Select.Option value="MANAGER">MANAGER</Select.Option>
        <Select.Option value="TECHNICIAN">TECHNICIAN</Select.Option>
      </Select>
    </Modal>
  );
}
