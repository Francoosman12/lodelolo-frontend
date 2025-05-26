import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import NavigationBar from "./components/NavigationBar";
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
import Footer from "./components/Footer";
import "bootstrap/dist/css/bootstrap.min.css"; // ✅ Asegura que Bootstrap está presente

const App = () => {
  const [user, setUser] = useState(() => {
    return JSON.parse(localStorage.getItem("user")) || null;
  });

  // ✅ Mantener sesión activa y verificar usuario al iniciar
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // ✅ Guardar usuario en `localStorage` cuando cambia
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user"); // ✅ Eliminar `user` si es `null`
    }
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem("user"); // ✅ Eliminar usuario del Local Storage
    setUser(null); // ✅ Limpiar estado del usuario
  };

  return (
    <Router>
      {user && <NavigationBar user={user} setUser={handleLogout} />}{" "}
      {/* ✅ Navbar solo si hay usuario */}
      <Routes>
        {/* ✅ Página de login */}
        <Route path="/login" element={<Login setUser={setUser} />} />

        {/* ✅ Redirigir a `/login` si el usuario no está autenticado */}
        <Route path="/" element={user ? <Sales /> : <Navigate to="/login" />} />
        <Route
          path="/dashboard"
          element={user ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/sales/reports"
          element={user ? <Reports /> : <Navigate to="/login" />}
        />
        <Route
          path="/sales/history"
          element={user ? <History /> : <Navigate to="/login" />}
        />
        <Route
          path="/sales/commissions"
          element={user ? <Commissions /> : <Navigate to="/login" />}
        />

        {/* ✅ Solo los administradores pueden acceder a productos */}
        <Route
          path="/products/add"
          element={
            user && user.rol === "administrador" ? (
              <AddProduct />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/products/list"
          element={
            user && user.rol === "administrador" ? (
              <ProductList />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/products/inventory"
          element={
            user && user.rol === "administrador" ? (
              <Inventory />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        {/* ✅ Solo los administradores pueden acceder a usuarios */}
        <Route
          path="/users/create"
          element={
            user && user.rol === "administrador" ? (
              <CreateUser />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/users/schedules"
          element={
            user && user.rol === "administrador" ? (
              <Schedules />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/users/attendance"
          element={
            user && user.rol === "administrador" ? (
              <Attendance />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        {/* ✅ Solo los administradores pueden acceder a configuración */}
        <Route
          path="/settings"
          element={
            user && user.rol === "administrador" ? (
              <Settings />
            ) : (
              <Navigate to="/" />
            )
          }
        />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
