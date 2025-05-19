import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Container, Form, Button, Pagination } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import "../styles/UserList.css";
import EditUserModal from "../components/EditUserModal"; // ✅ Importar el modal

const API_URL = import.meta.env.VITE_API_URL;

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    axios
      .get(`${API_URL}/users`)
      .then((res) => setUsers(res.data))
      .catch((error) => console.error("❌ Error al obtener usuarios:", error));
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("¿Seguro que quieres eliminar este usuario?")) {
      try {
        await axios.delete(`${API_URL}/users/${id}`);
        setUsers(users.filter((user) => user._id !== id));
        alert("✅ Usuario eliminado correctamente.");
      } catch (error) {
        console.error("❌ Error al eliminar usuario:", error);
        alert("⚠️ Hubo un error al eliminar el usuario.");
      }
    }
  };

  const handleEditUser = (user) => {
    console.log("Editando usuario:", user);
    setSelectedUser(user);
    setShowModal(true);
    console.log("Estado showModal:", showModal); // ✅ Verifica si cambia a `true`
  };

  const filteredUsers = users.filter(
    (user) =>
      user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const refreshUsers = () => {
    axios
      .get(`${API_URL}/users`)
      .then((res) => setUsers(res.data))
      .catch((error) => console.error("❌ Error al obtener usuarios:", error));
  };

  return (
    <Container className="user-container mt-4">
      <h2 className="text-center">Lista de Usuarios</h2>

      <Form className="d-flex justify-content-between mb-3 flex-wrap">
        <Form.Control
          type="text"
          placeholder="Buscar por nombre o email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-2"
        />
        <Form.Select
          onChange={(e) => setItemsPerPage(Number(e.target.value))}
          value={itemsPerPage}
          className="mb-2"
        >
          {[10, 20, 50, 100].map((num) => (
            <option key={num} value={num}>
              {num} usuarios
            </option>
          ))}
        </Form.Select>
      </Form>

      <div className="table-responsive">
        <Table striped bordered hover>
          <thead className="bg-primary text-white">
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Rol</th>
              <th>Sucursal</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map((user) => (
              <tr key={user._id}>
                <td>{user.nombre}</td>
                <td>{user.email}</td>
                <td>{user.telefono}</td>
                <td>{user.rol}</td>
                <td>{user.sucursal?.nombre || "Sin sucursal"}</td>
                <td>
                  <div className="d-flex gap-1">
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => handleEditUser(user)}
                    >
                      <FaEdit />
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(user._id)}
                    >
                      <FaTrash />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* ✅ Paginación */}
      <Pagination className="justify-content-center mt-3">
        {[...Array(totalPages)].map((_, page) => (
          <Pagination.Item
            key={page + 1}
            active={page + 1 === currentPage}
            onClick={() => setCurrentPage(page + 1)}
          >
            {page + 1}
          </Pagination.Item>
        ))}
      </Pagination>

      {/* ✅ Llamar a `EditUserModal` cuando se haga clic en "Editar" */}
      <EditUserModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        user={selectedUser}
        refreshUsers={refreshUsers}
      />
    </Container>
  );
};

export default UserList;
