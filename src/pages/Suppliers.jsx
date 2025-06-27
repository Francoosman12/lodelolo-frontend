import React, { useEffect, useState } from "react";
import { Table, Button, Form, Row, Col, Container } from "react-bootstrap";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import SupplierEditModal from "../components/SupplierEditModal";

const API_URL = import.meta.env.VITE_API_URL;

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [formData, setFormData] = useState({
    nombre: "",
    contacto: "",
    telefono: "",
    email: "",
    direccion: "",
    tipo: "insumos",
    observaciones: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const res = await axios.get(`${API_URL}/suppliers`);
      setSuppliers(res.data);
    } catch (err) {
      console.error("Error al cargar proveedores:", err);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/suppliers`, formData);
      fetchSuppliers();
      setFormData({
        nombre: "",
        contacto: "",
        telefono: "",
        email: "",
        direccion: "",
        tipo: "insumos",
        observaciones: "",
      });
    } catch (err) {
      console.error("Error al crear proveedor:", err);
    }
  };

  const handleToggleActivo = async (id, estado) => {
    try {
      await axios.put(`${API_URL}/suppliers/${id}`, { activo: !estado });
      fetchSuppliers();
    } catch (err) {
      console.error("Error al cambiar estado:", err);
    }
  };

  const handleDelete = async (id) => {
    if (confirm("¿Seguro que deseas eliminar este proveedor?")) {
      try {
        await axios.delete(`${API_URL}/suppliers/${id}`);
        fetchSuppliers();
      } catch (err) {
        console.error("Error al eliminar:", err);
      }
    }
  };

  return (
    <Container className="my-4 mt-5 mb-5 pt-5 pb-5">
      <h2 className="text-success mb-4">💼 Proveedores</h2>

      {/* Formulario de alta */}
      <Form onSubmit={handleCreate} className="mb-4">
        <Row className="g-3">
          <Col md={4}>
            <Form.Control
              placeholder="Nombre *"
              required
              value={formData.nombre}
              onChange={(e) =>
                setFormData({ ...formData, nombre: e.target.value })
              }
            />
          </Col>
          <Col md={4}>
            <Form.Control
              placeholder="Contacto"
              value={formData.contacto}
              onChange={(e) =>
                setFormData({ ...formData, contacto: e.target.value })
              }
            />
          </Col>
          <Col md={4}>
            <Form.Control
              placeholder="Teléfono"
              value={formData.telefono}
              onChange={(e) =>
                setFormData({ ...formData, telefono: e.target.value })
              }
            />
          </Col>
          <Col md={4}>
            <Form.Control
              placeholder="Email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </Col>
          <Col md={4}>
            <Form.Control
              placeholder="Dirección"
              value={formData.direccion}
              onChange={(e) =>
                setFormData({ ...formData, direccion: e.target.value })
              }
            />
          </Col>
          <Col md={4}>
            <Form.Select
              value={formData.tipo}
              onChange={(e) =>
                setFormData({ ...formData, tipo: e.target.value })
              }
            >
              <option value="insumos">Insumos</option>
              <option value="logística">Logística</option>
              <option value="tecnología">Tecnología</option>
              <option value="otro">Otro</option>
            </Form.Select>
          </Col>
          <Col md={12}>
            <Form.Control
              as="textarea"
              rows={2}
              placeholder="Observaciones"
              value={formData.observaciones}
              onChange={(e) =>
                setFormData({ ...formData, observaciones: e.target.value })
              }
            />
          </Col>
          <Col>
            <Button type="submit" variant="success">
              Crear proveedor
            </Button>
          </Col>
        </Row>
      </Form>

      {/* Tabla */}
      <Table bordered hover responsive>
        <thead className="table-success text-center">
          <tr>
            <th>Nombre</th>
            <th>Contacto</th>
            <th>Teléfono</th>
            <th>Email</th>
            <th>Dirección</th>
            <th>Tipo</th>
            <th>Activo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody className="align-middle text-center">
          {suppliers.map((s) => (
            <tr key={s._id}>
              <td>{s.nombre}</td>
              <td>{s.contacto}</td>
              <td>{s.telefono}</td>
              <td>{s.email}</td>
              <td>{s.direccion}</td>
              <td>{s.tipo}</td>
              <td>
                <Form.Check
                  type="switch"
                  id={`switch-activo-${s._id}`}
                  checked={s.activo}
                  onChange={() => handleToggleActivo(s._id, s.activo)}
                />
              </td>
              <td>
                <div className="d-flex justify-content-center gap-1">
                  <Button
                    size="sm"
                    variant="success"
                    onClick={() => {
                      setEditData(s); // s = proveedor a editar
                      setShowModal(true);
                    }}
                  >
                    <FaEdit />
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(s._id)}
                  >
                    <FaTrash />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {editData && (
        <SupplierEditModal
          show={showModal}
          handleClose={() => setShowModal(false)}
          formData={editData}
          setFormData={setEditData}
          handleSave={async () => {
            try {
              await axios.put(`${API_URL}/suppliers/${editData._id}`, editData);
              fetchSuppliers();
              setShowModal(false);
            } catch (err) {
              console.error("Error al guardar cambios:", err);
            }
          }}
        />
      )}
    </Container>
  );
};

export default Suppliers;
