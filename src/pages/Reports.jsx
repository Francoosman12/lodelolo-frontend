import React, { useState, useEffect } from "react";
import { Table } from "react-bootstrap";
import axios from "axios";
import "../styles/Reports.css"; // Asegúrate de tener este archivo CSS

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Reports = () => {
  const [salesReport, setSalesReport] = useState([]);
  const totalGeneral = salesReport.reduce(
    (acc, sale) =>
      acc +
      Number(
        sale.total
          .toString()
          .replace(/[^0-9.,]/g, "")
          .replace(",", ".")
      ),
    0
  );

  useEffect(() => {
    fetchSalesReport();
  }, []);

  const fetchSalesReport = async () => {
    try {
      console.log("📌 Obteniendo TODAS las ventas...");
      const res = await axios.get(`${API_URL}/sales`);
      console.log("📌 Ventas obtenidas:", res.data);
      setSalesReport(res.data);
    } catch (error) {
      console.error("❌ Error al obtener reporte:", error);
    }
  };

  return (
    <div className="container mt-5 pt-5 mb-5 pb-5 px-4">
      <h1 className="titulo text-center mb-4">📊 Reporte de Ventas</h1>

      <div className="table-responsive">
        <Table striped bordered hover className="">
          <thead className="bg-dark text-white text-center">
            <tr>
              <th>Fecha</th>
              <th>Vendedor</th>
              <th>Sucursal</th>
              <th>Productos Vendidos</th>
              <th>Total</th>
              <th>Método de Pago</th>
            </tr>
          </thead>
          <tbody>
            {salesReport.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center text-danger">
                  ⚠ No hay ventas registradas en este período.
                </td>
              </tr>
            ) : (
              salesReport.map((sale) => (
                <tr key={sale._id} className="text-center">
                  <td>{new Date(sale.fecha_venta).toLocaleString()}</td>
                  <td>
                    {sale.id_vendedor ? sale.id_vendedor.nombre : "Desconocido"}
                  </td>
                  <td>
                    {sale.sucursal ? sale.sucursal.nombre : "Sin Sucursal"}
                  </td>
                  <td>
                    {sale.productos.length > 0
                      ? sale.productos.map((producto, index) => (
                          <div key={index}>
                            {producto.id_producto?.nombre ||
                              "Producto Desconocido"}{" "}
                            x{producto.cantidad_vendida}
                          </div>
                        ))
                      : "Sin productos"}
                  </td>
                  <td className="fw-bold">
                    $
                    {Number(
                      sale.total
                        .toString()
                        .replace(/[^0-9.,]/g, "")
                        .replace(",", ".")
                    ).toFixed(2)}
                  </td>
                  <td>{sale.metodo_pago.tipo}</td>
                </tr>
              ))
            )}
          </tbody>
          <tfoot>
            <tr className="bg-light fw-bold">
              <td colSpan="4" className="text-end">
                Total General:
              </td>
              <td className="text-success">$ {totalGeneral.toFixed(2)}</td>
              <td></td>
            </tr>
          </tfoot>
        </Table>
      </div>
    </div>
  );
};

export default Reports;
