import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  Container,
  Form,
  Button,
  Badge,
  Pagination,
} from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import "../styles/ProductList.css";
import ChartComponent from "../components/ChartComponent";
import EditProductModal from "../components/EditProductModal"; // ✅ Importamos el modal

const ProductTable = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [rubrosData, setRubrosData] = useState([]);

  const API_URL = import.meta.env.VITE_API_URL;

  // ✅ Función para refrescar la lista de productos
  const refreshProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/products`);
      setProducts(response.data);
    } catch (error) {
      console.error("Error al obtener productos:", error);
    }
  };

  useEffect(() => {
    refreshProducts(); // ✅ Cargar productos al inicio
  }, []);

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await axios.put(`${API_URL}/products/status/${id}`, {
        activo: !currentStatus,
      });
      setProducts(
        products.map((product) =>
          product._id === id ? { ...product, activo: !currentStatus } : product
        )
      );
    } catch (error) {
      console.error("Error al actualizar estado:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Seguro que quieres eliminar este producto?")) {
      try {
        await axios.delete(`${API_URL}/products/${id}`);
        setProducts(products.filter((product) => product._id !== id));
      } catch (error) {
        console.error("Error al eliminar producto:", error);
      }
    }
  };

  const filteredProducts = products.filter((product) => {
    return (
      (product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.categoria.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.rubro?.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (categoryFilter === "" || product.categoria === categoryFilter)
    );
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // ✅ Mostrar el modal y definir el producto que se va a editar
  const handleShowModal = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  // ✅ Cerrar el modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };

  return (
    <Container className="product-container my-4 mt-5 mb-5 pt-5 pb-5">
      <h2 className="text-center pb-4" style={{ color: "#1D3557" }}>
        Gestión de Productos
      </h2>

      <ChartComponent products={products} />

      <h2 className="text-center mb-3" style={{ color: "#1D3557" }}>
        Gestión de Productos
      </h2>
      <p className="text-center text-muted mb-4">
        Busca, filtra y gestiona los productos con facilidad.
      </p>

      <Form className="d-flex justify-content-between mb-3 flex-wrap">
        <Form.Control
          type="text"
          placeholder="Buscar por nombre, SKU, categoría o rubro..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-2"
        />
        <Form.Select
          onChange={(e) => setCategoryFilter(e.target.value)}
          value={categoryFilter}
          className="mb-2"
        >
          <option value="">Todas las categorías</option>
          {[...new Set(products.map((p) => p.categoria))].map((categoria) => (
            <option key={categoria} value={categoria}>
              {categoria}
            </option>
          ))}
        </Form.Select>
        <Form.Select
          onChange={(e) => setItemsPerPage(Number(e.target.value))}
          value={itemsPerPage}
          className="mb-2"
        >
          {[10, 20, 50, 100].map((num) => (
            <option key={num} value={num}>
              {num} productos
            </option>
          ))}
        </Form.Select>
      </Form>

      <div className="table-responsive">
        <Table striped bordered hover>
          <thead className="bg-primary text-white">
            <tr>
              <th>Imagen</th>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Precio Público</th>
              <th>Stock</th>
              <th>Sucursal</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {paginatedProducts.map((product) => (
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
                <td>
                  <Form.Check
                    type="switch"
                    checked={product.activo}
                    onChange={() =>
                      handleToggleStatus(product._id, product.activo)
                    }
                  />
                </td>
                <td>
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => handleShowModal(product)}
                  >
                    <FaEdit />
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(product._id)}
                  >
                    <FaTrash />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <EditProductModal
        show={showModal}
        handleClose={handleCloseModal}
        product={selectedProduct}
        refreshProducts={refreshProducts}
      />
    </Container>
  );
};

export default ProductTable;
