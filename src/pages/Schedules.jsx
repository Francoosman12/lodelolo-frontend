import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import axios from "axios";
import ScheduleForm from "../components/ScheduleForm";
import ScheduleEditForm from "../components/ScheduleEditForm"; // ✅ Importar el nuevo componente

const API_URL = import.meta.env.VITE_API_URL;

const Schedules = () => {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const refreshSchedules = () => {
    axios
      .get(`${API_URL}/schedules`)
      .then((res) => {
        const formattedEvents = res.data.map((schedule) => ({
          id: schedule._id,
          title: `${schedule.usuario?.nombre || "Usuario desconocido"} (${
            schedule.tipoPeriodo
          })`, // ✅ Previene el error
          start: new Date(schedule.fechaInicio).toISOString().split("T")[0],
          end: new Date(
            new Date(schedule.fechaFin).setDate(
              new Date(schedule.fechaFin).getDate() + 1
            )
          )
            .toISOString()
            .split("T")[0],
          backgroundColor:
            schedule.tipoPeriodo === "diario"
              ? "blue"
              : schedule.tipoPeriodo === "semanal"
              ? "green"
              : "red",
          extendedProps: {
            usuario: schedule.usuario || { nombre: "Usuario desconocido" }, // ✅ Agrega un fallback si es `null`
            tipoPeriodo: schedule.tipoPeriodo,
          },
        }));
        setEvents(formattedEvents);
      })
      .catch((err) => console.error("❌ Error al obtener horarios:", err));
  };

  useEffect(() => {
    refreshSchedules();
  }, []);

  // ✅ Manejar clic en evento del calendario y abrir modal
  const handleEventClick = (event) => {
    setSelectedEvent(event.event);
    setShowModal(true);
  };

  return (
    <Container className="my-4 mt-5 mb-5 pt-5 pb-5 schedule-container">
      <h1>Horarios</h1>
      <p>Gestión de horarios de usuarios.</p>

      <Row className="justify-content-center">
        <Col sm={4} className="schedule-form-column">
          <ScheduleForm refreshSchedules={refreshSchedules} />
        </Col>

        <Col sm={8} className="schedule-calendar-column">
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={events}
            selectable={true}
            editable={true}
            eventClick={handleEventClick}
            eventClassNames={() => "custom-event"}
            dayHeaderContent={(arg) => {
              return (
                <span
                  style={{
                    color: "white",
                    backgroundColor: "#1D3557",
                    padding: "6px",
                    borderRadius: "5px",
                  }}
                >
                  {arg.text}
                </span>
              );
            }}
          />
        </Col>
      </Row>

      {/* ✅ Componente del formulario de edición */}
      <ScheduleEditForm
        showModal={showModal}
        setShowModal={setShowModal}
        eventData={selectedEvent}
        refreshSchedules={refreshSchedules}
      />
    </Container>
  );
};

export default Schedules;
