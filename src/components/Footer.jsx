import React from "react";
import { Container } from "react-bootstrap";
import "../styles/Footer.css";

const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: "#1D3557",
        color: "#ffffff",
        padding: "15px 0",
        textAlign: "center",
      }}
    >
      <Container>
        <p>
          © {new Date().getFullYear()} DevOs. Todos los derechos reservados.
        </p>
      </Container>
    </footer>
  );
};

export default Footer;
