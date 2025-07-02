import React, { useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import EditRubricModal from "./EditRubricModal";

const API_URL = import.meta.env.VITE_API_URL;

const RubricList = () => {
  const [rubrics, setRubrics] = useState([]);
  const [selectedRubric, setSelectedRubric] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchRubrics = async () => {
    try {
      const response = await axios.get(`${API_URL}/rubrics`);
      setRubrics(response.data);
    } catch (error) {
      console.error("Error loading rubrics:", error);
    }
  };

  useEffect(() => {
    fetchRubrics();
  }, []);

  const handleEdit = (rubric) => {
    setSelectedRubric(rubric);
    setShowModal(true);
  };

  const handleUpdateRubric = async (updatedRubric) => {
    try {
      await axios.put(`${API_URL}/rubrics/${updatedRubric._id}`, updatedRubric);
      fetchRubrics();
    } catch (error) {
      console.error("Error updating rubric:", error);
      alert("❌ Could not update rubric.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de que querés eliminar este rubro?"))
      return;

    try {
      await axios.delete(`${API_URL}/rubrics/${id}`);
      setRubrics((prev) => prev.filter((r) => r._id !== id));
    } catch (error) {
      console.error("Error deleting rubric:", error);
      alert("❌ No se pudo eliminar el rubro.");
    }
  };

  return (
    <div className="mt-5">
      <h4>📋 Lista de Rubros</h4>

      <Table striped bordered hover responsive size="sm">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Categorías</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {rubrics.map((rubric) => (
            <tr key={rubric._id}>
              <td>{rubric.name}</td>
              <td>{rubric.categories?.map((c) => c.name).join(", ")}</td>
              <td>
                <div className="d-flex gap-1">
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => handleEdit(rubric)}
                  >
                    <FaEdit />
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(rubric._id)}
                  >
                    <FaTrash />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal de edición */}
      <EditRubricModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        rubric={selectedRubric}
        handleUpdate={handleUpdateRubric}
      />
    </div>
  );
};

export default RubricList;
