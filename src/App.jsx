import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Container } from "react-bootstrap"; // ✅ Importamos Container
import "bootstrap/dist/css/bootstrap.min.css";
import NavigationBar from "./components/NavigationBar";
import Footer from "./components/Footer";
import Sales from "./pages/Sales";
import Dashboard from "./pages/Dashboard";

import AddProduct from "./pages/AddProduct";
import ProductList from "./pages/ProductList";
import Inventory from "./pages/Inventory";

import CreateUser from "./pages/CreateUser";
import Schedules from "./pages/Schedules";
import Attendance from "./pages/Attendance";

import Reports from "./pages/Reports"; // ✅ Agregar Reportes
import History from "./pages/History"; // ✅ Agregar Historial
import Commissions from "./pages/Commissions"; // ✅ Agregar Comisiones
import Settings from "./pages/Settings";

const App = () => {
  return (
    <Router>
      <NavigationBar />
      <Container className="mt-4">
        <Routes>
          <Route path="/sales" element={<Sales />} />
          <Route path="/" element={<Dashboard />} />

          {/* ✅ Sección de Productos */}
          <Route path="/products/add" element={<AddProduct />} />
          <Route path="/products/list" element={<ProductList />} />
          <Route path="/products/inventory" element={<Inventory />} />

          {/* ✅ Sección de Usuarios */}
          <Route path="/users/create" element={<CreateUser />} />
          <Route path="/users/schedules" element={<Schedules />} />
          <Route path="/users/attendance" element={<Attendance />} />

          {/* ✅ Sección de Ventas */}
          <Route path="/sales/reports" element={<Reports />} />
          <Route path="/sales/history" element={<History />} />
          <Route path="/sales/commissions" element={<Commissions />} />

          {/* ✅ Configuración */}
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Container>
      <Footer />
    </Router>
  );
};

export default App;
