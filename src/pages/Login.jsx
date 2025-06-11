import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import {
  FaUser,
  FaLock,
  FaInstagram,
  FaWhatsapp,
  FaEnvelope,
} from "react-icons/fa";

import "../styles/Login.css"; // ✅ Importar estilos personalizados
import logo from "../assets/devos-navbar-removebg.png"; // ✅ Importar el logo

const API_URL = import.meta.env.VITE_API_URL;

const Login = ({ setUser }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/auth/login`, formData);
      setUser(res.data.user); // ✅ Guardar usuario
      navigate("/dashboard"); // ✅ Redirigir al Dashboard
    } catch (err) {
      setError("❌ Usuario o contraseña incorrectos.");
    }
  };

  return (
    <Container fluid className="login-container">
      <Row>
        {/* ✅ Sección de formulario */}
        <Col
          md={6}
          className="d-flex flex-column justify-content-center align-items-center p-5"
        >
          <h2 className="fw-bold mb-4">Iniciar Sesión</h2>

          <Form className="w-100" onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <div className="input-container">
                <FaUser className="icon" />
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="Tu correo electrónico"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Contraseña</Form.Label>
              <div className="input-container">
                <FaLock className="icon" />
                <Form.Control
                  type="password"
                  name="password"
                  placeholder="Tu contraseña"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </Form.Group>

            {error && <p className="error-msg text-danger">{error}</p>}

            <Button className="login-btn w-100" type="submit">
              Ingresar
            </Button>

            {/* ✅ Redes sociales y datos de empresa */}
            <div className="social-links mt-4">
              <a
                href="https://www.instagram.com/tuempresa"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaInstagram className="social-icon" />
              </a>
              <a
                href="https://wa.me/123456789"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaWhatsapp className="social-icon" />
              </a>
              <a href="mailto:contacto@tuempresa.com">
                <FaEnvelope className="social-icon" />
              </a>
            </div>
          </Form>
        </Col>

        {/* ✅ Sección de imagen */}
        <Col
          md={6}
          className="d-none d-md-block px-0 seccion-image d-flex flex-column justify-content-center align-items-center"
        >
          <img
            src={logo}
            alt="Login image"
            className="login-image mb-4 animate-image"
          />
          <h2 className="fw-bold text-white text-center">
            Optimiza tu negocio
          </h2>
          <p className="text-white text-center w-75 mt-3">
            Conéctate, vende y gestiona todo desde un solo lugar. Accede a
            reportes, inventario y más herramientas avanzadas.
          </p>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
