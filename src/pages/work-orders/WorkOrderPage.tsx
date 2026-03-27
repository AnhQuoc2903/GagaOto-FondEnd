/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Table, message, Select, Popconfirm, Tag } from "antd";
import { useEffect, useState, useCallback, useRef } from "react";

import {
  getWorkOrders,
  createWorkOrder,
  updateWorkOrderStatus,
  cancelWorkOrder,
  assignWorkOrder,
  addPartToWorkOrder,
  removePartFromWorkOrder,
  exportInvoice,
} from "../../api/workOrder.api";
import { formatVND } from "../../utils/format";

import { getCustomers } from "../../api/customer.api";
import { getVehicles } from "../../api/vehicle.api";
import { getUsers } from "../../api/user.api";
import { getInventory } from "../../api/inventory.api";

import WorkOrderFormModal from "../../components/work-orders/WorkOrderFormModal";
import AddPartModal from "../../components/work-orders/AddPartModal";
import WorkOrderDetailDrawer from "../work-orders/WorkOrderDetailDrawer";

export default function WorkOrderPage() {
  const [data, setData] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [inventories, setInventories] = useState<any[]>([]);

  const [loading, setLoading] = useState(false);

  const [open, setOpen] = useState(false);

  // 🔥 PART STATE
  const [partModal, setPartModal] = useState(false);
  const [currentId, setCurrentId] = useState("");

  const [partForm, setPartForm] = useState({
    inventory: "",
    quantity: 1,
  });

  const [form, setForm] = useState<any>({
    customer: "",
    vehicle: "",
    technician: "",
    description: "",
    priority: "MEDIUM",
    deadline: null,
  });

  // 🔥 Detail drawer state
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false);
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<any>(null);

  // 🔥 Ref to track if click is from interactive elements
  const isInteractiveClick = useRef(false);
  const clickTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ================= LOAD =================
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getWorkOrders();
      setData(res.data);
    } catch {
      message.error("Load failed");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadRefs = useCallback(async () => {
    const [cRes, vRes, uRes] = await Promise.all([
      getCustomers(),
      getVehicles(),
      getUsers(),
    ]);
    setCustomers(cRes.data);
    setVehicles(vRes.data);
    setUsers(uRes.data);
  }, []);

  const loadInventory = async () => {
    const res = await getInventory();
    setInventories(res.data.data);
  };

  useEffect(() => {
    load();
    loadRefs();
    loadInventory();
  }, [load, loadRefs]);

  // ================= CREATE =================
  const handleCreate = async () => {
    if (!form.customer || !form.vehicle) {
      return message.warning("Missing data");
    }

    try {
      await createWorkOrder(form);
      message.success("Created");
      setOpen(false);
      load();
    } catch (err: any) {
      message.error(err.response?.data?.message || "Error");
    }
  };

  // ================= STATUS =================
  const changeStatus = async (id: string, status: any) => {
    try {
      await updateWorkOrderStatus(id, status);
      message.success("Updated");
      load();
    } catch {
      message.error("Update failed");
    }
  };

  const handleCancel = async (id: string) => {
    try {
      await cancelWorkOrder(id);
      message.success("Cancelled");
      load();
    } catch {
      message.error("Cancel failed");
    }
  };

  const handleAssign = async (id: string, technician: string) => {
    try {
      await assignWorkOrder(id, technician);
      message.success("Assigned");
      load();
    } catch {
      message.error("Assign failed");
    }
  };

  const openAddPart = (id: string) => {
    setCurrentId(id);
    setPartModal(true);
  };

  const handleAddPart = async () => {
    try {
      await addPartToWorkOrder(currentId, partForm);
      message.success("Added part");
      setPartModal(false);
      setPartForm({ inventory: "", quantity: 1 });
      load();
    } catch (err: any) {
      message.error(err.response?.data?.message || "Error");
    }
  };

  const handleRemovePart = async (orderId: string, partId: string) => {
    try {
      await removePartFromWorkOrder(orderId, partId);
      message.success("Removed part");
      load();
    } catch {
      message.error("Remove failed");
    }
  };

  const handleRowClick = (record: any) => {
    // Clear any pending timeout
    if (clickTimeout.current) {
      clearTimeout(clickTimeout.current);
    }

    // Check if this is an interactive click
    if (isInteractiveClick.current) {
      isInteractiveClick.current = false;
      return;
    }

    // Small delay to ensure interactive clicks are processed first
    clickTimeout.current = setTimeout(() => {
      setSelectedWorkOrder(record);
      setDetailDrawerOpen(true);
      clickTimeout.current = null;
    }, 50);
  };

  // ================= Helper function for status color =================
  const getColor = (status: string) => {
    if (status === "DONE") return "green";
    if (status === "IN_PROGRESS") return "blue";
    if (status === "CANCELLED") return "red";
    return "orange";
  };

  // ================= Wrapper for interactive elements =================
  const handleInteractiveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    isInteractiveClick.current = true;

    // Reset flag after a short delay
    setTimeout(() => {
      isInteractiveClick.current = false;
    }, 100);
  };

  const handleExportInvoice = async (id: string) => {
    try {
      const res = await exportInvoice(id);

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");

      link.href = url;
      link.setAttribute("download", `invoice-${id}.pdf`);

      document.body.appendChild(link);
      link.click();

      link.remove();
    } catch {
      message.error("Export failed");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl mb-4 font-semibold">Work Orders</h2>

      <Button type="primary" onClick={() => setOpen(true)} className="mb-4">
        Create Work Order
      </Button>

      <Table
        rowKey="_id"
        loading={loading}
        dataSource={data}
        onRow={(record) => ({
          onClick: () => handleRowClick(record),
          style: { cursor: "pointer" },
        })}
        columns={[
          {
            title: "Customer",
            render: (r) => r.customer?.name || "-",
          },
          {
            title: "Vehicle",
            render: (r) => r.vehicle?.plate || "-",
          },

          // 🔥 TECHNICIAN
          {
            title: "Technician",
            render: (r) => (
              <div
                style={{ display: "flex", flexDirection: "column", gap: 6 }}
                onClick={handleInteractiveClick}
              >
                <div>
                  {r.technician?.name ? (
                    <Tag color="blue">{r.technician.name}</Tag>
                  ) : (
                    <Tag>Chưa có</Tag>
                  )}
                </div>

                <Select
                  style={{ width: 160 }}
                  value={r.technician?._id || undefined}
                  placeholder="Chọn kỹ thuật viên"
                  onChange={(val) => handleAssign(r._id, val)}
                  disabled={r.status === "DONE" || r.status === "CANCELLED"}
                  onClick={handleInteractiveClick}
                >
                  {users
                    .filter((u) => u.role === "TECHNICIAN")
                    .map((u) => (
                      <Select.Option key={u._id} value={u._id}>
                        {u.name}
                      </Select.Option>
                    ))}
                </Select>
              </div>
            ),
          },

          // 🔥 USED PARTS
          {
            title: "Used Parts",
            render: (r) => (
              <div onClick={handleInteractiveClick}>
                {r.usedParts?.length > 0 ? (
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 6,
                      marginBottom: 8,
                      maxHeight: 100,
                      overflowY: "auto",
                      paddingRight: 4,
                    }}
                  >
                    {r.usedParts.map((p: any) => (
                      <Tag
                        key={p._id}
                        color="processing"
                        closable
                        onClose={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleRemovePart(r._id, p._id);
                        }}
                        style={{
                          margin: 0,
                          borderRadius: 4,
                          fontSize: 12,
                          padding: "0 8px",
                          lineHeight: "24px",
                        }}
                      >
                        {p.inventory?.name}{" "}
                        <strong style={{ margin: "0 2px" }}>×</strong>{" "}
                        {p.quantity}
                      </Tag>
                    ))}
                  </div>
                ) : (
                  <div
                    style={{
                      color: "#bfbfbf",
                      marginBottom: 8,
                      fontSize: 12,
                      fontStyle: "italic",
                    }}
                  >
                    No parts added
                  </div>
                )}

                <Button
                  type="primary"
                  ghost
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    openAddPart(r._id);
                  }}
                  style={{
                    fontSize: 12,
                    height: 26,
                    padding: "0 12px",
                    borderRadius: 4,
                  }}
                >
                  + Add Part
                </Button>
              </div>
            ),
          },

          // 🔥 STATUS
          {
            title: "Status",
            render: (r) => (
              <div
                className="flex gap-2 items-center"
                onClick={handleInteractiveClick}
              >
                <Tag color={getColor(r.status)}>{r.status}</Tag>

                <Select
                  value={r.status}
                  style={{ width: 140 }}
                  onChange={(val) => changeStatus(r._id, val)}
                  onClick={handleInteractiveClick}
                >
                  <Select.Option value="PENDING">PENDING</Select.Option>
                  <Select.Option value="IN_PROGRESS">IN_PROGRESS</Select.Option>
                  <Select.Option value="DONE">DONE</Select.Option>
                  <Select.Option value="CANCELLED">CANCELLED</Select.Option>
                </Select>
              </div>
            ),
          },
          {
            title: "Parts",
            dataIndex: "partsTotal",
            render: (value) => formatVND(value || 0),
            onCell: () => ({
              onClick: handleInteractiveClick,
            }),
          },
          {
            title: "Labor",
            dataIndex: "laborCost",
            render: (value) => formatVND(value || 0),
            onCell: () => ({
              onClick: handleInteractiveClick,
            }),
          },
          {
            title: "Total",
            dataIndex: "total",
            render: (value) => formatVND(value || 0),
            onCell: () => ({
              onClick: handleInteractiveClick,
            }),
          },
          {
            title: "Action",
            render: (_, record) => (
              <Popconfirm
                title="Cancel this work order?"
                onConfirm={(e) => {
                  e?.stopPropagation(); // 🔥 FIX
                  handleCancel(record._id);
                }}
                onCancel={(e) => {
                  e?.stopPropagation(); // 🔥 FIX
                }}
              >
                <Button
                  danger
                  disabled={record.status === "DONE"}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleInteractiveClick(e);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleExportInvoice(record._id);
                  }}
                >
                  Invoice
                </Button>
              </Popconfirm>
            ),
          },
        ]}
      />

      {/* CREATE MODAL */}
      <WorkOrderFormModal
        open={open}
        onCancel={() => setOpen(false)}
        onOk={handleCreate}
        form={form}
        setForm={setForm}
        customers={customers}
        vehicles={vehicles}
        users={users}
      />

      <AddPartModal
        open={partModal}
        onCancel={() => setPartModal(false)}
        onOk={handleAddPart}
        inventories={inventories}
        form={partForm}
        setForm={setPartForm}
      />

      <WorkOrderDetailDrawer
        open={detailDrawerOpen}
        onClose={() => setDetailDrawerOpen(false)}
        workOrder={selectedWorkOrder}
      />
    </div>
  );
}
