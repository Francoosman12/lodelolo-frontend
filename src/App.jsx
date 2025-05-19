import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import NavigationBar from "./components/NavigationBar";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Sales from "./pages/Sales";
import Reports from "./pages/Reports";
import History from "./pages/History";
import Commissions from "./pages/Commissions";
import AddProduct from "./pages/AddProduct";
import ProductList from "./pages/ProductList";
import Inventory from "./pages/Inventory";
import CreateUser from "./pages/CreateUser";
import Schedules from "./pages/Schedules";
import Attendance from "./pages/Attendance";
import Settings from "./pages/Settings";

const App = () => {
  const [user, setUser] = useState(null);

  return (
    <Router>
      {user && <NavigationBar user={user} setUser={setUser} />}

      <Container className="mt-5">
        <Routes>
          <Route path="/" element={<Sales />} /> {/* ✅ Página de inicio */}
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/sales" element={<Sales />} />
          <Route path="/sales/reports" element={<Reports />} />
          <Route path="/sales/history" element={<History />} />
          <Route path="/sales/commissions" element={<Commissions />} />
          <Route path="/products/add" element={<AddProduct />} />
          <Route path="/products/list" element={<ProductList />} />
          <Route path="/products/inventory" element={<Inventory />} />
          <Route path="/users/create" element={<CreateUser />} />
          <Route path="/users/schedules" element={<Schedules />} />
          <Route path="/users/attendance" element={<Attendance />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Container>

      {user && <Footer />}
    </Router>
  );
};

export default App;
