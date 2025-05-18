import React, { useState, useEffect } from "react";
import { Modal, Form, Button, Row, Col, Alert } from "react-bootstrap";
import axios from "axios";
import "../styles/EditUserModal.css"; // ✅ Importar estilos

const API_URL = import.meta.env.VITE_API_URL;

const EditUserModal = ({ show, handleClose, user, refreshUsers }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    edad: "",
    sexo: "",
    direccion: "",
    rol: "",
    sucursal: "",
    activo: true,
  });

  const [error, setError] = useState("");
  const [sucursales, setSucursales] = useState([]);

  useEffect(() => {
    if (user) {
      setFormData({
        nombre: user.nombre || "",
        email: user.email || "",
        telefono: user.telefono || "",
        edad: user.edad || "",
        sexo: user.sexo || "",
        direccion: user.direccion || "",
        rol: user.rol || "",
        sucursal: user.sucursal?._id || "", // ✅ Asegurar que sea un ID válido
        activo: user.activo !== undefined ? user.activo : true, // ✅ Evitar valores undefined
      });
    }

    axios
      .get(`${API_URL}/sucursales`)
      .then((res) => setSucursales(res.data))
      .catch((err) => console.error("❌ Error al obtener sucursales:", err));
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value, // ✅ Manejar correctamente checkbox
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?._id) {
      setError("⚠️ Error: No se encontró el ID del usuario.");
      return;
    }

    try {
      const response = await axios.put(
        `${API_URL}/users/${user._id}`,
        formData
      );
      alert("✅ Usuario actualizado correctamente!");
      refreshUsers(); // ✅ Refrescar la lista de usuarios
      handleClose(); // ✅ Cerrar el modal
    } catch (error) {
      console.error("❌ Error al actualizar usuario:", error);
      setError(
        error.response?.data?.message ||
          "Hubo un problema al actualizar el usuario."
      );
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Editar Usuario</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Row>
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
            </Col>

            <Col xs={12} md={6}>
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

          <Button variant="primary" type="submit">
            Guardar Cambios
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EditUserModal;
