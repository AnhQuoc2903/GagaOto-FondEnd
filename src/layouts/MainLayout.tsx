import { Layout, Menu, Dropdown, Avatar } from "antd";
import {
  UserOutlined,
  DashboardOutlined,
  TeamOutlined,
  CarOutlined,
  ToolOutlined,
  InboxOutlined,
  WarningOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";

const { Header, Sider, Content } = Layout;

export default function MainLayout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const userMenu = {
    items: [
      {
        key: "logout",
        label: <span onClick={handleLogout}>Logout</span>,
      },
    ],
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* SIDEBAR */}
      <Sider width={220}>
        <div className="text-white text-center py-4 font-bold text-lg">
          🚗 Garage
        </div>

        <Menu theme="dark" mode="inline" selectedKeys={[pathname]}>
          {/* DASHBOARD */}
          <Menu.Item key="/" icon={<DashboardOutlined />}>
            <Link to="/">Dashboard</Link>
          </Menu.Item>

          {/* CUSTOMERS */}
          <Menu.Item key="/customers" icon={<TeamOutlined />}>
            <Link to="/customers">Customers</Link>
          </Menu.Item>

          {/* VEHICLES */}
          <Menu.Item key="/vehicles" icon={<CarOutlined />}>
            <Link to="/vehicles">Vehicles</Link>
          </Menu.Item>

          {/* WORK ORDERS */}
          <Menu.Item key="/work-orders" icon={<ToolOutlined />}>
            <Link to="/work-orders">Work Orders</Link>
          </Menu.Item>
          <Menu.Item key="/quotations" icon={<FileTextOutlined />}>
            <Link to="/quotations">Quotations</Link>
          </Menu.Item>

          {/* ADMIN ZONE */}
          {user?.role === "ADMIN" && (
            <>
              <Menu.Divider />

              <Menu.Item key="/inventory" icon={<InboxOutlined />}>
                <Link to="/inventory">Inventory</Link>
              </Menu.Item>

              <Menu.Item key="/inventory/logs" icon={<FileTextOutlined />}>
                <Link to="/inventory/logs">Inventory Logs</Link>
              </Menu.Item>

              <Menu.Item key="/inventory/low-stock" icon={<WarningOutlined />}>
                <Link to="/inventory/low-stock">Low Stock</Link>
              </Menu.Item>

              <Menu.Item key="/users" icon={<UserOutlined />}>
                <Link to="/users">Users</Link>
              </Menu.Item>
            </>
          )}
        </Menu>
      </Sider>

      <Layout>
        {/* HEADER */}
        <Header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "#001529",
            padding: "0 20px",
          }}
        >
          <div style={{ color: "#fff", fontWeight: 600 }}>
            Garage Management System
          </div>

          <Dropdown menu={userMenu}>
            <div
              style={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 10,
                color: "#fff",
              }}
            >
              <Avatar icon={<UserOutlined />} />

              <div style={{ lineHeight: "1" }}>
                <div style={{ fontWeight: 500 }}>{user?.name || "User"}</div>

                <div style={{ fontSize: 12, opacity: 0.7 }}>
                  {user?.email || ""}
                </div>

                <div
                  style={{
                    fontSize: 12,
                    color:
                      user?.role === "ADMIN"
                        ? "#ff4d4f"
                        : user?.role === "MANAGER"
                          ? "#faad14"
                          : "#52c41a",
                  }}
                >
                  {user?.role || ""}
                </div>
              </div>
            </div>
          </Dropdown>
        </Header>

        {/* CONTENT */}
        <Content style={{ padding: 20, background: "#f5f5f5" }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
