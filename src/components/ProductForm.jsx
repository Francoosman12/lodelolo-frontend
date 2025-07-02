import React, { useEffect, useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import "../styles/ProductForm.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const ProductForm = ({
  formData,
  handleChange,
  handleSubmit,
  rubros,
  sucursales,
  setFormData,
}) => {
  const [suppliers, setSuppliers] = useState([]);

  const [rubrosData, setRubrosData] = useState([]);
  // Estado para controlar si el SKU se genera automáticamente
  const [autoGenerateSKU, setAutoGenerateSKU] = useState(true);

  // Manejar el cambio de selección
  const handleSKUToggle = (e) => {
    const isAuto = e.target.value === "auto";
    setAutoGenerateSKU(isAuto);
    setFormData({ ...formData, sku: isAuto ? "" : formData.sku });
  };

  useEffect(() => {
    axios
      .get(`${API_URL}/suppliers`)
      .then((res) => setSuppliers(res.data))
      .catch((err) => console.error("Error al cargar proveedores:", err));
  }, []);

  // ✅ Cargar `rubros.json` desde el frontend
  useEffect(() => {
    const fetchRubrics = async () => {
      try {
        const response = await axios.get(`${API_URL}/rubrics`);
        setRubrosData(response.data); // array de rubrics desde el backend
      } catch (error) {
        console.error("Error al cargar rubrics:", error);
      }
    };
    fetchRubrics();
  }, []);

  // ✅ Manejar cambio de rubro y actualizar categorías
  const handleRubroChange = (e) => {
    const selectedRubro = e.target.value;
    const selectedRubric = rubrosData.find((r) => r.name === selectedRubro);

    setFormData((prevData) => ({
      ...prevData,
      rubro: selectedRubro,
      categorias: selectedRubric ? selectedRubric.categories : [],
      categoria: "",
      attributes: [],
    }));
  };

  // ✅ Manejar cambio de categoría y asignar atributos
  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    const selectedCategoryObj = formData.categorias.find(
      (c) => c.name === selectedCategory
    );

    setFormData((prevData) => ({
      ...prevData,
      categoria: selectedCategory,
      attributes: selectedCategoryObj
        ? selectedCategoryObj.attributes.map((attr) => ({
            name: attr.name,
            type: attr.type,
            values: attr.values || [],
            value: attr.type === "list" ? attr.values[0] || "" : "",
          }))
        : [],
    }));
  };

  return (
    <Container className="form-container px-3 ">
      <h2 className="text-center" style={{ color: "#1D3557" }}>
        Agregar Producto
      </h2>
      <Form onSubmit={handleSubmit} className="pt-4">
        <Row>
          <Col md={6}>
            {/* Nombre */}
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

            {/* Rubro */}
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
                {rubrosData.map((r) => (
                  <option key={r.name} value={r.name}>
                    {r.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            {/* Categoría */}
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
                {formData.categorias?.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            {/* Precio Costo */}

            <Form.Group className="mb-3">
              <Form.Label style={{ color: "#213547" }}>Precio Costo</Form.Label>
              <Form.Control
                type="text"
                name="precio_costo"
                value={formData.precio_costo || "0,00"}
                onChange={handleChange}
                placeholder="Ejemplo: 1.500,00"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label style={{ color: "#213547" }}>
                Precio Público
              </Form.Label>
              <Form.Control
                type="text"
                name="precio_publico"
                value={formData.precio_publico || "0,00"}
                onChange={handleChange}
                placeholder="Ejemplo: 2.000,00"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label style={{ color: "#213547" }}>
                Fecha de Vencimiento
              </Form.Label>
              <DatePicker
                style={{ backgroundColor: "#fff" }}
                selected={
                  formData.fecha_vencimiento
                    ? new Date(formData.fecha_vencimiento)
                    : null
                }
                onChange={(date) =>
                  setFormData((prevData) => ({
                    ...prevData,
                    fecha_vencimiento: date,
                  }))
                }
                dateFormat="yyyy-MM-dd"
              />
            </Form.Group>

            {/* Sucursal */}
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

          <Col md={6}>
            {/* Cantidad en Stock */}
            <Form.Group className="mb-3">
              <Form.Label>Cantidad en Stock</Form.Label>
              <Form.Control
                type="number"
                name="cantidad_stock"
                value={formData.cantidad_stock}
                onChange={handleChange}
                required
              />
            </Form.Group>

            {/* Descripción */}
            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                required
              />
            </Form.Group>

            {/* Fabricante */}
            <Form.Group className="mb-3">
              <Form.Label>Fabricante</Form.Label>
              <Form.Control
                type="text"
                name="fabricante"
                list="proveedoresList"
                value={formData.fabricante}
                onChange={handleChange}
                placeholder="Escribí o seleccioná un proveedor..."
              />
              <datalist id="proveedoresList">
                {suppliers.map((s) => (
                  <option key={s._id} value={s.nombre} />
                ))}
              </datalist>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>SKU</Form.Label>
              <div>
                <Form.Check
                  type="radio"
                  label="Generar automáticamente"
                  name="skuOption"
                  value="auto"
                  checked={autoGenerateSKU}
                  onChange={handleSKUToggle}
                />
                <Form.Check
                  type="radio"
                  label="Asignar manualmente"
                  name="skuOption"
                  value="manual"
                  checked={!autoGenerateSKU}
                  onChange={handleSKUToggle}
                />
              </div>
              {!autoGenerateSKU && (
                <Form.Control
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                  placeholder="Ingrese SKU manualmente"
                />
              )}
            </Form.Group>

            {/* Imagen */}
            <Form.Group className="mb-3">
              <Form.Label>Imagen</Form.Label>
              <Form.Control
                type="file"
                name="image"
                accept="image/png, image/jpeg, image/jpg"
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>

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

        <Button type="submit">Agregar Producto</Button>
      </Form>
    </Container>
  );
};

export default ProductForm;
