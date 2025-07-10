import { useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import AgregarSucursalModal from "./CreateSucursalModal";
import EditarSucursalModal from "./EditSucursalModal";

const API_URL = import.meta.env.VITE_API_URL;

const SucursalList = () => {
  const [sucursales, setSucursales] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [sucursalActual, setSucursalActual] = useState(null);

  const cargarSucursales = async () => {
    try {
      const res = await axios.get(`${API_URL}/sucursales`);
      // 🔍 Manejo flexible del formato de respuesta
      const data = Array.isArray(res.data)
        ? res.data
        : res.data.sucursales || [];
      setSucursales(data);
    } catch (error) {
      console.error("❌ Error al cargar sucursales:", error.message);
      setSucursales([]); // prevenir errores de render
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar esta sucursal?")) return;
    try {
      await axios.delete(`${API_URL}/sucursales/${id}`);
      cargarSucursales();
    } catch (error) {
      console.error("❌ Error al eliminar sucursal:", error.message);
      alert("No se pudo eliminar la sucursal.");
    }
  };

  const handleEdit = (sucursal) => {
    setSucursalActual(sucursal);
    setShowEdit(true);
  };

  useEffect(() => {
    cargarSucursales();
  }, []);

  return (
    <>
      <Button className="mb-3" onClick={() => setShowAdd(true)}>
        ➕ Nueva sucursal
      </Button>

      <Table striped bordered hover responsive size="sm">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Dirección</th>
            <th>Teléfono</th>
            <th>Horario</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(sucursales) &&
            sucursales.map((s) => (
              <tr key={s._id}>
                <td>{s.nombre}</td>
                <td>{s.direccion}</td>
                <td>{s.telefono}</td>
                <td>{s.horario_atencion}</td>
                <td>
                  <div className="d-flex gap-1">
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => handleEdit(s)}
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

      <AgregarSucursalModal
        show={showAdd}
        onHide={() => setShowAdd(false)}
        onAdded={cargarSucursales}
      />

      <EditarSucursalModal
        show={showEdit}
        onHide={() => setShowEdit(false)}
        sucursal={sucursalActual}
        onUpdated={cargarSucursales}
      />
    </>
  );
};

export default SucursalList;
