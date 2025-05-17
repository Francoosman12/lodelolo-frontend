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
import "../styles/NavigationBar.css"; // ✅ Importación de estilos

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
              flexShrink: 0, // ✅ Evita que el botón se agrande
              width: "auto", // ✅ Ajusta el ancho automáticamente
            }}
          />
          <Navbar.Brand
            as={Link}
            to="/"
            className="p-2"
            style={{ color: "#ffffff" }}
          >
            Dashboard
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
              <Nav.Link as={Link} to="/" style={{ color: "#ffffff" }}>
                Inicio
              </Nav.Link>
              <NavDropdown
                title="Productos"
                id="products-dropdown"
                style={{ color: "#ffffff" }}
              >
                <NavDropdown.Item
                  as={Link}
                  to="/products/add"
                  style={{ color: "#213547" }}
                >
                  Agregar Producto
                </NavDropdown.Item>
                <NavDropdown.Item
                  as={Link}
                  to="/products/list"
                  style={{ color: "#213547" }}
                >
                  Mis Productos
                </NavDropdown.Item>
                <NavDropdown.Item
                  as={Link}
                  to="/products/inventory"
                  style={{ color: "#213547" }}
                >
                  Inventario
                </NavDropdown.Item>
              </NavDropdown>
              <NavDropdown
                title="Usuarios"
                id="users-dropdown"
                style={{ color: "#ffffff" }}
              >
                <NavDropdown.Item
                  as={Link}
                  to="/users/create"
                  style={{ color: "#213547" }}
                >
                  Crear Usuario
                </NavDropdown.Item>
                <NavDropdown.Item
                  as={Link}
                  to="/users/schedules"
                  style={{ color: "#213547" }}
                >
                  Horarios
                </NavDropdown.Item>
                <NavDropdown.Item
                  as={Link}
                  to="/users/attendance"
                  style={{ color: "#213547" }}
                >
                  Asistencias
                </NavDropdown.Item>
              </NavDropdown>
              <Nav.Link as={Link} to="/sales" style={{ color: "#ffffff" }}>
                Ventas
              </Nav.Link>
              <Nav.Link as={Link} to="/settings" style={{ color: "#ffffff" }}>
                Configuración
              </Nav.Link>
            </Nav>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
