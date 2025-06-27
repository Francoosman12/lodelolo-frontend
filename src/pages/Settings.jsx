import React, { useState } from "react";
import { Container, Tab, Row, Col, Nav } from "react-bootstrap";

const Settings = () => {
  const [key, setKey] = useState("sucursales");

  return (
    <Container className="my-4 mt-5 mb-5 pt-5 pb-5">
      <h1 className="text-3xl font-bold text-primary mb-3">⚙️ Configuración</h1>
      <p className="text-muted mb-4">
        Aquí puedes modificar las diferentes configuraciones del sistema.
      </p>

      <Tab.Container activeKey={key} onSelect={(k) => setKey(k)}>
        <Row>
          <Col md={12}>
            <Nav variant="tabs" className="mb-3 justify-content-center">
              <Nav.Item>
                <Nav.Link eventKey="sucursales">🏢 Sucursales</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="productos">📦 Productos</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="ventas">🧾 Ventas</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="usuarios">👥 Usuarios</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="etiquetas">🏷️ Etiquetas</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="otros">🛠️ Otros</Nav.Link>
              </Nav.Item>
            </Nav>

            <Tab.Content>
              <Tab.Pane eventKey="sucursales">
                {/* Aquí va el contenido de la sección Sucursales */}
                <p>Configuración de sucursales.</p>
              </Tab.Pane>
              <Tab.Pane eventKey="productos">
                <p>Configuración de productos.</p>
              </Tab.Pane>
              <Tab.Pane eventKey="ventas">
                <p>Configuración de ventas.</p>
              </Tab.Pane>
              <Tab.Pane eventKey="usuarios">
                <p>Configuración de usuarios.</p>
              </Tab.Pane>
              <Tab.Pane eventKey="etiquetas">
                <p>Configuración de etiquetas.</p>
              </Tab.Pane>
              <Tab.Pane eventKey="otros">
                <p>Configuración avanzada u otras opciones.</p>
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </Container>
  );
};

export default Settings;
