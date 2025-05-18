import React, { useState, useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/ScheduleForm.css";

const API_URL = import.meta.env.VITE_API_URL;

const ScheduleForm = ({ refreshSchedules }) => {
  const [usuarios, setUsuarios] = useState([]);
  const [formData, setFormData] = useState({
    usuario: "",
    fechaInicio: new Date(),
    fechaFin: new Date(),
    horaEntrada: "08:00", // ✅ Ahora inicia con un valor válido
    horaSalida: "17:00",
    tipoPeriodo: "diario",
    zonaHoraria: "America/Mexico_City",
  });

  // ✅ Obtener lista de usuarios
  useEffect(() => {
    axios
      .get(`${API_URL}/users`)
      .then((res) => setUsuarios(res.data))
      .catch((err) => console.error("❌ Error al obtener usuarios:", err));
  }, []);

  // ✅ Manejo de cambios en el formulario
  const handleChange = (name, value) => {
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // ✅ Manejo de cambios para inputs de hora
  const handleTimeChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // ✅ Enviar datos al backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/schedules`, {
        ...formData,
        fechaInicio: formData.fechaInicio.toISOString(),
        fechaFin: formData.fechaFin.toISOString(),
      });
      alert("✅ Horario agregado correctamente!");
      refreshSchedules();

      // ✅ Resetear el formulario después de guardar
      setFormData({
        usuario: "",
        fechaInicio: new Date(),
        fechaFin: new Date(),
        horaEntrada: "08:00",
        horaSalida: "17:00",
        tipoPeriodo: "diario",
        zonaHoraria: "America/Mexico_City",
      });
    } catch (error) {
      console.error("❌ Error al agregar horario:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="schedule-form">
      <h3>📅 Agregar Horario</h3>

      <label>Usuario:</label>
      <select
        name="usuario"
        value={formData.usuario}
        onChange={(e) => handleChange("usuario", e.target.value)}
        required
      >
        <option value="">Selecciona un usuario</option>
        {usuarios.map((user) => (
          <option key={user._id} value={user._id}>
            {user.nombre}
          </option>
        ))}
      </select>

      <label>Fecha Inicio:</label>
      <DatePicker
        selected={formData.fechaInicio}
        onChange={(date) => handleChange("fechaInicio", date)}
        dateFormat="yyyy-MM-dd"
      />

      <label>Fecha Fin:</label>
      <DatePicker
        selected={formData.fechaFin}
        onChange={(date) => handleChange("fechaFin", date)}
        dateFormat="yyyy-MM-dd"
      />

      <label>Hora Entrada:</label>
      <input
        type="time"
        name="horaEntrada"
        value={formData.horaEntrada}
        onChange={handleTimeChange} // ✅ Corrección aquí
        required
      />

      <label>Hora Salida:</label>
      <input
        type="time"
        name="horaSalida"
        value={formData.horaSalida}
        onChange={handleTimeChange} // ✅ Corrección aquí
        required
      />

      <label>Tipo de Periodo:</label>
      <select
        name="tipoPeriodo"
        value={formData.tipoPeriodo}
        onChange={(e) => handleChange("tipoPeriodo", e.target.value)}
        required
      >
        <option value="diario">Diario</option>
        <option value="semanal">Semanal</option>
        <option value="mensual">Mensual</option>
      </select>

      <label>Zona Horaria:</label>
      <input
        type="text"
        name="zonaHoraria"
        value={formData.zonaHoraria}
        onChange={(e) => handleChange("zonaHoraria", e.target.value)}
        required
      />

      <button type="submit">✅ Guardar Horario</button>
    </form>
  );
};

export default ScheduleForm;
