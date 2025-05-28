import React from "react";
import {
  Button,
  Container,
  Nav,
  Navbar,
  NavDropdown,
  Offcanvas,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaBoxOpen,
  FaShoppingCart,
  FaCog,
  FaUsers,
  FaChevronDown,
  FaSignOutAlt,
} from "react-icons/fa";
import "../styles/NavigationBar.css"; // ✅ Importar estilos personalizados
import logo from "../assets/devos.png"; // ✅ Importar el logo

const NavigationBar = ({ user, setUser }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user"); // ✅ Eliminar usuario del localStorage
    setUser(null); // ✅ Limpiar estado del usuario
    navigate("/login"); // ✅ Redirigir al Login
  };

  const esAdmin = user?.rol === "administrador"; // ✅ Verificar si es administrador

  return (
    <Navbar expand="lg" className="navigation-bar fixed-top">
      <Container
        fluid
        className="d-flex justify-content-between align-items-center"
      >
        <div className="d-flex justify-content-between align-items-center w-100">
          <Navbar.Brand as={Link} to="/" className="p-1">
            <div className="d-flex align-items-center gap-1">
              <img className="logo" src={logo} alt="DevOs Logo" />
              <h2 style={{ color: "white" }}>DevOs</h2>
            </div>
          </Navbar.Brand>
          <Navbar.Toggle
            aria-controls="offcanvasNavbar"
            className="navbar-toggler"
          />
        </div>

        <Navbar.Offcanvas
          id="offcanvasNavbar"
          placement="end"
          className="offcanvas"
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title
              id="offcanvasNavbarLabel"
              className="offcanvas-title"
            >
              Menú de Navegación
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Nav className="navbar-nav justify-content-between flex-grow-1 pe-3">
              <Nav.Link
                as={Link}
                to="/"
                className="nav-link d-flex align-items-center gap-2"
              >
                <FaShoppingCart /> ¡Vender!
              </Nav.Link>

              <Nav.Link
                as={Link}
                to="/dashboard"
                className="nav-link d-flex align-items-center gap-2"
              >
                <FaHome /> Inicio
              </Nav.Link>

              {/* ✅ Solo los administradores pueden acceder a los productos */}
              {esAdmin && (
                <NavDropdown
                  title={
                    <span className="nav-link">
                      <FaBoxOpen /> Productos <FaChevronDown />
                    </span>
                  }
                  id="products-dropdown"
                >
                  <NavDropdown.Item
                    as={Link}
                    to="/products/add"
                    className="nav-dropdown-item"
                  >
                    ➕ Agregar Producto
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    as={Link}
                    to="/products/list"
                    className="nav-dropdown-item"
                  >
                    📦 Mis Productos
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    as={Link}
                    to="/products/inventory"
                    className="nav-dropdown-item"
                  >
                    📊 Inventario
                  </NavDropdown.Item>
                </NavDropdown>
              )}

              {/* ✅ Solo los administradores pueden acceder a usuarios */}
              {esAdmin && (
                <NavDropdown
                  title={
                    <span className="nav-link">
                      <FaUsers /> Usuarios <FaChevronDown />
                    </span>
                  }
                  id="users-dropdown"
                >
                  <NavDropdown.Item
                    as={Link}
                    to="/users/create"
                    className="nav-dropdown-item"
                  >
                    👤 Crear Usuario
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    as={Link}
                    to="/users/schedules"
                    className="nav-dropdown-item"
                  >
                    ⏳ Horarios
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    as={Link}
                    to="/users/attendance"
                    className="nav-dropdown-item"
                  >
                    ✅ Asistencias
                  </NavDropdown.Item>
                </NavDropdown>
              )}
              {esAdmin && (
                <NavDropdown
                  title={
                    <span className="nav-link">
                      <FaShoppingCart /> Ventas <FaChevronDown />
                    </span>
                  }
                  id="sales-dropdown"
                >
                  <NavDropdown.Item
                    as={Link}
                    to="/sales/reports"
                    className="nav-dropdown-item"
                  >
                    📊 Reportes
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    as={Link}
                    to="/sales/history"
                    className="nav-dropdown-item"
                  >
                    💰 Historial
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    as={Link}
                    to="/sales/commissions"
                    className="nav-dropdown-item"
                  >
                    💲 Comisiones
                  </NavDropdown.Item>
                </NavDropdown>
              )}

              {/* ✅ Solo los administradores pueden acceder a configuración */}
              {esAdmin && (
                <Nav.Link
                  as={Link}
                  to="/settings"
                  className="nav-link d-flex align-items-center gap-2"
                >
                  <FaCog /> Configuración
                </Nav.Link>
              )}
            </Nav>

            {user && (
              <Button
                onClick={handleLogout}
                className="nav-link logout-btn d-flex align-items-center gap-1"
              >
                <FaSignOutAlt /> Cerrar Sesión
              </Button>
            )}
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
