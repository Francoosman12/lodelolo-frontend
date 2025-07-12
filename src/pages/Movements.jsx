import React, { useState, useEffect } from "react";
import { Button, Container, Form } from "react-bootstrap";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import CreateMovementModal from "../components/CreateMovementModal";
import EditMovementModal from "../components/EditMovementModal";

const API = import.meta.env.VITE_API_URL;

const Movements = () => {
  const [movements, setMovements] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedMovement, setSelectedMovement] = useState(null);
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [turnoActivo, setTurnoActivo] = useState(false);
  const [inicioTurno, setInicioTurno] = useState(null);
  const [cronometro, setCronometro] = useState("00:00:00");

  const getUsuarioActual = () => {
    const raw = localStorage.getItem("user") || localStorage.getItem("usuario");
    return raw ? JSON.parse(raw) : null;
  };

  const usuarioActual = getUsuarioActual();
  const responsable = usuarioActual?._id;
  const sucursal = usuarioActual?.sucursal || null;

  const fetchMovements = async () => {
    try {
      const inicio = fechaInicio ? `${fechaInicio}T00:00:00.000Z` : "";
      const fin = fechaFin ? `${fechaFin}T23:59:59.999Z` : "";
      const query =
        inicio && fin ? `?fechaInicio=${inicio}&fechaFin=${fin}` : "";

      const res = await axios.get(`${API}/cash${query}`);
      setMovements(res.data);
    } catch (error) {
      console.error("❌ Error al obtener movimientos:", error.message);
    }
  };

  useEffect(() => {
    if (fechaInicio && fechaFin) fetchMovements();
    detectarTurnoActivo(); // 🔍 Verifica el turno al cargar
  }, [fechaInicio, fechaFin]);

  const handleEdit = (movement) => {
    setSelectedMovement(movement);
    setShowEditModal(true);
  };

  const totalVentas = movements
    .filter((m) => m.tipo === "venta")
    .reduce((acc, m) => acc + m.monto, 0);

  const totalIngresos = movements
    .filter((m) => m.tipo === "ingreso")
    .reduce((acc, m) => acc + m.monto, 0);

  const totalEgresos = movements
    .filter((m) => m.tipo === "egreso")
    .reduce((acc, m) => acc + m.monto, 0);

  // ✅ Este cálculo debe ir antes de usarlo
  const netoCaja = totalVentas + totalIngresos - totalEgresos;

  const iniciarTurno = async () => {
    const usuario = getUsuarioActual();
    const sucursalId = usuario?.sucursal || null;

    if (!usuario?._id || !sucursalId) {
      alert("⚠️ Usuario o sucursal no disponibles");
      console.warn("🧠 Usuario:", usuario);
      console.warn("🏢 Sucursal extraída:", sucursalId);
      return;
    }

    const responsable = usuario._id;

    try {
      const res = await axios.get(
        `${API}/cash/ultimo-cierre?sucursal=${sucursalId}`
      );
      const monto = res.data?.monto ?? 0;

      console.log("🔍 Enviando apertura de caja:");
      console.log("Responsable:", responsable);
      console.log("Sucursal:", sucursalId); // si usás variable local
      console.log("Monto:", monto);
      console.log("Comentario:", `Inicio de turno por ${usuario.nombre}`);

      await axios.post(`${API}/cash/open`, {
        responsable,
        sucursal: sucursalId,
        monto,
        comentario: `Inicio de turno por ${usuario.nombre}`,
      });

      alert(`🟢 Turno iniciado con monto: $${monto.toLocaleString("es-AR")}`);
      fetchMovements();
      detectarTurnoActivo();
    } catch (error) {
      console.error("❌ Error al iniciar turno:", error.message);
      alert(
        error.response?.data?.message || "Error inesperado al iniciar el turno."
      );
    }
  };

  const cerrarTurno = async () => {
    const usuario = getUsuarioActual();
    const sucursalId = usuario?.sucursal || null;

    if (!usuario?._id || !sucursalId) {
      alert("⚠️ Usuario o sucursal no disponibles");
      return;
    }

    const responsable = usuario._id;
    const monto = totalVentas + totalIngresos - totalEgresos; // ✅ cálculo real

    console.log("💰 Enviando cierre:");
    console.log("Responsable:", responsable);
    console.log("Sucursal:", sucursalId);
    console.log("Monto:", monto);

    try {
      await axios.post(`${API}/cash/close`, {
        responsable,
        sucursal: sucursalId,
        monto, // ✅ ahora se envía desde frontend
        comentario: `Cierre de turno por ${usuario.nombre}`,
      });

      alert("🔴 Turno cerrado correctamente");
      fetchMovements();
      detectarTurnoActivo();
    } catch (error) {
      console.error("❌ Error al cerrar turno:", error.message);
      alert("Error al cerrar el turno");
    }
  };

  const handleDelete = async (id) => {
    if (confirm("¿Estás seguro de que querés eliminar este movimiento?")) {
      try {
        await axios.delete(`${API}/cash/${id}`);
        alert("🗑️ Movimiento eliminado correctamente.");
        fetchMovements();
      } catch (error) {
        console.error("❌ Error al eliminar movimiento:", error.message);
        alert("Hubo un error al eliminar el movimiento.");
      }
    }
  };

  const detectarTurnoActivo = async () => {
    if (!sucursal) {
      console.warn("⚠️ Sucursal no definida, no se puede verificar turno.");
      return;
    }

    try {
      const res = await axios.get(`${API}/cash/turno?sucursal=${sucursal}`);
      const { apertura, cierre } = res.data;

      if (apertura && !cierre) {
        setTurnoActivo(true);
        setInicioTurno(new Date(apertura.fecha_movimiento));
      } else {
        setTurnoActivo(false);
        setInicioTurno(null);
      }
    } catch (error) {
      console.error("❌ Error al verificar turno activo:", error.message);
    }
  };

  useEffect(() => {
    if (!inicioTurno) return;

    const intervalo = setInterval(() => {
      const ahora = new Date();
      const diff = ahora - new Date(inicioTurno);
      const hrs = Math.floor(diff / 3600000);
      const mins = Math.floor((diff % 3600000) / 60000);
      const secs = Math.floor((diff % 60000) / 1000);

      setCronometro(
        `${hrs.toString().padStart(2, "0")}:${mins
          .toString()
          .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
      );
    }, 1000);

    return () => clearInterval(intervalo);
  }, [inicioTurno]);

  return (
    <Container className="my-4 mt-5 mb-5 pt-5 pb-5">
      <h1 className="text-success">💼 Movimientos de caja</h1>
      <p>Consulta y registra los movimientos según el período elegido.</p>

      {/* Inicio turno */}
      <div className="d-flex gap-3 mb-4 align-items-center">
        {!turnoActivo ? (
          <Button variant="outline-success" onClick={iniciarTurno}>
            🟢 Iniciar Turno
          </Button>
        ) : (
          <>
            <Button variant="outline-danger" onClick={cerrarTurno}>
              🔴 Cerrar Turno
            </Button>
            <span className="text-success fw-bold">
              🕒 Turno activo — Tiempo: {cronometro}
            </span>
          </>
        )}
      </div>

      {turnoActivo && (
        <div className="bg-light border p-3 mb-4 rounded">
          <strong>🧾 Turno en curso</strong>
          <ul className="mb-0 list-unstyled">
            <li>
              <strong>Responsable:</strong> {usuarioActual?.nombre}
            </li>
            <li>
              <strong>Sucursal:</strong> {sucursal}
            </li>
            <li>
              <strong>Inicio:</strong> {inicioTurno?.toLocaleString()}
            </li>
            <li>
              <strong>Tiempo activo:</strong> {cronometro}
            </li>
          </ul>
        </div>
      )}

      {/* 📅 Filtro por rango de fechas */}
      <Form className="mb-3 d-flex gap-3 flex-wrap align-items-end">
        <div>
          <Form.Label>Desde</Form.Label>
          <Form.Control
            type="date"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
          />
        </div>
        <div>
          <Form.Label>Hasta</Form.Label>
          <Form.Control
            type="date"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
          />
        </div>
        <Button variant="secondary" onClick={fetchMovements}>
          🔍 Buscar
        </Button>
        <Button
          variant="outline-primary"
          onClick={() => {
            const hoy = new Date();
            const año = hoy.getFullYear();
            const mes = hoy.getMonth();
            const inicio = new Date(año, mes, 1).toISOString().slice(0, 10);
            const fin = new Date(año, mes + 1, 0).toISOString().slice(0, 10);
            setFechaInicio(inicio);
            setFechaFin(fin);
            fetchMovements();
          }}
        >
          📆 Este mes
        </Button>
      </Form>

      <Button variant="primary" onClick={() => setShowCreateModal(true)}>
        ➕ Nuevo movimiento
      </Button>

      <div className="table-responsive">
        <table className="table table-striped mt-4">
          <thead>
            <tr>
              <th>Sucursal</th>
              <th>Responsable</th>
              <th>Tipo</th>
              <th>Concepto</th>
              <th>Monto</th>
              <th>Método</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {movements.map((mov) => (
              <tr key={mov._id}>
                <td>{mov.sucursal?.nombre || "—"}</td>
                <td>{mov.responsable?.nombre || "—"}</td>
                <td>{mov.tipo}</td>
                <td>{mov.concepto}</td>
                <td>${mov.monto.toLocaleString("es-AR")}</td>
                <td>{mov.metodo_pago}</td>
                <td>{new Date(mov.fecha_movimiento).toLocaleString()}</td>
                <td>
                  <div className="d-flex gap-1">
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => handleEdit(mov)}
                      title="Editar"
                    >
                      <FaEdit />
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(mov._id)}
                      title="Eliminar"
                    >
                      <FaTrash />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 📊 Resumen financiero */}
      <div className="mt-4 p-3 bg-light border rounded">
        <h5 className="text-success">📊 Resumen</h5>
        <ul className="list-unstyled">
          <li>
            <strong>Ventas:</strong> ${totalVentas.toLocaleString("es-AR")}
          </li>
          <li>
            <strong>Ingresos:</strong> ${totalIngresos.toLocaleString("es-AR")}
          </li>
          <li>
            <strong>Egresos:</strong> ${totalEgresos.toLocaleString("es-AR")}
          </li>
          <li>
            <strong>Total en caja:</strong> ${netoCaja.toLocaleString("es-AR")}
          </li>
        </ul>
      </div>

      {/* 🧾 Modales */}
      <CreateMovementModal
        show={showCreateModal}
        onHide={() => {
          setShowCreateModal(false);
          fetchMovements();
        }}
      />

      <EditMovementModal
        show={showEditModal}
        onHide={() => {
          setShowEditModal(false);
          fetchMovements();
        }}
        movement={selectedMovement}
      />
    </Container>
  );
};

export default Movements;
