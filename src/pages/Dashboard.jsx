import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Row, Col, Card } from "react-bootstrap";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";

const API_URL = import.meta.env.VITE_API_URL;

const Dashboard = () => {
  const [kpi, setKpi] = useState({
    totalVentas: 0,
    ticketPromedio: 0,
    numTransacciones: 0,
  });

  const [ventasPorCategoria, setVentasPorCategoria] = useState({
    labels: [],
    datasets: [],
  });

  const [ventasPorVendedor, setVentasPorVendedor] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    const fetchKPI = async () => {
      try {
        const response = await axios.get(`${API_URL}/sales/kpi`);
        setKpi(response.data);
      } catch (error) {
        console.error("❌ Error al obtener KPI:", error);
      }
    };

    const fetchVentasPorCategoria = async () => {
      try {
        const response = await axios.get(`${API_URL}/sales/categorias`);
        const categorias = response.data.map((item) => item.categoria);
        const totales = response.data.map((item) => item.totalVentas);

        setVentasPorCategoria({
          labels: categorias,
          datasets: [
            {
              label: "Ventas por Categoría",
              data: totales,
              backgroundColor: ["#007bff", "#28a745", "#ffc107", "#dc3545"],
            },
          ],
        });
      } catch (error) {
        console.error("❌ Error al obtener ventas por categoría:", error);
      }
    };

    const fetchVentasPorVendedor = async () => {
      try {
        const response = await axios.get(`${API_URL}/sales/vendedores`);
        const vendedores = response.data.map((item) => item.vendedor);
        const totales = response.data.map((item) => item.totalVentas);

        setVentasPorVendedor({
          labels: vendedores,
          datasets: [
            {
              label: "Ventas por Vendedor",
              data: totales,
              backgroundColor: ["#6f42c1", "#17a2b8", "#e83e8c", "#fd7e14"],
            },
          ],
        });
      } catch (error) {
        console.error("❌ Error al obtener ventas por vendedor:", error);
      }
    };

    fetchKPI();
    fetchVentasPorCategoria();
    fetchVentasPorVendedor();
  }, []);

  return (
    <Container className="pt-5 mt-5 pb-5 mb-5">
      <h1 className="text-primary">📊 Dashboard de Ventas</h1>
      <p className="text-muted">
        Monitoriza el rendimiento del negocio en tiempo real.
      </p>

      {/* ✅ KPI en tarjetas más elegantes */}
      <Row className="mt-4">
        <Col md={4}>
          <Card className="text-center p-4">
            <h3 className="text-success">💰 Total Ventas Hoy</h3>
            <h2 className="font-weight-bold">${kpi.totalVentas}</h2>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center p-4">
            <h3 className="text-info">📉 Ticket Promedio</h3>
            <h2 className="font-weight-bold">${kpi.ticketPromedio}</h2>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center p-4">
            <h3 className="text-warning">🛍️ Transacciones Hoy</h3>
            <h2 className="font-weight-bold">{kpi.numTransacciones}</h2>
          </Card>
        </Col>
      </Row>

      {/* 📊 Gráficos de Ventas */}
      <Row className="mt-5">
        <Col md={6}>
          <h3 className="text-primary">📦 Ventas por Categoría</h3>
          <Bar
            data={ventasPorCategoria}
            options={{ responsive: true, maintainAspectRatio: true }}
            height={150}
          />
        </Col>
        <Col md={6}>
          <h3 className="text-danger">🧑‍💼 Ventas por Vendedor</h3>
          <Bar
            data={ventasPorVendedor}
            options={{ responsive: true, maintainAspectRatio: true }}
            height={150}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
