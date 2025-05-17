import React, { useEffect, useState } from "react";
import axios from "axios";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import "../styles/ProductForm.css";

const ProductForm = ({
  formData,
  handleChange,
  handleSubmit,
  rubros,
  categories,
  sucursales,
  setFormData,
}) => {
  const [attributes, setAttributes] = useState([]);

  // ✅ Obtener atributos desde la API
  useEffect(() => {
    const fetchAttributes = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/attributes`
        );
        setAttributes(response.data); // 🔥 Guarda los atributos en el estado
      } catch (error) {
        console.error("Error al obtener atributos:", error);
      }
    };
    fetchAttributes();
  }, []);

  // ✅ Actualizar atributos según la categoría seleccionada
  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;

    const matchedAttribute = attributes.find(
      (attr) => attr.categoria === selectedCategory
    );

    setFormData((prevData) => ({
      ...prevData,
      categoria: selectedCategory,
      atributos: matchedAttribute ? { Talla: "" } : {}, // ✅ Solo guarda "Talla", no "valores"
    }));
  };

  return (
    <Container className="form-container">
      <h2 className="text-center" style={{ color: "#1D3557" }}>
        Agregar Producto
      </h2>
      <Form onSubmit={handleSubmit} className="pt-4">
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label style={{ color: "#213547" }}>Nombre</Form.Label>
              <Form.Control
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                style={{ borderColor: "#A8DADC" }}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label style={{ color: "#213547" }}>Rubro</Form.Label>
              <Form.Select
                name="rubro"
                value={formData.rubro}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Seleccione un rubro
                </option>
                {rubros.map((rubro) => (
                  <option key={rubro} value={rubro}>
                    {rubro}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label style={{ color: "#213547" }}>Categoría</Form.Label>
              <Form.Select
                name="categoria"
                value={formData.categoria}
                onChange={handleCategoryChange}
                required
              >
                <option value="" disabled>
                  Seleccione una categoría
                </option>
                {categories.map((categoria) => (
                  <option key={categoria} value={categoria}>
                    {categoria}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label style={{ color: "#213547" }}>Precio Costo</Form.Label>
              <Form.Control
                type="text"
                name="precio_costo"
                value={formData.precio_costo || "0,00"}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label style={{ color: "#213547" }}>Sucursal</Form.Label>
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
            <Form.Group className="mb-3">
              <Form.Label style={{ color: "#213547" }}>
                Precio Público
              </Form.Label>
              <Form.Control
                type="text"
                name="precio_publico"
                value={formData.precio_publico || "0,00"}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label style={{ color: "#213547" }}>
                Cantidad en Stock
              </Form.Label>
              <Form.Control
                type="number"
                name="cantidad_stock"
                value={formData.cantidad_stock}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label style={{ color: "#213547" }}>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label style={{ color: "#213547" }}>Fabricante</Form.Label>
              <Form.Control
                type="text"
                name="fabricante"
                value={formData.fabricante}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label style={{ color: "#213547" }}>Imagen</Form.Label>
              <Form.Control
                type="file"
                name="image"
                accept="image/png, image/jpeg, image/jpg"
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>
        {/* ✅ Renderizar atributos automáticos según la categoría */}
        {formData.atributos && formData.atributos.Talla !== undefined && (
          <Form.Group className="mb-3">
            <Form.Label>Talla</Form.Label>
            <Form.Select
              name="Talla"
              value={formData.atributos.Talla || ""}
              onChange={(e) => {
                setFormData((prevData) => ({
                  ...prevData,
                  atributos: { Talla: e.target.value }, // ✅ Solo guarda la talla
                }));
              }}
            >
              {attributes
                .find((attr) => attr.categoria === formData.categoria)
                ?.valores.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
            </Form.Select>
          </Form.Group>
        )}

        {/* ✅ Asegurar que `setFormData` actualiza los valores al hacer submit */}
        <Button
          type="submit"
          style={{
            backgroundColor: "#F4A261",
            borderColor: "#E76F51",
            color: "#ffffff",
          }}
          onClick={() => console.log("Enviando:", formData)}
        >
          Agregar Producto
        </Button>
      </Form>
    </Container>
  );
};

export default ProductForm;
