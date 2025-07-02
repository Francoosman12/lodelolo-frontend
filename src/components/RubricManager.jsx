import React, { useState, useEffect } from "react";
import { Form, Button, Card, Row, Col } from "react-bootstrap";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const RubricManager = () => {
  const [rubricName, setRubricName] = useState("");
  const [rubrics, setRubrics] = useState([]);
  const [categories, setCategories] = useState([
    {
      name: "",
      attributes: [{ name: "", type: "text", values: [] }],
    },
  ]);

  const fetchRubrics = async () => {
    try {
      const res = await axios.get(`${API_URL}/rubrics`);
      setRubrics(res.data);
    } catch (err) {
      console.error("Error fetching rubrics", err);
    }
  };

  useEffect(() => {
    fetchRubrics();
  }, []);

  const handleRubricSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: rubricName,
        categories,
      };
      await axios.post(`${API_URL}/rubrics`, payload);
      alert("✅ Rubro creado con éxito.");
      setRubricName("");
      setCategories([
        { name: "", attributes: [{ name: "", type: "text", values: [] }] },
      ]);
      fetchRubrics();
    } catch (err) {
      alert("❌ Error al crear rubro.");
      console.error(err);
    }
  };

  const handleAddCategory = () => {
    setCategories([
      ...categories,
      { name: "", attributes: [{ name: "", type: "text", values: [] }] },
    ]);
  };

  const handleAddAttribute = (catIndex) => {
    const updated = [...categories];
    updated[catIndex].attributes.push({ name: "", type: "text", values: [] });
    setCategories(updated);
  };

  return (
    <div className="mt-4">
      <h4>➕ Crear nuevo Rubro, Categoría y Atributos</h4>

      <Form onSubmit={handleRubricSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Nombre del Rubro</Form.Label>
          <Form.Control
            type="text"
            value={rubricName}
            onChange={(e) => setRubricName(e.target.value)}
            required
          />
        </Form.Group>

        {categories.map((cat, idx) => (
          <Card key={idx} className="mb-3">
            <Card.Body>
              <Form.Group className="mb-2">
                <Form.Label>Nombre Categoría</Form.Label>
                <Form.Control
                  type="text"
                  value={cat.name}
                  onChange={(e) => {
                    const updated = [...categories];
                    updated[idx].name = e.target.value;
                    setCategories(updated);
                  }}
                  required
                />
              </Form.Group>

              <h6>Atributos</h6>
              {cat.attributes.map((attr, aIdx) => (
                <Row key={aIdx} className="g-2 mb-2">
                  <Col sm={5}>
                    <Form.Control
                      placeholder="Nombre"
                      value={attr.name}
                      onChange={(e) => {
                        const updated = [...categories];
                        updated[idx].attributes[aIdx].name = e.target.value;
                        setCategories(updated);
                      }}
                      required
                    />
                  </Col>
                  <Col sm={3}>
                    <Form.Select
                      value={attr.type}
                      onChange={(e) => {
                        const updated = [...categories];
                        updated[idx].attributes[aIdx].type = e.target.value;
                        setCategories(updated);
                      }}
                    >
                      <option value="text">Texto</option>
                      <option value="list">Lista</option>
                    </Form.Select>
                  </Col>
                  <Col sm={4}>
                    <Form.Control
                      placeholder="Valores (separados por coma)"
                      disabled={attr.type !== "list"}
                      value={attr.values?.join(",") || ""}
                      onChange={(e) => {
                        const updated = [...categories];
                        updated[idx].attributes[aIdx].values = e.target.value
                          .split(",")
                          .map((v) => v.trim());
                        setCategories(updated);
                      }}
                    />
                  </Col>
                </Row>
              ))}
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={() => handleAddAttribute(idx)}
              >
                + Atributo
              </Button>
            </Card.Body>
          </Card>
        ))}

        <div className="mb-3">
          <Button
            variant="outline-primary"
            size="sm"
            onClick={handleAddCategory}
          >
            + Categoría
          </Button>
        </div>

        <Button type="submit" variant="success">
          Guardar Rubro
        </Button>
      </Form>
    </div>
  );
};

export default RubricManager;
