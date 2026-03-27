/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Table, Tag, message } from "antd";
import { useEffect, useState } from "react";
import {
  getReminders,
  markReminderSent,
  deleteReminder,
  createReminder,
} from "../../api/reminder.api";

import { getCustomers } from "../../api/customer.api";
import { getVehicles } from "../../api/vehicle.api";

import ReminderFormModal from "../../components/reminder/ReminderFormModal";

export default function ReminderPage() {
  const [data, setData] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);

  const [loading, setLoading] = useState(false);

  // 🔥 MODAL
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState<any>({
    customer: "",
    vehicle: "",
    nextDate: null,
    note: "",
  });

  // LOAD DATA
  const load = async () => {
    setLoading(true);
    try {
      const res = await getReminders();
      setData(res.data);
    } catch {
      message.error("Load reminder failed");
    } finally {
      setLoading(false);
    }
  };

  // LOAD REF
  const loadRefs = async () => {
    const [cRes, vRes] = await Promise.all([getCustomers(), getVehicles()]);

    setCustomers(cRes.data);
    setVehicles(vRes.data);
  };

  useEffect(() => {
    load();
    loadRefs();
  }, []);

  // CREATE
  const handleCreate = async () => {
    try {
      await createReminder(form);
      message.success("Created");

      setOpen(false);
      setForm({
        customer: "",
        vehicle: "",
        nextDate: null,
        note: "",
      });

      load();
    } catch {
      message.error("Create failed");
    }
  };

  const handleSent = async (id: string) => {
    await markReminderSent(id);
    message.success("Marked as sent");
    load();
  };

  const handleDelete = async (id: string) => {
    await deleteReminder(id);
    message.success("Deleted");
    load();
  };

  return (
    <div className="p-4">
      <h2 className="text-xl mb-4 font-semibold">Maintenance Reminders</h2>

      {/* 🔥 ADD BUTTON */}
      <Button type="primary" onClick={() => setOpen(true)} className="mb-4">
        Create Reminder
      </Button>

      <Table
        rowKey="_id"
        loading={loading}
        dataSource={data}
        columns={[
          {
            title: "Customer",
            render: (r) => r.customer?.name || "-",
          },
          {
            title: "Vehicle",
            render: (r) => r.vehicle?.plate || "-",
          },
          {
            title: "Next Date",
            render: (r) =>
              r.nextDate ? new Date(r.nextDate).toLocaleDateString() : "-",
          },
          {
            title: "Type",
            dataIndex: "type",
          },
          {
            title: "Status",
            render: (r) =>
              r.isSent ? (
                <Tag color="green">Sent</Tag>
              ) : (
                <Tag color="orange">Pending</Tag>
              ),
          },
          {
            title: "Action",
            render: (r) => (
              <div className="flex gap-2">
                {!r.isSent && (
                  <Button onClick={() => handleSent(r._id)}>Mark Sent</Button>
                )}

                <Button danger onClick={() => handleDelete(r._id)}>
                  Delete
                </Button>
              </div>
            ),
          },
        ]}
      />

      {/* 🔥 MODAL */}
      <ReminderFormModal
        open={open}
        onCancel={() => setOpen(false)}
        onOk={handleCreate}
        form={form}
        setForm={setForm}
        customers={customers}
        vehicles={vehicles}
      />
    </div>
  );
}
