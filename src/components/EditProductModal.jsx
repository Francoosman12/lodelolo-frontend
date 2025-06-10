import React, { useState, useEffect } from "react";
import { Modal, Form, Button, Row, Col } from "react-bootstrap";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const EditProductModal = ({ show, handleClose, product, refreshProducts }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    rubro: "",
    categoria: "",
    atributos: [],
    precio_costo: "0.00",
    precio_publico: "0.00",
    cantidad_stock: "",
    fabricante: "",
    sucursal: "",
    activo: false,
    imagen_url: "",
    categorias: [],
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [rubrosData, setRubrosData] = useState([]);
  const [sucursales, setSucursales] = useState([]);

  useEffect(() => {
    axios.get(`${API_URL}/sucursales`).then((res) => setSucursales(res.data));
  }, []);

  useEffect(() => {
    const fetchRubros = async () => {
      try {
        const response = await fetch("/data/rubros.json"); // ✅ Cargar archivo local
        const data = await response.json();
        setRubrosData(data.rubros);
      } catch (error) {
        console.error("Error al cargar rubros:", error);
      }
    };

    fetchRubros();
  }, []);

  useEffect(() => {
    if (product) {
      setFormData({
        nombre: product.nombre || "",
        rubro: product.rubro || "",
        categoria: product.categoria || "",
        atributos: product.atributos || [],
        precio_costo:
          product.precio_costo?.$numberDecimal?.replace(".", ",") ||
          product.precio_costo?.toString().replace(".", ",") ||
          "0,00",
        precio_publico:
          product.precio_publico?.$numberDecimal?.replace(".", ",") ||
          product.precio_publico?.toString().replace(".", ",") ||
          "0,00",
        cantidad_stock: product.cantidad_stock || "",
        fabricante: product.fabricante || "",
        sucursal: product.sucursal?._id || "",
        activo: product.activo || false,
        imagen_url: product.imagen_url || "",
        categorias: [],
      });

      // ✅ Si el producto tiene un rubro, cargar las categorías correspondientes
      const rubroSeleccionado = rubrosData.find(
        (r) => r.nombre === product.rubro
      );
      if (rubroSeleccionado) {
        setFormData((prevData) => ({
          ...prevData,
          categorias: rubroSeleccionado.categorias,
        }));
      }
    }
  }, [product, rubrosData]);

  // ✅ Manejo de cambios en los inputs
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "imagen") {
      setFormData((prevData) => ({
        ...prevData,
        imagen: files.length > 0 ? files[0] : null,
      }));
    } else if (name === "precio_costo" || name === "precio_publico") {
      let inputValue = value.replace(/[^0-9]/g, ""); // ✅ Solo números

      while (inputValue.length < 3) {
        inputValue = "0" + inputValue; // ✅ Rellenar con ceros al inicio
      }

      const integerPart = inputValue.slice(0, -2); // ✅ Parte entera
      const decimalPart = inputValue.slice(-2); // ✅ Últimos 2 dígitos como decimales

      const formattedIntegerPart = integerPart
        .replace(/^0+(?!$)/, "") // ✅ Evitar ceros innecesarios
        .replace(/\B(?=(\d{3})+(?!\d))/g, "."); // ✅ Separación de miles con puntos

      const formattedValue = `${formattedIntegerPart || "0"},${decimalPart}`;

      setFormData((prevData) => ({
        ...prevData,
        [name]: formattedValue,
      }));
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  // ✅ Actualizar categorías cuando cambie el rubro
  const handleRubroChange = (e) => {
    const selectedRubro = e.target.value;
    const rubroSeleccionado = rubrosData.find(
      (r) => r.nombre === selectedRubro
    );

    setFormData((prevData) => ({
      ...prevData,
      rubro: selectedRubro,
      categorias: rubroSeleccionado ? rubroSeleccionado.categorias : [],
      categoria: "",
      atributos: [],
    }));
  };

  // ✅ Manejar cambio de categoría y asignar atributos
  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    const categoriaSeleccionada = formData.categorias.find(
      (c) => c.nombre === selectedCategory
    );

    setFormData((prevData) => ({
      ...prevData,
      categoria: selectedCategory,
      atributos: categoriaSeleccionada
        ? categoriaSeleccionada.atributos.map((attr) => ({
            nombre: attr.nombre,
            tipo: attr.tipo,
            valores: attr.valores || [],
            valor: attr.tipo === "lista" ? attr.valores[0] || "" : "",
          }))
        : [],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();

    // ✅ Agregar los campos modificados a `FormData`
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== product[key]) {
        formDataToSend.append(key, value);
      }
    });

    // ✅ Asegurar que el campo de imagen se llame "imagen" (igual que en `createProduct`)
    if (selectedFile) {
      formDataToSend.append("imagen", selectedFile);
    }

    // 🔍 Verificar qué datos se están enviando al backend
    for (let [key, value] of formDataToSend.entries()) {
      console.log(`📩 Enviando: ${key} ->`, value);
    }

    try {
      await axios.put(`${API_URL}/products/${product._id}`, formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" }, // ✅ Necesario para enviar archivos
      });

      alert("✅ Producto actualizado correctamente.");
      refreshProducts();
      handleClose();
    } catch (error) {
      console.error(
        "❌ Error al actualizar producto:",
        error.response?.data || error
      );
      alert(
        `⚠️ Error al actualizar producto: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Editar Producto</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>Imagen Actual</Form.Label>
            <div className="mb-2">
              <img
                src={formData.imagen_url}
                alt="Producto"
                width="100"
                height="100"
                className="rounded"
              />
            </div>
            <Form.Label>Actualizar Imagen</Form.Label>
            <Form.Control type="file" name="imagen" onChange={handleChange} />
          </Form.Group>

          <Row>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Rubro</Form.Label>
                <Form.Select
                  name="rubro"
                  value={formData.rubro}
                  onChange={handleRubroChange}
                  required
                >
                  <option value="" disabled>
                    Seleccione un rubro
                  </option>
                  {rubrosData.map((rubro) => (
                    <option key={rubro.nombre} value={rubro.nombre}>
                      {rubro.nombre}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Select
                name="categoria"
                value={formData.categoria}
                onChange={handleCategoryChange}
                required
              >
                <option value="" disabled>
                  Seleccione una categoría
                </option>
                {Array.isArray(formData.categorias)
                  ? formData.categorias.map((categoria, index) => (
                      <option
                        key={`${categoria.nombre}-${index}`}
                        value={categoria.nombre}
                      >
                        {categoria.nombre}
                      </option>
                    ))
                  : null}{" "}
                {/* ✅ Generamos un key único combinando el nombre y el índice */}
              </Form.Select>

              <Form.Group>
                <Form.Label>Stock</Form.Label>
                <Form.Control
                  type="number"
                  name="cantidad_stock"
                  value={formData.cantidad_stock}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label>Precio Costo</Form.Label>
                <Form.Control
                  type="text"
                  name="precio_costo"
                  value={formData.precio_costo}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Precio Público</Form.Label>
                <Form.Control
                  type="text"
                  name="precio_publico"
                  value={formData.precio_publico}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Fabricante</Form.Label>
                <Form.Control
                  type="text"
                  name="fabricante"
                  value={formData.fabricante}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Sucursal</Form.Label>
                <Form.Select
                  name="sucursal"
                  value={formData.sucursal}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>
                    Seleccione una sucursal
                  </option>
                  {sucursales.map((sucursal) => (
                    <option key={sucursal._id} value={sucursal._id}>
                      {sucursal.nombre}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mt-3">
            <Form.Check
              type="checkbox"
              label="Producto Activo"
              name="activo"
              checked={formData.activo}
              onChange={(e) =>
                setFormData((prevData) => ({
                  ...prevData,
                  activo: e.target.checked,
                }))
              }
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            Guardar cambios
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EditProductModal;
