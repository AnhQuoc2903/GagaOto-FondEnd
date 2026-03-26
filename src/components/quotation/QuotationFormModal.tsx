/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Modal,
  Select,
  InputNumber,
  Button,
  message,
  DatePicker,
  Input,
} from "antd";
import { useState, useEffect } from "react";
import { formatVND } from "../../utils/format";
import dayjs from "dayjs";

export default function QuotationFormModal({
  open,
  onCancel,
  onOk,
  customers,
  vehicles,
  inventories,
  form,
  setForm,
  editingId,
}: any) {
  const [item, setItem] = useState<any>({
    inventory: "",
    quantity: 1,
  });

  // 🔥 RESET ITEM KHI ĐÓNG MODAL
  useEffect(() => {
    if (!open) {
      setItem({ inventory: "", quantity: 1 });
    }
  }, [open]);

  // ================= ADD ITEM =================
  const addItem = () => {
    if (!item.inventory) {
      return message.warning("Chọn vật tư");
    }

    const inv = inventories.find((i: any) => i._id === item.inventory);
    if (!inv) return message.error("Inventory không tồn tại");

    const qty = Number(item.quantity) || 0;

    if (qty <= 0) {
      return message.warning("Số lượng không hợp lệ");
    }

    if (qty > inv.quantity) {
      return message.error("Vượt quá tồn kho");
    }

    const newItems = [...(form.items || [])];

    // 🔥 FIX ObjectId compare chuẩn
    const existIndex = newItems.findIndex(
      (i: any) =>
        (i.inventory?._id?.toString() || i.inventory?.toString()) ===
        inv._id.toString(),
    );

    if (existIndex >= 0) {
      const exist = newItems[existIndex];

      const newQty = (exist.quantity || 0) + qty;

      if (newQty > inv.quantity) {
        return message.error("Tổng số lượng vượt tồn kho");
      }

      newItems[existIndex] = {
        ...exist,
        quantity: newQty,
      };
    } else {
      newItems.push({
        inventory: inv._id,
        name: inv.name,
        price: inv.price,
        quantity: qty,
      });
    }

    setForm({
      ...form,
      items: newItems,
    });

    setItem({ inventory: "", quantity: 1 });
  };

  // ================= REMOVE =================
  const removeItem = (index: number) => {
    const arr = [...(form.items || [])];
    arr.splice(index, 1);
    setForm({ ...form, items: arr });
  };

  // ================= TOTAL =================
  const total =
    (form.items || []).reduce(
      (sum: number, i: any) =>
        sum + (i.quantity || 0) * (i.price || i.inventory?.price || 0),
      0,
    ) + (form.laborCost || 0);

  // ================= UI =================
  return (
    <Modal
      title={editingId ? "Edit Quotation" : "Create Quotation"}
      open={open}
      onOk={onOk}
      onCancel={onCancel}
      width={600}
    >
      {/* CUSTOMER */}
      <Select
        placeholder="Customer"
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

      {/* VEHICLE */}
      <Select
        placeholder="Vehicle"
        style={{ width: "100%", marginBottom: 10 }}
        value={form.vehicle || undefined}
        onChange={(val) => setForm({ ...form, vehicle: val })}
      >
        {vehicles.map((v: any) => (
          <Select.Option key={v._id} value={v._id}>
            {v.plate}
          </Select.Option>
        ))}
      </Select>

      {/* DEADLINE */}
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

      {/* ADD ITEM */}
      <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
        <Select
          placeholder="Chọn vật tư"
          style={{ width: 250 }}
          value={item.inventory || undefined}
          onChange={(val) =>
            setItem({
              inventory: val,
              quantity: 1,
            })
          }
        >
          {inventories.map((i: any) => (
            <Select.Option key={i._id} value={i._id}>
              {i.name} (Tồn: {i.quantity})
            </Select.Option>
          ))}
        </Select>

        <InputNumber
          min={1}
          value={item.quantity}
          onChange={(val) => setItem({ ...item, quantity: Number(val) || 1 })}
        />

        <Button type="primary" onClick={addItem}>
          Add
        </Button>
      </div>

      {/* LIST ITEMS */}
      {(form.items || []).length === 0 && <div>Chưa có vật tư</div>}

      {(form.items || []).map((i: any, idx: number) => (
        <div
          key={idx}
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 5,
          }}
        >
          <span>
            {i.name || i.inventory?.name || "-"} - {i.quantity} x{" "}
            {formatVND(i.price || i.inventory?.price || 0)} ={" "}
            {formatVND(
              (i.quantity || 0) * (i.price || i.inventory?.price || 0),
            )}
          </span>

          <Button danger size="small" onClick={() => removeItem(idx)}>
            Remove
          </Button>
        </div>
      ))}

      {/* LABOR */}
      <InputNumber
        style={{ width: "100%", marginTop: 10 }}
        placeholder="Labor cost"
        value={form.laborCost}
        onChange={(val) => setForm({ ...form, laborCost: Number(val) || 0 })}
      />

      {/* TOTAL */}
      <h3 style={{ marginTop: 10 }}>Total: {formatVND(total)}</h3>
      <Input.TextArea
        placeholder="Description"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
        rows={3}
      />
    </Modal>
  );
}
