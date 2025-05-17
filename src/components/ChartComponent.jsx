import React from "react";
import { Card } from "react-bootstrap";
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const ChartComponent = ({ products }) => {
  // ✅ Generar datos para el gráfico de categorías
  const categoryCounts = products.reduce((acc, product) => {
    acc[product.categoria] = (acc[product.categoria] || 0) + 1;
    return acc;
  }, {});

  const chartData = {
    labels: Object.keys(categoryCounts),
    datasets: [
      {
        label: "Cantidad de productos por categoría",
        data: Object.values(categoryCounts),
        backgroundColor: ["#1D3557", "#A8DADC", "#F4A261", "#E63946"],
      },
    ],
  };

  // ✅ Calcular el monto total en productos (precio público)
  const totalPublico = products
    .reduce((acc, product) => {
      return (
        acc +
        Number(
          product.precio_publico?.replace("ARS", "").replace(",", ".").trim() ||
            0
        ) *
          product.cantidad_stock
      );
    }, 0)
    .toFixed(2);

  // ✅ Contar el número de artículos diferentes
  const totalArticulos = new Set(products.map((product) => product.nombre))
    .size;

  return (
    <div className="d-flex flex-wrap justify-content-center gap-3">
      {/* ✅ Tarjeta de Productos por Categoría */}
      <Card
        style={{ width: "15rem", padding: "15px", backgroundColor: "#F1FAEE" }}
      >
        <Card.Body className="d-flex flex-column justify-content-center align-items-center text-center">
          <Card.Title>📊 Productos por Categoría</Card.Title>
          <Bar data={chartData} />
        </Card.Body>
      </Card>

      {/* ✅ Tarjeta de Monto Total en Productos */}
      <Card
        style={{ width: "15rem", padding: "15px", backgroundColor: "#E9C46A" }}
      >
        <Card.Body className="d-flex flex-column justify-content-center align-items-center text-center">
          <Card.Title>💰 Monto Total en Productos</Card.Title>
          <h3>ARS ${totalPublico}</h3>
        </Card.Body>
      </Card>

      {/* ✅ Tarjeta de Cantidad de Artículos Diferentes */}
      <Card
        style={{ width: "15rem", padding: "15px", backgroundColor: "#A8DADC" }}
      >
        <Card.Body className="d-flex flex-column justify-content-center align-items-center text-center">
          <Card.Title>📦 Artículos Diferentes</Card.Title>
          <h3>{totalArticulos} tipos</h3>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ChartComponent;
