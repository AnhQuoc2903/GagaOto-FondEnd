/* eslint-disable @typescript-eslint/no-explicit-any */
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/login/Login";
import CustomerPage from "./pages/customers/CustomerPage";
import CustomerDetail from "./pages/customers/CustomerDetail";
import InventoryPage from "./pages/inventory/InventoryPage";
import InventoryLogPage from "./pages/inventory/InventoryLogPage";
import LowStockPage from "./pages/inventory/LowStockPage";
import MainLayout from "./layouts/MainLayout";
import VehiclePage from "./pages/vehicles/VehiclePage";
import UserPage from "./pages/users/UserPage";
import WorkOrderPage from "./pages/work-orders/WorkOrderPage";
import DashboardPage from "./pages/reports/DashboardPage";

const PrivateRoute = ({ children }: any) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/"
          element={
            <PrivateRoute>
              <MainLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<DashboardPage />} />

          <Route path="customers" element={<CustomerPage />} />
          <Route path="customers/:id" element={<CustomerDetail />} />

          <Route path="inventory" element={<InventoryPage />} />
          <Route path="inventory/logs" element={<InventoryLogPage />} />
          <Route path="inventory/low-stock" element={<LowStockPage />} />

          <Route path="vehicles" element={<VehiclePage />} />
          <Route path="users" element={<UserPage />} />
          <Route path="work-orders" element={<WorkOrderPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
