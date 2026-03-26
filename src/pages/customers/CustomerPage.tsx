/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Input, Table, message, Popconfirm } from "antd";
import { useEffect, useState, useCallback } from "react";
import {
  getCustomers,
  createCustomer,
  deleteCustomer,
  updateCustomer,
  getCustomerById,
} from "../../api/customer.api";
import { useNavigate } from "react-router-dom";
import CustomerFormModal from "../../components/customers/CustomerFormModal";

export default function CustomerPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [keyword, setKeyword] = useState("");
  const [keywordInput, setKeywordInput] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    note: "",
  });

  const navigate = useNavigate();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getCustomers({ keyword });
      setData(res.data);
    } catch {
      message.error("Load failed");
    } finally {
      setLoading(false);
    }
  }, [keyword]);

  useEffect(() => {
    load();
  }, [load]);

  const openAdd = () => {
    setEditing(null);
    setForm({
      name: "",
      phone: "",
      address: "",
      note: "",
    });
    setIsModalOpen(true);
  };

  const openEdit = async (id: string) => {
    try {
      const res = await getCustomerById(id);

      setEditing(res.data);
      setForm({
        name: res.data.name,
        phone: res.data.phone,
        address: res.data.address || "",
        note: res.data.note || "",
      });

      setIsModalOpen(true);
    } catch {
      message.error("Load detail failed");
    }
  };

  const handleSubmit = async () => {
    if (!form.name || !form.phone) {
      return message.warning("Nhập name + phone");
    }

    try {
      if (editing) {
        await updateCustomer(editing._id, form);
        message.success("Updated");
      } else {
        await createCustomer(form);
        message.success("Created");
      }

      setIsModalOpen(false);
      load();
    } catch (err: any) {
      message.error(err.response?.data?.message || "Error");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCustomer(id);
      message.success("Deleted");
      load();
    } catch {
      message.error("Delete failed");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl mb-4 font-semibold">Customers</h2>

      <Button type="primary" onClick={openAdd} className="mb-4">
        Add Customer
      </Button>

      {/* SEARCH */}
      <div className="flex gap-2 mb-4">
        <Input
          placeholder="Search..."
          value={keywordInput}
          onChange={(e) => setKeywordInput(e.target.value)}
        />

        <Button type="primary" onClick={() => setKeyword(keywordInput)}>
          Search
        </Button>
      </div>

      <Table
        loading={loading}
        rowKey="_id"
        dataSource={data}
        columns={[
          {
            title: "Name",
            dataIndex: "name",
            render: (text, record) => (
              <a onClick={() => navigate(`/customers/${record._id}`)}>{text}</a>
            ),
          },
          {
            title: "Phone",
            dataIndex: "phone",
          },
          {
            title: "Address",
            dataIndex: "address",
          },
          {
            title: "Note",
            dataIndex: "note",
          },
          {
            title: "Action",
            render: (_, record) => (
              <div className="flex gap-2">
                <Button onClick={() => openEdit(record._id)}>Edit</Button>

                <Popconfirm
                  title="Delete customer?"
                  onConfirm={() => handleDelete(record._id)}
                >
                  <Button danger>Delete</Button>
                </Popconfirm>
              </div>
            ),
          },
        ]}
      />

      <CustomerFormModal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleSubmit}
        form={form}
        setForm={setForm}
        isEdit={!!editing}
      />
    </div>
  );
}
