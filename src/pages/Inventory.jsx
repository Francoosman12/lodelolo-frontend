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
        console.log("Datos obtenidos de la API:", response.data);
        setProducts(response.data);
      } catch (error) {
        console.error("Error al obtener productos:", error);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    return (
      product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.categoria.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.rubro?.toLowerCase().includes(searchTerm.toLowerCase()) // ✅ Nuevo filtro por rubro
    );
  });

  const exportToExcel = () => {
    console.log("🚀 Datos a exportar:", products);

    const worksheet = XLSX.utils.json_to_sheet(
      products.map((product) => {
        console.log("📌 Producto analizado:", product);

        return {
          Nombre: product.nombre,
          Rubro: product.rubro || "N/A",
          Categoría: product.categoria,
          Atributos: Array.isArray(product.atributos)
            ? product.atributos
                .map((attr) => `${attr.nombre}: ${attr.valor}`)
                .join(", ")
            : "N/A",
          Fabricante: product.fabricante,
          SKU: product.sku,
          "Precio Costo": product.precio_costo?.$numberDecimal
            ? parseFloat(product.precio_costo.$numberDecimal).toFixed(2)
            : product.precio_costo
            ? parseFloat(
                product.precio_costo.replace(/[^0-9,.]/g, "").replace(",", ".")
              ).toFixed(2)
            : "0.00",
          "Precio Público": product.precio_publico?.$numberDecimal
            ? parseFloat(product.precio_publico.$numberDecimal).toFixed(2)
            : product.precio_publico
            ? parseFloat(
                product.precio_publico
                  .replace(/[^0-9,.]/g, "")
                  .replace(",", ".")
              ).toFixed(2)
            : "0.00",
          Stock: product.cantidad_stock,
          Sucursal: product.sucursal?.nombre || "N/A",
          Estado: product.activo ? "Activo" : "Inactivo",
          "Fecha Creación": product.fecha_creacion
            ? new Date(product.fecha_creacion).toLocaleDateString()
            : "N/A", // ✅ Ahora igual que tu código en el frontend
          "Última Actualización": product.fecha_ultima_actualizacion
            ? new Date(product.fecha_ultima_actualizacion).toLocaleDateString()
            : "N/A", // ✅ Ahora igual que tu código en el frontend
        };
      })
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Inventario");
    XLSX.writeFile(workbook, "Inventario.xlsx");
  };

  return (
    <Container className="my-4 mt-5 mb-5 pt-5 pb-5">
      <h1 className="text-center" style={{ color: "#1D3557" }}>
        Inventario de Productos
      </h1>
      <p className="text-center text-muted">
        Gestión de stock y detalles completos de los productos.
      </p>

      <Form.Control
        type="text"
        placeholder="Buscar por nombre, SKU, categoría o rubro..."
        className="mb-3"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <Button variant="success" onClick={exportToExcel} className="mb-3">
        Exportar a Excel 📤
      </Button>

      <div className="table-responsive">
        <Table striped bordered hover>
          <thead className="bg-primary text-white">
            <tr>
              <th>Imagen</th>
              <th>Nombre</th>
              <th>Rubro</th> {/* ✅ Nuevo campo */}
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
                <td>{product.rubro || "N/A"}</td> {/* ✅ Nuevo campo */}
                <td>{product.categoria}</td>
                <td>
                  {product.atributos
                    ? product.atributos
                        .map((attr) => `${attr.nombre}: ${attr.valor}`)
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
                <td>
                  {product.fecha_creacion
                    ? new Date(product.fecha_creacion).toLocaleDateString()
                    : "N/A"}
                </td>
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
