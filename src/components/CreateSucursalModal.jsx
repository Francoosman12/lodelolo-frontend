import { Modal, Button, Form } from "react-bootstrap";
import { useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const CreateSucursalModal = ({ show, onHide, onAdded }) => {
  const [form, setForm] = useState({
    nombre: "",
    direccion: "",
    telefono: "",
    horario_atencion: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await axios.post(`${API_URL}/sucursales`, form); // ✅ ruta corregida
      onAdded(); // refrescar tabla
      onHide();
    } catch (error) {
      console.error("❌ Error al agregar sucursal:", error.message);
      alert("No se pudo crear la sucursal.");
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>➕ Agregar sucursal</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Control
            name="nombre"
            placeholder="Nombre"
            value={form.nombre}
            onChange={handleChange}
          />
          <Form.Control
            name="direccion"
            placeholder="Dirección"
            className="mt-2"
            value={form.direccion}
            onChange={handleChange}
          />
          <Form.Control
            name="telefono"
            placeholder="Teléfono"
            className="mt-2"
            value={form.telefono}
            onChange={handleChange}
          />
          <Form.Control
            name="horario_atencion"
            placeholder="Horario de atención"
            className="mt-2"
            value={form.horario_atencion}
            onChange={handleChange}
          />
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Guardar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateSucursalModal;
