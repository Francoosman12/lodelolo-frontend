import React from "react";
import {
  Button,
  Container,
  Form,
  Nav,
  Navbar,
  NavDropdown,
  Offcanvas,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  FaHome,
  FaBoxOpen,
  FaShoppingCart,
  FaCog,
  FaUsers,
  FaChevronDown,
} from "react-icons/fa"; // ✅ Importar íconos
import "../styles/NavigationBar.css"; // ✅ Importación de estilos
import logo from "../assets/devos.png"; // ✅ Importar el logo

const NavigationBar = () => {
  return (
    <Navbar
      expand="lg"
      style={{ backgroundColor: "#1D3557" }}
      className="mb-3 fixed-top"
    >
      <Container fluid className="d-flex justify-content-between">
        <div className="d-flex justify-content-between align-items-center w-100">
          <Navbar.Toggle
            aria-controls="offcanvasNavbar"
            style={{
              borderColor: "#A8DADC",
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              flexShrink: 0,
              width: "auto",
            }}
          />
          <Navbar.Brand
            as={Link}
            to="/"
            className="p-1"
            style={{ color: "#ffffff" }}
          >
            <div className="d-flex align-items-center gap-1">
              {" "}
              <img className="logo" src={logo} alt="" />
              <h2>DevOs</h2>
            </div>
          </Navbar.Brand>
        </div>

        <Navbar.Offcanvas
          id="offcanvasNavbar"
          aria-labelledby="offcanvasNavbarLabel"
          placement="end"
          className="bg-dark text-white"
          style={{ backgroundColor: "#242424" }}
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title
              id="offcanvasNavbarLabel"
              style={{ color: "#A8DADC" }}
            >
              Menú de Navegación
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Nav className="justify-content-end flex-grow-1 pe-3">
              <Nav.Link
                as={Link}
                to="/sales"
                style={{
                  color: "#ffffff",
                  backgroundColor: "#dc3545" /* 🔥 Fondo rojo intenso */,
                  border:
                    "2px solid #ffffff" /* ✅ Borde blanco para contraste */,
                  padding: "8px 12px" /* ✅ Mejor espaciado */,
                  borderRadius: "8px" /* ✅ Bordes redondeados */,
                  fontWeight: "bold" /* ✅ Texto más fuerte */,
                  transition: "0.3s ease-in-out" /* ✅ Animación suave */,
                }}
              >
                <span className="d-flex align-items-center gap-2">
                  <FaShoppingCart /> Vender
                </span>
              </Nav.Link>
              <Nav.Link as={Link} to="/" style={{ color: "#ffffff" }}>
                <span className="d-flex align-items-center gap-2">
                  <FaHome /> Inicio
                </span>
              </Nav.Link>

              <NavDropdown
                title={
                  <span className="d-flex align-items-center gap-2">
                    <FaBoxOpen /> Productos <FaChevronDown />
                  </span>
                }
                id="products-dropdown"
                style={{ color: "#ffffff" }}
              >
                <NavDropdown.Item
                  as={Link}
                  to="/products/add"
                  style={{ color: "#213547" }}
                >
                  <span className="d-flex align-items-center gap-2">
                    ➕ Agregar Producto
                  </span>
                </NavDropdown.Item>
                <NavDropdown.Item
                  as={Link}
                  to="/products/list"
                  style={{ color: "#213547" }}
                >
                  <span className="d-flex align-items-center gap-2">
                    📦 Mis Productos
                  </span>
                </NavDropdown.Item>
                <NavDropdown.Item
                  as={Link}
                  to="/products/inventory"
                  style={{ color: "#213547" }}
                >
                  <span className="d-flex align-items-center gap-2">
                    📊 Inventario
                  </span>
                </NavDropdown.Item>
              </NavDropdown>

              <NavDropdown
                title={
                  <span className="d-flex align-items-center gap-2">
                    <FaUsers /> Usuarios <FaChevronDown />
                  </span>
                }
                id="users-dropdown"
                style={{ color: "#ffffff" }}
              >
                <NavDropdown.Item
                  as={Link}
                  to="/users/create"
                  style={{ color: "#213547" }}
                >
                  <span className="d-flex align-items-center gap-2">
                    👤 Crear Usuario
                  </span>
                </NavDropdown.Item>
                <NavDropdown.Item
                  as={Link}
                  to="/users/schedules"
                  style={{ color: "#213547" }}
                >
                  <span className="d-flex align-items-center gap-2">
                    ⏳ Horarios
                  </span>
                </NavDropdown.Item>
                <NavDropdown.Item
                  as={Link}
                  to="/users/attendance"
                  style={{ color: "#213547" }}
                >
                  <span className="d-flex align-items-center gap-2">
                    ✅ Asistencias
                  </span>
                </NavDropdown.Item>
              </NavDropdown>

              <NavDropdown
                title={
                  <span className="d-flex align-items-center gap-2">
                    <FaShoppingCart /> Ventas <FaChevronDown />
                  </span>
                }
                id="sales-dropdown"
                style={{ color: "#ffffff" }}
              >
                <NavDropdown.Item
                  as={Link}
                  to="/sales/reports"
                  style={{ color: "#213547" }}
                >
                  <span className="d-flex align-items-center gap-2">
                    📊 Reportes
                  </span>
                </NavDropdown.Item>

                <NavDropdown.Item
                  as={Link}
                  to="/sales/history"
                  style={{ color: "#213547" }}
                >
                  <span className="d-flex align-items-center gap-2">
                    💰 Historial
                  </span>
                </NavDropdown.Item>

                <NavDropdown.Item
                  as={Link}
                  to="/sales/commissions"
                  style={{ color: "#213547" }}
                >
                  <span className="d-flex align-items-center gap-2">
                    💲 Comisiones
                  </span>
                </NavDropdown.Item>
              </NavDropdown>

              <Nav.Link as={Link} to="/settings" style={{ color: "#ffffff" }}>
                <span className="d-flex align-items-center gap-2">
                  <FaCog /> Configuración
                </span>
              </Nav.Link>
            </Nav>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
