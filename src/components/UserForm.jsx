import React, { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
import axios from "axios";
import "../styles/UserForm.css"; // ✅ Importar estilos

const API_URL = import.meta.env.VITE_API_URL;

const UserForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    edad: "",
    sexo: "",
    direccion: "",
    contrasena: "",
    repetirContrasena: "", // ✅ Nuevo campo
    rol: "vendedor",
    sucursal: "",
  });

  const [sucursales, setSucursales] = useState([]);
  const [error, setError] = useState(""); // ✅ Estado para manejar errores

  useEffect(() => {
    axios.get(`${API_URL}/sucursales`).then((res) => setSucursales(res.data));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const telefonoRegex = /^\d{10}$/;
    if (!telefonoRegex.test(formData.telefono)) {
      setError("El número de teléfono debe tener exactamente 10 dígitos.");
      return;
    }

    if (formData.contrasena !== formData.repetirContrasena) {
      setError("Las contraseñas no coinciden. Verifica nuevamente.");
      return;
    }

    setError(""); // ✅ Limpiar errores antes de enviar

    onSubmit(formData); // ✅ Enviar los datos al backend

    // ✅ Restablecer el formulario después del registro exitoso
    setFormData({
      nombre: "",
      email: "",
      telefono: "",
      edad: "",
      sexo: "",
      direccion: "",
      contrasena: "",
      repetirContrasena: "",
      rol: "vendedor",
      sucursal: "",
    });
  };

  return (
    <Container className="user-form-container">
      <h2 className="text-center">Crear Usuario</h2>
      <Form onSubmit={handleSubmit} className="user-form">
        {error && <Alert variant="danger">{error}</Alert>}{" "}
        {/* ✅ Mostrar error si las contraseñas no coinciden */}
        <Row>
          {/* ✅ Primera columna */}
          <Col xs={12} md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Teléfono</Form.Label>
              <Form.Control
                type="text"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Edad</Form.Label>
              <Form.Control
                type="number"
                name="edad"
                value={formData.edad}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Sexo</Form.Label>
              <Form.Select
                name="sexo"
                value={formData.sexo}
                onChange={handleChange}
              >
                <option value="">Selecciona una opción</option>
                <option value="masculino">Masculino</option>
                <option value="femenino">Femenino</option>
                <option value="otro">Otro</option>
              </Form.Select>
            </Form.Group>
          </Col>

          {/* ✅ Segunda columna */}
          <Col xs={12} md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Dirección</Form.Label>
              <Form.Control
                type="text"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                name="contrasena"
                value={formData.contrasena}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Repetir Contraseña</Form.Label>
              <Form.Control
                type="password"
                name="repetirContrasena"
                value={formData.repetirContrasena}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Rol</Form.Label>
              <Form.Select
                name="rol"
                value={formData.rol}
                onChange={handleChange}
              >
                <option value="vendedor">Vendedor</option>
                <option value="administrador">Administrador</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Sucursal</Form.Label>
              <Form.Select
                name="sucursal"
                value={formData.sucursal}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Seleccione una sucursal
                </option>
                {sucursales.map((sucursal) => (
                  <option key={sucursal._id} value={sucursal._id}>
                    {sucursal.nombre}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
        <Button variant="primary" type="submit" className="btn-submit">
          Crear Usuario
        </Button>
      </Form>
    </Container>
  );
};

export default UserForm;
