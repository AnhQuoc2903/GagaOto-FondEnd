/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Table, message, Popconfirm } from "antd";
import { useEffect, useState, useCallback } from "react";
import {
  getVehicles,
  createVehicle,
  updateVehicle,
  deleteVehicle,
} from "../../api/vehicle.api";
import { getCustomers } from "../../api/customer.api";
import VehicleFormModal from "../../components/vehicles/VehicleFormModal";

export default function VehiclePage() {
  const [data, setData] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);

  const [form, setForm] = useState<any>({
    customer: "",
    plate: "",
    brand: "",
    model: "",
    year: "",
  });

  // LOAD VEHICLES
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getVehicles();
      setData(res.data);
    } catch {
      message.error("Load vehicles failed");
    } finally {
      setLoading(false);
    }
  }, []);

  // LOAD CUSTOMERS
  const loadCustomers = useCallback(async () => {
    try {
      const res = await getCustomers();
      setCustomers(res.data);
    } catch {
      message.error("Load customers failed");
    }
  }, []);

  useEffect(() => {
    load();
    loadCustomers();
  }, [load, loadCustomers]);

  // ADD
  const openAdd = () => {
    setEditing(null);
    setForm({
      customer: "",
      plate: "",
      brand: "",
      model: "",
      year: "",
    });
    setIsModalOpen(true);
  };

  // EDIT
  const openEdit = (record: any) => {
    setEditing(record);

    setForm({
      customer: record.customer?._id,
      plate: record.plate,
      brand: record.brand,
      model: record.model,
      year: record.year,
    });

    setIsModalOpen(true);
  };

  // DELETE
  const handleDelete = async (id: string) => {
    try {
      await deleteVehicle(id);
      message.success("Deleted");
      load();
    } catch {
      message.error("Delete failed");
    }
  };

  // SUBMIT
  const handleSubmit = async () => {
    if (!form.customer || !form.plate) {
      return message.warning("Missing data");
    }

    try {
      if (editing) {
        await updateVehicle(editing._id, {
          ...form,
          year: Number(form.year),
        });
        message.success("Updated");
      } else {
        await createVehicle({
          ...form,
          year: Number(form.year),
        });
        message.success("Created");
      }

      setIsModalOpen(false);
      load();
    } catch (err: any) {
      message.error(err.response?.data?.message || "Error");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl mb-4 font-semibold">Vehicles</h2>

      <Button type="primary" onClick={openAdd} className="mb-4">
        Add Vehicle
      </Button>

      <Table
        loading={loading}
        rowKey="_id"
        dataSource={data}
        columns={[
          {
            title: "Plate",
            dataIndex: "plate",
          },
          {
            title: "Customer",
            render: (r) => r.customer?.name || "-",
          },
          {
            title: "Brand",
            dataIndex: "brand",
          },
          {
            title: "Model",
            dataIndex: "model",
          },
          {
            title: "Year",
            dataIndex: "year",
          },
          {
            title: "Action",
            render: (_, record) => (
              <div className="flex gap-2">
                <Button onClick={() => openEdit(record)}>Edit</Button>

                <Popconfirm
                  title="Delete vehicle?"
                  onConfirm={() => handleDelete(record._id)}
                >
                  <Button danger>Delete</Button>
                </Popconfirm>
              </div>
            ),
          },
        ]}
      />

      <VehicleFormModal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleSubmit}
        form={form}
        setForm={setForm}
        customers={customers}
        isEdit={!!editing}
      />
    </div>
  );
}
