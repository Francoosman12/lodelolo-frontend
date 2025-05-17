import React, { useEffect, useState } from "react";
import { Container, Table, Badge, Form, Button } from "react-bootstrap";
import axios from "axios";
import * as XLSX from "xlsx";

const API_URL = import.meta.env.VITE_API_URL;

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${API_URL}/products`);
        console.log("Datos obtenidos de la API:", response.data); // ✅ Console log para revisar los datos
        setProducts(response.data);
      } catch (error) {
        console.error("Error al obtener productos:", error);
      }
    };
    fetchProducts();
  }, []);

  // ✅ Función para filtrar productos
  const filteredProducts = products.filter((product) => {
    return (
      product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.categoria.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // ✅ Función para exportar a Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      products.map((product) => ({
        Nombre: product.nombre,
        Categoría: product.categoria,
        Atributos: Object.entries(product.atributos || {})
          .map(([key, value]) => `${key}: ${value}`)
          .join(", "),
        Fabricante: product.fabricante,
        SKU: product.sku,
        "Precio Costo": Number(
          product.precio_costo?.replace("ARS", "").replace(",", ".").trim() || 0
        ).toFixed(2),
        "Precio Público": Number(
          product.precio_publico?.replace("ARS", "").replace(",", ".").trim() ||
            0
        ).toFixed(2),
        Stock: product.cantidad_stock,
        Sucursal: product.sucursal?.nombre || "N/A",
        Estado: product.activo ? "Activo" : "Inactivo",
        "Fecha Creación": new Date(product.fecha_creacion).toLocaleDateString(),
        "Última Actualización": new Date(
          product.fecha_ultima_actualizacion
        ).toLocaleDateString(),
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Inventario");
    XLSX.writeFile(workbook, "Inventario.xlsx");
  };

  return (
    <Container className="my-4">
      <h1 className="text-center" style={{ color: "#1D3557" }}>
        Inventario de Productos
      </h1>
      <p className="text-center text-muted">
        Gestión de stock y detalles completos de los productos.
      </p>

      {/* ✅ Campo de búsqueda */}
      <Form.Control
        type="text"
        placeholder="Buscar por nombre, SKU o categoría..."
        className="mb-3"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* ✅ Botón de exportación */}
      <Button variant="success" onClick={exportToExcel} className="mb-3">
        Exportar a Excel 📤
      </Button>

      <div className="table-responsive">
        <Table striped bordered hover>
          <thead className="bg-primary text-white">
            <tr>
              <th>Imagen</th>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Atributos</th>
              <th>Fabricante</th>
              <th>SKU</th>
              <th>Precio Costo</th>
              <th>Precio Público</th>
              <th>Stock</th>
              <th>Sucursal</th>
              <th>Estado</th>
              <th>Creado</th>
              <th>Última Actualización</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product._id}>
                <td>
                  <img
                    src={product.imagen_url || "https://via.placeholder.com/45"}
                    alt={product.nombre}
                    width="40"
                    height="40"
                    className="rounded"
                  />
                </td>
                <td>{product.nombre}</td>
                <td>{product.categoria}</td>
                <td>
                  {product.atributos
                    ? Object.entries(product.atributos)
                        .map(([key, value]) => `${key}: ${value}`)
                        .join(", ")
                    : "N/A"}
                </td>
                <td>{product.fabricante || "N/A"}</td>
                <td>{product.sku || "N/A"}</td>
                <td>
                  <Badge bg="success">
                    $
                    {Number(
                      product.precio_costo
                        ?.replace("ARS", "")
                        .replace(",", ".")
                        .trim() || 0
                    ).toFixed(2)}
                  </Badge>
                </td>
                <td>
                  <Badge bg="warning">
                    $
                    {Number(
                      product.precio_publico
                        ?.replace("ARS", "")
                        .replace(",", ".")
                        .trim() || 0
                    ).toFixed(2)}
                  </Badge>
                </td>
                <td>{product.cantidad_stock}</td>
                <td>{product.sucursal?.nombre || "N/A"}</td>
                <td>{product.activo ? "Activo" : "Inactivo"}</td>
                <td>{new Date(product.fecha_creacion).toLocaleDateString()}</td>
                <td>
                  {new Date(
                    product.fecha_ultima_actualizacion
                  ).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </Container>
  );
};

export default Inventory;
