import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";

// 🔌 Usar variable del entorno
const API = import.meta.env.VITE_API_URL;

const CreateMovementModal = ({ show, onHide }) => {
  const [tipo, setTipo] = useState("ingreso");
  const [concepto, setConcepto] = useState("");
  const [monto, setMonto] = useState("");
  const [metodoPago, setMetodoPago] = useState("efectivo");
  const [comentario, setComentario] = useState("");
  const [sucursalSeleccionada, setSucursalSeleccionada] = useState("");
  const [responsableSeleccionado, setResponsableSeleccionado] = useState("");
  const [sucursales, setSucursales] = useState([]);
  const [usuarios, setUsuarios] = useState([]);

  // 🔄 Cargar sucursales y usuarios al abrir modal
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [sucRes, userRes] = await Promise.all([
          axios.get(`${API}/sucursales`),
          axios.get(`${API}/users`),
        ]);
        console.log("Sucursales:", sucRes.data);
        console.log("Usuarios:", userRes.data);
        setSucursales(sucRes.data);
        setUsuarios(userRes.data.filter((u) => u.activo));
      } catch (error) {
        console.error("❌ Error al cargar datos:", error.message);
      }
    };

    if (show) cargarDatos();
  }, [show]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const movimiento = {
      tipo,
      concepto,
      monto: Number(monto.replace(/\./g, "").replace(",", ".")),
      sucursal: sucursalSeleccionada,
      responsable: responsableSeleccionado,
      metodo_pago: metodoPago,
      comentario,
    };

    try {
      await axios.post(`${API}/cash`, movimiento);
      alert("✅ Movimiento registrado correctamente.");
      onHide();
    } catch (error) {
      console.error("❌ Error al registrar movimiento:", error.message);
      alert("Error al guardar el movimiento.");
    }
  };

  const handleMontoChange = (e) => {
    let inputValue = e.target.value.replace(/[^0-9]/g, "");

    while (inputValue.length < 3) {
      inputValue = "0" + inputValue;
    }

    const integerPart = inputValue.slice(0, -2);
    const decimalPart = inputValue.slice(-2);

    const formattedIntegerPart = integerPart
      .replace(/^0+(?!$)/, "")
      .replace(/\B(?=(\d{3})+(?!\d))/g, ".");

    const formattedValue = `${formattedIntegerPart || "0"},${decimalPart}`;
    setMonto(formattedValue);
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>➕ Registrar Movimiento</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          {/* 🏪 Sucursal */}
          <Form.Group className="mb-3">
            <Form.Label>Sucursal</Form.Label>
            <Form.Select
              value={sucursalSeleccionada}
              onChange={(e) => setSucursalSeleccionada(e.target.value)}
              required
            >
              <option value="">Seleccionar</option>
              {sucursales.map((suc) => (
                <option key={suc._id} value={suc._id}>
                  {suc.nombre}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          {/* 👤 Responsable */}
          <Form.Group className="mb-3">
            <Form.Label>Responsable</Form.Label>
            <Form.Select
              value={responsableSeleccionado}
              onChange={(e) => setResponsableSeleccionado(e.target.value)}
              required
            >
              <option value="">Seleccionar</option>
              {usuarios.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.nombre}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          {/* 💼 Tipo */}
          <Form.Group className="mb-3">
            <Form.Label>Tipo de movimiento</Form.Label>
            <Form.Select value={tipo} onChange={(e) => setTipo(e.target.value)}>
              <option value="ingreso">Ingreso</option>
              <option value="egreso">Egreso</option>
            </Form.Select>
          </Form.Group>

          {/* 📝 Concepto */}
          <Form.Group className="mb-3">
            <Form.Label>Concepto</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ej: Retiro de efectivo"
              value={concepto}
              onChange={(e) => setConcepto(e.target.value)}
              required
            />
          </Form.Group>

          {/* 💰 Monto */}
          <Form.Group className="mb-3">
            <Form.Label>Monto</Form.Label>
            <Form.Control
              type="text"
              name="monto"
              value={monto || "0,00"}
              onChange={handleMontoChange}
              placeholder="Ejemplo: 2.000,00"
              required
            />
          </Form.Group>

          {/* 💳 Método */}
          <Form.Group className="mb-3">
            <Form.Label>Método de pago</Form.Label>
            <Form.Select
              value={metodoPago}
              onChange={(e) => setMetodoPago(e.target.value)}
            >
              <option value="efectivo">Efectivo</option>
              <option value="tarjeta">Tarjeta</option>
              <option value="transferencia">Transferencia</option>
            </Form.Select>
          </Form.Group>

          {/* 📌 Comentario */}
          <Form.Group className="mb-3">
            <Form.Label>Comentario</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              placeholder="Opcional: detalles adicionales"
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
            />
          </Form.Group>

          <Button variant="success" type="submit">
            Registrar
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CreateMovementModal;
