import React, { useEffect, useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import "../styles/ProductForm.css";

const ProductForm = ({
  formData,
  handleChange,
  handleSubmit,
  rubros,
  sucursales,
  setFormData,
}) => {
  const [rubrosData, setRubrosData] = useState([]);

  // ✅ Cargar `rubros.json` desde el frontend
  useEffect(() => {
    const fetchRubros = async () => {
      try {
        const response = await fetch("/data/rubros.json");
        const data = await response.json();
        setRubrosData(data.rubros);
      } catch (error) {
        console.error("Error al cargar rubros:", error);
      }
    };
    fetchRubros();
  }, []);

  // ✅ Manejar cambio de rubro y actualizar categorías
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

  return (
    <Container className="form-container mt-5 pt-5 mb-5 pb-5">
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
                {rubrosData.map((rubro) => (
                  <option key={rubro.nombre} value={rubro.nombre}>
                    {rubro.nombre}
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
                {formData.categorias?.map((categoria) => (
                  <option key={categoria.nombre} value={categoria.nombre}>
                    {categoria.nombre}
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
                value={formData.fabricante}
                onChange={handleChange}
              />
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

        {/* ✅ Renderizar atributos dinámicos */}
        {Array.isArray(formData.atributos) &&
          formData.atributos.length > 0 &&
          formData.atributos.map((attr, index) => (
            <Form.Group className="mb-3" key={index}>
              <Form.Label>{attr.nombre}</Form.Label>
              {attr.tipo === "lista" ? (
                <Form.Select
                  name={attr.nombre}
                  value={attr.valor}
                  onChange={(e) => {
                    const updatedAttributes = [...formData.atributos];
                    updatedAttributes[index].valor = e.target.value;
                    setFormData({ ...formData, atributos: updatedAttributes });
                  }}
                >
                  {attr.valores.map((val, i) => (
                    <option key={i} value={val}>
                      {val}
                    </option>
                  ))}
                </Form.Select>
              ) : (
                <Form.Control
                  type="text"
                  name={attr.nombre}
                  value={attr.valor}
                  onChange={handleChange}
                />
              )}
            </Form.Group>
          ))}

        <Button type="submit">Agregar Producto</Button>
      </Form>
    </Container>
  );
};

export default ProductForm;
