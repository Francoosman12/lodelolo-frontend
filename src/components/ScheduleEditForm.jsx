import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";
import "../styles/ScheduleEditForm.css"; // ✅ Importar estilos

const API_URL = import.meta.env.VITE_API_URL;

const ScheduleEditForm = ({
  showModal,
  setShowModal,
  eventData,
  refreshSchedules,
}) => {
  const [usuarios, setUsuarios] = useState([]);
  const [formData, setFormData] = useState({
    usuario: "",
    fechaInicio: "",
    fechaFin: "",
    tipoPeriodo: "diario",
  });

  useEffect(() => {
    axios
      .get(`${API_URL}/users`)
      .then((res) => setUsuarios(res.data))
      .catch((err) => console.error("❌ Error al obtener usuarios:", err));

    if (eventData) {
      setFormData({
        usuario: eventData.extendedProps.usuario._id,
        fechaInicio: eventData.startStr.split("T")[0],
        fechaFin: eventData.endStr.split("T")[0],
        tipoPeriodo: eventData.extendedProps.tipoPeriodo,
      });
    }
  }, [eventData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSaveChanges = async () => {
    try {
      await axios.put(`${API_URL}/schedules/${eventData.id}`, formData);
      alert("✅ Horario actualizado!");
      refreshSchedules();
      setShowModal(false);
    } catch (error) {
      console.error("❌ Error al actualizar horario:", error);
    }
  };

  const handleDeleteSchedule = async () => {
    if (window.confirm("¿Seguro que quieres eliminar este horario?")) {
      try {
        await axios.delete(`${API_URL}/schedules/${eventData.id}`);
        alert("✅ Horario eliminado correctamente!");
        refreshSchedules(); // ✅ Actualizar la lista de horarios
        setShowModal(false); // ✅ Cerrar el modal
      } catch (error) {
        console.error("❌ Error al eliminar horario:", error);
        alert("⚠️ Hubo un problema al eliminar el horario.");
      }
    }
  };

  return (
    <Modal
      show={showModal}
      onHide={() => setShowModal(false)}
      className="schedule-edit-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title>Editar Horario</Modal.Title>
      </Modal.Header>
      <Modal.Body className="schedule-edit-form">
        <label>Fecha Inicio:</label>
        <input
          type="date"
          name="fechaInicio"
          value={formData.fechaInicio}
          onChange={handleChange}
        />

        <label>Fecha Fin:</label>
        <input
          type="date"
          name="fechaFin"
          value={formData.fechaFin}
          onChange={handleChange}
        />

        <label>Tipo de Periodo:</label>
        <select
          name="tipoPeriodo"
          value={formData.tipoPeriodo}
          onChange={handleChange}
        >
          <option value="diario">Diario</option>
          <option value="semanal">Semanal</option>
          <option value="mensual">Mensual</option>
        </select>

        <label>Usuario:</label>
        <select name="usuario" value={formData.usuario} onChange={handleChange}>
          {usuarios.map((user) => (
            <option key={user._id} value={user._id}>
              {user.nombre}
            </option>
          ))}
        </select>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={handleDeleteSchedule}>
          🗑 Eliminar Horario
        </Button>

        <Button variant="primary" onClick={handleSaveChanges}>
          Guardar Cambios
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ScheduleEditForm;
