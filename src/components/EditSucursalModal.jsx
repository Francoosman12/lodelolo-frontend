import { Modal, Button, Form } from "react-bootstrap";
import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const EditSucursalModal = ({ show, onHide, sucursal, onUpdated }) => {
  const [form, setForm] = useState({
    nombre: "",
    direccion: "",
    telefono: "",
    horario_atencion: "",
  });

  useEffect(() => {
    if (sucursal) setForm(sucursal);
  }, [sucursal]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await axios.put(`${API_URL}/sucursales/${sucursal._id}`, form); // ✅ ruta actualizada
      onUpdated(); // Refrescar tabla
      onHide();
    } catch (error) {
      console.error("❌ Error al editar sucursal:", error.message);
      alert("No se pudo actualizar la sucursal.");
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>✏️ Editar sucursal</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Control
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
          />
          <Form.Control
            name="direccion"
            value={form.direccion}
            className="mt-2"
            onChange={handleChange}
          />
          <Form.Control
            name="telefono"
            value={form.telefono}
            className="mt-2"
            onChange={handleChange}
          />
          <Form.Control
            name="horario_atencion"
            value={form.horario_atencion}
            className="mt-2"
            onChange={handleChange}
          />
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Actualizar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditSucursalModal;
