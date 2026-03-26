/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Button, Table, Tag, message, Select } from "antd";
import { useEffect, useState } from "react";

import {
  getQuotations,
  createQuotation,
  approveQuotation,
  rejectQuotation,
  updateQuotation,
  exportQuotationPDF,
} from "../../api/quotation.api";

import { getCustomers } from "../../api/customer.api";
import { getVehicles } from "../../api/vehicle.api";
import { getInventory } from "../../api/inventory.api";

import QuotationFormModal from "../../components/quotation/QuotationFormModal";
import { formatVND } from "../../utils/format";

export default function QuotationPage() {
  const [data, setData] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [inventories, setInventories] = useState<any[]>([]);

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState<any>({
    customer: "",
    vehicle: "",
    items: [],
    laborCost: 0,
    deadline: null,
    description: "",
  });

  const [statusFilter, setStatusFilter] = useState("");

  // LOAD
  const load = async () => {
    const res = await getQuotations({
      status: statusFilter || undefined,
    });
    setData(res.data);
  };

  const loadRefs = async () => {
    const [cRes, vRes, iRes] = await Promise.all([
      getCustomers(),
      getVehicles(),
      getInventory(),
    ]);

    setCustomers(cRes.data);
    setVehicles(vRes.data);
    setInventories(iRes.data.data);
  };

  useEffect(() => {
    loadRefs();
  }, []);

  useEffect(() => {
    load();
  }, [statusFilter]);

  // ================= CREATE / UPDATE =================
  const handleSubmit = async () => {
    try {
      if (editingId) {
        await updateQuotation(editingId, form);
        message.success("Updated");
      } else {
        await createQuotation(form);
        message.success("Created");
      }

      setOpen(false);
      setEditingId(null);

      setForm({
        customer: "",
        vehicle: "",
        items: [],
        laborCost: 0,
        deadline: null,
        description: "",
      });

      load();
    } catch {
      message.error("Error");
    }
  };

  // ================= EDIT =================
  const openEdit = (r: any) => {
    setEditingId(r._id);

    setForm({
      customer: r.customer?._id,
      vehicle: r.vehicle?._id,
      items: r.items || [],
      laborCost: r.laborCost || 0,
      deadline: r.deadline || null,
      description: r.description || "",
    });

    setOpen(true);
  };

  // ================= APPROVE =================
  const handleApprove = async (id: string) => {
    try {
      await approveQuotation(id);

      message.success("Approved → WorkOrder created");

      load(); // ✅ reload data thôi là đủ
    } catch (err: any) {
      message.error(err.response?.data?.message || "Error");
    }
  };

  // ================= REJECT =================
  const handleReject = async (id: string) => {
    await rejectQuotation(id);
    message.success("Rejected");
    load();
  };

  const handleExportPDF = async (id: string) => {
    try {
      const res = await exportQuotationPDF(id);

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");

      link.href = url;
      link.setAttribute("download", `quotation-${id}.pdf`);

      document.body.appendChild(link);
      link.click();
    } catch {
      message.error("Export PDF failed");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl mb-4">Quotations</h2>

      <div className="flex gap-2 mb-4">
        <Button
          type="primary"
          onClick={() => {
            setEditingId(null);
            setForm({
              customer: "",
              vehicle: "",
              items: [],
              laborCost: 0,
              deadline: null,
            });
            setOpen(true);
          }}
        >
          Create Quotation
        </Button>

        <Select
          placeholder="Filter status"
          style={{ width: 200 }}
          allowClear
          value={statusFilter || undefined}
          onChange={(val) => setStatusFilter(val || "")}
        >
          <Select.Option value="DRAFT">DRAFT</Select.Option>
          <Select.Option value="APPROVED">APPROVED</Select.Option>
          <Select.Option value="REJECTED">REJECTED</Select.Option>
        </Select>
      </div>

      <Table
        rowKey="_id"
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
            title: "Deadline",
            render: (r) =>
              r.deadline ? new Date(r.deadline).toLocaleDateString() : "-",
          },
          {
            title: "Used Parts",
            render: (r) =>
              r.items?.length ? (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {r.items.map((i: any, idx: number) => (
                    <Tag key={idx} color="blue">
                      {i.name || i.inventory?.name} x {i.quantity}
                    </Tag>
                  ))}
                </div>
              ) : (
                "-"
              ),
          },
          {
            title: "Total",
            render: (r) => formatVND(r.total || 0),
          },
          {
            title: "Status",
            render: (r) => (
              <Tag
                color={
                  r.status === "APPROVED"
                    ? "green"
                    : r.status === "REJECTED"
                      ? "red"
                      : "orange"
                }
              >
                {r.status}
              </Tag>
            ),
          },
          {
            title: "Description",
            dataIndex: "description",
            render: (text) => text || "-",
          },
          {
            title: "Action",
            render: (r) => (
              <div className="flex gap-2">
                <Button
                  disabled={r.status !== "DRAFT"}
                  onClick={() => openEdit(r)}
                >
                  Edit
                </Button>

                <Button
                  disabled={r.status === "APPROVED"}
                  onClick={() => handleApprove(r._id)}
                >
                  Approve
                </Button>

                <Button
                  danger
                  disabled={r.status !== "DRAFT"}
                  onClick={() => handleReject(r._id)}
                >
                  Reject
                </Button>
                <Button onClick={() => handleExportPDF(r._id)}>PDF</Button>
              </div>
            ),
          },
        ]}
      />

      <QuotationFormModal
        open={open}
        onCancel={() => {
          setOpen(false);
          setEditingId(null);
        }}
        onOk={handleSubmit}
        customers={customers}
        vehicles={vehicles}
        inventories={inventories}
        form={form}
        setForm={setForm}
        editingId={editingId} // 🔥 truyền xuống
      />
    </div>
  );
}
