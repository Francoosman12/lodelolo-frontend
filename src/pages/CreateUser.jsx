import React, { useState } from "react";
import UserForm from "../components/UserForm";
import UserList from "../components/UserList";
import { Container, Row, Col, Tab, Nav } from "react-bootstrap";
import "../styles/CreateUser.css";

const CreateUser = () => {
  const [key, setKey] = useState("formulario");

  return (
    <Container className="user-container mt-5 mb-5 pt-5 pb-5">
      <Tab.Container activeKey={key} onSelect={(k) => setKey(k)}>
        <Row className="justify-content-center">
          <Col xs={12}>
            {/* ✅ Navegación interna */}
            <Nav justify variant="tabs">
              <Nav.Item>
                <Nav.Link eventKey="formulario">📋 Crear Usuario</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="usuarios">👥 Usuarios</Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>

          <Col xs={12} className="mt-4">
            <Tab.Content>
              {/* ✅ Pestaña de formulario */}
              <Tab.Pane eventKey="formulario">
                <Row>
                  <Col xs={12} md={4} className="user-info">
                    <h2>📌 Información sobre Usuarios</h2>
                    <p>
                      Aquí puedes agregar nuevos usuarios al sistema. Recuerda
                      que los administradores tienen acceso total, mientras que
                      los vendedores tienen permisos limitados.
                    </p>
                    <p>
                      Para asignar un usuario a una sucursal, selecciona la
                      sucursal correspondiente en el formulario.
                    </p>
                  </Col>

                  <Col xs={12} md={8} className="user-form">
                    <UserForm />
                  </Col>
                </Row>
              </Tab.Pane>

              {/* ✅ Pestaña de lista de usuarios */}
              <Tab.Pane eventKey="usuarios">
                <UserList />
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </Container>
  );
};

export default CreateUser;
