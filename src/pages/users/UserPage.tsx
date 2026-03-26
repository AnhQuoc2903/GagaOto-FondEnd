/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Table, message, Tag, Input, Select } from "antd";
import { useEffect, useState, useCallback } from "react";
import {
  getUsers,
  createUser,
  updateUser,
  toggleUser,
} from "../../api/user.api";
import UserFormModal from "../../components/users/UserFormModal";

export default function UserPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);

  const [form, setForm] = useState<any>({
    name: "",
    email: "",
    password: "",
    role: "TECHNICIAN",
  });

  // 🔥 SEARCH + FILTER
  const [keyword, setKeyword] = useState("");
  const [keywordInput, setKeywordInput] = useState("");
  const [statusFilter, setStatusFilter] = useState<any>(undefined);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getUsers({
        keyword,
        isActive: statusFilter,
      });
      setData(res.data);
    } catch {
      message.error("Load users failed");
    } finally {
      setLoading(false);
    }
  }, [keyword, statusFilter]);

  useEffect(() => {
    load();
  }, [load]);

  // ADD
  const openAdd = () => {
    setEditing(null);
    setForm({
      name: "",
      email: "",
      password: "",
      role: "TECHNICIAN",
    });
    setOpen(true);
  };

  // EDIT
  const openEdit = (record: any) => {
    setEditing(record);
    setForm({
      name: record.name,
      email: record.email,
      role: record.role,
    });
    setOpen(true);
  };

  const handleSubmit = async () => {
    try {
      if (editing) {
        await updateUser(editing._id, form);
        message.success("Updated");
      } else {
        await createUser(form);
        message.success("Created");
      }

      setOpen(false);
      load();
    } catch (err: any) {
      message.error(err.response?.data?.message || "Error");
    }
  };

  const handleToggle = async (id: string) => {
    try {
      await toggleUser(id);
      message.success("Updated status");
      load();
    } catch {
      message.error("Failed");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl mb-4 font-semibold">Users</h2>

      <Button type="primary" onClick={openAdd} className="mb-4">
        Add User
      </Button>

      {/* 🔥 SEARCH + FILTER */}
      <div className="flex gap-2 mb-4">
        <Input
          placeholder="Search name / email..."
          value={keywordInput}
          onChange={(e) => setKeywordInput(e.target.value)}
        />

        <Button type="primary" onClick={() => setKeyword(keywordInput)}>
          Search
        </Button>

        <Select
          style={{ width: 160 }}
          placeholder="Filter status"
          allowClear
          value={statusFilter}
          onChange={(val) => setStatusFilter(val)}
        >
          <Select.Option value={true}>Active</Select.Option>
          <Select.Option value={false}>Disabled</Select.Option>
        </Select>

        <Button
          onClick={() => {
            setKeyword("");
            setKeywordInput("");
            setStatusFilter(undefined);
          }}
        >
          Reset
        </Button>
      </div>

      <Table
        loading={loading}
        rowKey="_id"
        dataSource={data}
        columns={[
          { title: "Name", dataIndex: "name" },
          { title: "Email", dataIndex: "email" },

          { title: "Role", dataIndex: "role" },

          {
            title: "Status",
            render: (r) =>
              r.isActive ? (
                <Tag color="green">Active</Tag>
              ) : (
                <Tag color="red">Disabled</Tag>
              ),
          },

          {
            title: "Action",
            render: (_, record) => (
              <div className="flex gap-2">
                <Button onClick={() => openEdit(record)}>Edit</Button>

                <Button
                  danger={!record.isActive}
                  onClick={() => handleToggle(record._id)}
                >
                  {record.isActive ? "Disable" : "Enable"}
                </Button>
              </div>
            ),
          },
        ]}
      />

      <UserFormModal
        open={open}
        onCancel={() => setOpen(false)}
        onOk={handleSubmit}
        form={form}
        setForm={setForm}
        isEdit={!!editing}
      />
    </div>
  );
}
