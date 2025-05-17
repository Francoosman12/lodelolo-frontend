import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Container } from "react-bootstrap"; // ✅ Importamos Container
import "bootstrap/dist/css/bootstrap.min.css";
import NavigationBar from "./components/NavigationBar";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import AddProduct from "./pages/AddProduct";
import ProductList from "./pages/ProductList";
import Inventory from "./pages/Inventory";
import Users from "./pages/Users";
import CreateUser from "./pages/CreateUser";
import Schedules from "./pages/Schedules";
import Attendance from "./pages/Attendance";
import Sales from "./pages/Sales";
import Settings from "./pages/Settings";
import Footer from "./components/Footer";

const App = () => {
  return (
    <Router>
      <NavigationBar />
      <Container className="mt-4">
        {" "}
        {/* ✅ Márgenes laterales */}
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/add" element={<AddProduct />} />
          <Route path="/products/list" element={<ProductList />} />
          <Route path="/products/inventory" element={<Inventory />} />
          <Route path="/users" element={<Users />} />
          <Route path="/users/create" element={<CreateUser />} />
          <Route path="/users/schedules" element={<Schedules />} />
          <Route path="/users/attendance" element={<Attendance />} />
          <Route path="/sales" element={<Sales />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Container>
      <Footer />
    </Router>
  );
};

export default App;
