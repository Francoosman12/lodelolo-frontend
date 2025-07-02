import React, { useState, useEffect } from "react";
import { Modal, Form, Button, Row, Col } from "react-bootstrap";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const EditProductModal = ({ show, handleClose, product, refreshProducts }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    rubro: "",
    categorias: [],
    categoria: "",
    attributes: [],
    selectedOption: "",
    precio_costo: "0,00",
    precio_publico: "0,00",
    cantidad_stock: "",
    fabricante: "",
    sucursal: "",
    activo: false,
    imagen_url: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [rubrosData, setRubrosData] = useState([]);
  const [sucursales, setSucursales] = useState([]);

  // Obtener sucursales
  useEffect(() => {
    axios.get(`${API_URL}/sucursales`).then((res) => setSucursales(res.data));
  }, []);

  // Obtener rubros desde backend
  useEffect(() => {
    const fetchRubros = async () => {
      try {
        const response = await axios.get(`${API_URL}/rubrics`);
        setRubrosData(response.data);
      } catch (error) {
        console.error("❌ Error al cargar rubros:", error);
      }
    };
    fetchRubros();
  }, []);

  // Cargar datos del producto + atributos según categoría
  useEffect(() => {
    if (product && rubrosData.length > 0) {
      const rubroSeleccionado = rubrosData.find(
        (r) => r.name === product.rubro
      );

      const categoriaSeleccionada = rubroSeleccionado?.categories.find(
        (c) => c.name === product.categoria
      );

      const atributosBase = categoriaSeleccionada
        ? categoriaSeleccionada.attributes.map((attr) => ({
            name: attr.name,
            type: attr.type,
            values: attr.values || [],
            value: attr.type === "list" ? attr.values?.[0] || "" : "",
          }))
        : [];

      setFormData((prev) => ({
        ...prev,
        nombre: product.nombre || "",
        rubro: product.rubro || "",
        categoria: product.categoria || "",
        categorias: rubroSeleccionado?.categories || [],
        attributes: atributosBase,
        selectedOption: product.atributos?.[0]?.name || "",
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
      }));
    }
  }, [product, rubrosData]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "imagen") {
      setSelectedFile(files[0] || null);
    } else if (name === "precio_costo" || name === "precio_publico") {
      let inputValue = value.replace(/[^0-9]/g, "");
      while (inputValue.length < 3) inputValue = "0" + inputValue;
      const integerPart = inputValue.slice(0, -2);
      const decimalPart = inputValue.slice(-2);
      const formattedIntegerPart = integerPart
        .replace(/^0+(?!$)/, "")
        .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      const formattedValue = `${formattedIntegerPart || "0"},${decimalPart}`;
      setFormData((prevData) => ({ ...prevData, [name]: formattedValue }));
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const handleRubroChange = (e) => {
    const selectedRubro = e.target.value;
    const rubroSeleccionado = rubrosData.find((r) => r.name === selectedRubro);

    setFormData((prevData) => ({
      ...prevData,
      rubro: selectedRubro,
      categorias: rubroSeleccionado?.categories || [],
      categoria: "",
      attributes: [],
      selectedOption: "",
    }));
  };

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    const categoriaSeleccionada = formData.categorias.find(
      (c) => c.name === selectedCategory
    );

    const mappedAttributes = categoriaSeleccionada
      ? categoriaSeleccionada.attributes.map((attr) => ({
          name: attr.name,
          type: attr.type,
          values: attr.values || [],
          value: attr.type === "list" ? attr.values?.[0] || "" : "",
        }))
      : [];

    setFormData((prevData) => ({
      ...prevData,
      categoria: selectedCategory,
      attributes: mappedAttributes,
      selectedOption: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();

    const atributosElegidos = formData.attributes
      .filter((attr) => attr.name === formData.selectedOption)
      .map((attr) => ({
        nombre: attr.name,
        tipo: attr.type,
        valor: attr.value,
      }));

    Object.entries(formData).forEach(([key, value]) => {
      if (key === "attributes") {
        formDataToSend.append("atributos", JSON.stringify(atributosElegidos));
      } else if (key !== "categorias") {
        formDataToSend.append(key, value);
      }
    });

    if (selectedFile) {
      formDataToSend.append("imagen", selectedFile);
    }

    // 🔍 Log útil para debug
    for (let [key, value] of formDataToSend.entries()) {
      console.log("✅ Enviando:", key, value);
    }

    try {
      await axios.put(`${API_URL}/products/${product._id}`, formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("✅ Producto actualizado correctamente.");
      refreshProducts();
      handleClose();
    } catch (error) {
      console.error("❌ Error al actualizar producto:", error);
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
              <Form.Group className="mb-3">
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
                    <option key={rubro._id} value={rubro.name}>
                      {rubro.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Categoría</Form.Label>
                <Form.Select
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleCategoryChange}
                  required
                >
                  <option value="" disabled>
                    Seleccione una categoría
                  </option>
                  {formData.categorias?.map((categoria, index) => (
                    <option key={index} value={categoria.name}>
                      {categoria.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              {/* Atributos como opciones */}
              {Array.isArray(formData.attributes) &&
                formData.attributes.length > 0 && (
                  <Form.Group className="mb-3">
                    <Form.Label>Seleccioná una opción</Form.Label>
                    <Form.Select
                      value={formData.selectedOption || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          selectedOption: e.target.value,
                        }))
                      }
                    >
                      <option value="">Elegí una opción</option>
                      {formData.attributes.map((attr, index) => (
                        <option key={index} value={attr.name}>
                          {attr.name}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                )}

              <Form.Group className="mb-3">
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
              <Form.Group className="mb-3">
                <Form.Label>Precio Costo</Form.Label>
                <Form.Control
                  type="text"
                  name="precio_costo"
                  value={formData.precio_costo}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Precio Público</Form.Label>
                <Form.Control
                  type="text"
                  name="precio_publico"
                  value={formData.precio_publico}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
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

          <Button variant="primary" type="submit" className="mt-3">
            Guardar cambios
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EditProductModal;
