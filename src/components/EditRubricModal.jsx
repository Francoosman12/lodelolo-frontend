import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const EditRubricModal = ({ show, handleClose, rubric, handleUpdate }) => {
  const [editedRubric, setEditedRubric] = useState(null);

  useEffect(() => {
    if (rubric) {
      setEditedRubric({
        ...rubric,
        categories: rubric.categories.map((cat) => ({
          ...cat,
          attributes: cat.attributes.map((a) => ({
            ...a,
            values: Array.isArray(a.values) ? a.values : [],
          })),
        })),
      });
    }
  }, [rubric]);

  const handleCategoryChange = (value, index) => {
    const updated = [...editedRubric.categories];
    updated[index].name = value;
    setEditedRubric({ ...editedRubric, categories: updated });
  };

  const handleAttributeChange = (catIndex, attrIndex, field, value) => {
    const updated = [...editedRubric.categories];
    updated[catIndex].attributes[attrIndex][field] =
      field === "values" ? value.split(",").map((v) => v.trim()) : value;
    setEditedRubric({ ...editedRubric, categories: updated });
  };

  const handleAddAttribute = (catIndex) => {
    const updated = [...editedRubric.categories];
    updated[catIndex].attributes.push({ name: "", type: "text", values: [] });
    setEditedRubric({ ...editedRubric, categories: updated });
  };

  const handleAddCategory = () => {
    const newCategory = {
      name: "",
      attributes: [{ name: "", type: "text", values: [] }],
    };
    setEditedRubric((prev) => ({
      ...prev,
      categories: [...prev.categories, newCategory],
    }));
  };

  const handleSave = () => {
    if (!editedRubric.name) {
      alert("La rubro debe tener un nombre.");
      return;
    }
    handleUpdate(editedRubric);
    alert("✅ Rubro actualizado con éxito.");
    handleClose();
  };

  if (!editedRubric) return null;

  const handleDeleteCategoryFromServer = async (rubricId, categoryName) => {
    try {
      const response = await axios.delete(
        `${API_URL}/rubrics/${rubricId}/categories/${encodeURIComponent(
          categoryName
        )}`
      );
      setEditedRubric(response.data); // actualizar con la versión ya modificada
    } catch (error) {
      console.error("Error al eliminar categoría:", error);
      alert("❌ No se pudo eliminar la categoría.");
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>✏️ Editar Rubro</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Nombre de Rubro</Form.Label>
            <Form.Control
              type="text"
              value={editedRubric.name}
              onChange={(e) =>
                setEditedRubric({ ...editedRubric, name: e.target.value })
              }
            />
          </Form.Group>

          {editedRubric.categories.map((cat, catIdx) => (
            <div key={catIdx} className="mb-4 border p-3 rounded">
              <Form.Group className="mb-2">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <Form.Label className="mb-0">Nombre de Categoría</Form.Label>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() =>
                      handleDeleteCategoryFromServer(editedRubric._id, cat.name)
                    }
                  >
                    🗑️ Eliminar
                  </Button>
                </div>
                <Form.Control
                  type="text"
                  value={cat.name}
                  onChange={(e) => handleCategoryChange(e.target.value, catIdx)}
                />
              </Form.Group>

              {cat.attributes.map((attr, attrIdx) => (
                <Row className="g-2 mb-2" key={attrIdx}>
                  <Col md={4}>
                    <Form.Control
                      value={attr.name}
                      onChange={(e) =>
                        handleAttributeChange(
                          catIdx,
                          attrIdx,
                          "name",
                          e.target.value
                        )
                      }
                      placeholder="Nombre del atributo"
                    />
                  </Col>
                  <Col md={3}>
                    <Form.Select
                      value={attr.type}
                      onChange={(e) =>
                        handleAttributeChange(
                          catIdx,
                          attrIdx,
                          "type",
                          e.target.value
                        )
                      }
                    >
                      <option value="text">Texto</option>
                      <option value="list">Lista</option>
                    </Form.Select>
                  </Col>
                  <Col md={5}>
                    <Form.Control
                      disabled={attr.type !== "list"}
                      value={attr.values?.join(",") || ""}
                      onChange={(e) =>
                        handleAttributeChange(
                          catIdx,
                          attrIdx,
                          "values",
                          e.target.value
                        )
                      }
                      placeholder="Valores (separados por coma)"
                    />
                  </Col>
                </Row>
              ))}

              <div className="mt-2">
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={() => handleAddAttribute(catIdx)}
                >
                  + Atributo
                </Button>
              </div>
            </div>
          ))}

          <div className="d-flex justify-content-end mb-3">
            <Button
              variant="outline-primary"
              size="sm"
              onClick={handleAddCategory}
            >
              + Categoría
            </Button>
          </div>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Guardar Cambios
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditRubricModal;
