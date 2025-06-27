import React, { useState, useEffect, useRef } from "react";
import QRCode from "react-qr-code";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Tab,
  Nav,
} from "react-bootstrap";
import axios from "axios";
import "../styles/Labels.css";
import JsBarcode from "jsbarcode";

const API_URL = import.meta.env.VITE_API_URL;

const Labels = () => {
  const [key, setKey] = useState("productos");
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    axios
      .get(`${API_URL}/products`)
      .then((res) => setProducts(res.data))
      .catch((error) => console.error("Error al obtener productos", error));
  }, []);

  const filteredProducts = products.filter(
    (product) =>
      product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.includes(searchTerm) ||
      product.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDownload = (sku) => {
    const element = document.getElementById(`label-preview-${sku}`);
    if (!element) return;

    const btn = element.querySelector("button");
    if (btn) btn.style.visibility = "hidden";

    html2canvas(element, { scale: 2, useCORS: true }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      pdf.addImage(imgData, "PNG", 10, 10, 80, 60);
      pdf.save(`Etiqueta_${sku}.pdf`);
      if (btn) btn.style.visibility = "visible";
    });
  };

  const handleDownloadAll = (tabKey) => {
    const etiquetas = document.querySelectorAll(`.label-preview-${tabKey}`);
    if (etiquetas.length === 0) return;

    const pdf = new jsPDF("p", "mm", "a4");
    let x = 10,
      y = 10;
    let count = 0;

    etiquetas.forEach((etiqueta, index) => {
      const btn = etiqueta.querySelector("button");
      if (btn) btn.style.visibility = "hidden";

      html2canvas(etiqueta, { scale: 2, useCORS: true })
        .then((canvas) => {
          const imgData = canvas.toDataURL("image/png");

          // ✅ Ajustamos las dimensiones para que entren 12 por hoja A4
          pdf.addImage(imgData, "PNG", x, y, 65, 40);

          count++;
          x += 70; // Espaciado horizontal

          if (count % 3 === 0) {
            x = 10;
            y += 55; // Espaciado vertical
          }

          // ✅ Guardamos el PDF al finalizar la última etiqueta
          if (index === etiquetas.length - 1) {
            pdf.save(`Etiquetas_${tabKey}.pdf`);
            etiquetas.forEach((et) => {
              const b = et.querySelector("button");
              if (b) b.style.visibility = "visible";
            });
          }
        })
        .catch((err) => console.error("❌ Error al capturar etiqueta:", err));
    });
  };

  const CodigoBarra = ({ sku }) => {
    const ref = useRef(null);

    useEffect(() => {
      if (ref.current) {
        JsBarcode(ref.current, sku, {
          format: "CODE128",
          displayValue: false,
          width: 2,
          height: 50,
          margin: 0,
        });
      }
    }, [sku]);

    return <svg ref={ref} />;
  };

  const handleDownloadProductos = () => handleDownloadAll("productos");
  const handleDownloadGondolas = () => handleDownloadAll("gondolas");
  const [codigoVisual, setCodigoVisual] = useState("qr"); // "qr" o "barra"

  return (
    <Container className="my-4 mt-5 mb-5 pt-5 pb-5">
      <h4 className="text-center mb-4">Gestión de Etiquetas</h4>

      <Form className="mb-3">
        <Form.Control
          type="text"
          placeholder="Buscar por nombre, SKU o categoría..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Form>

      <Tab.Container activeKey={key} onSelect={(k) => setKey(k)}>
        <Nav variant="tabs" className="mb-3">
          <Nav.Item>
            <Nav.Link eventKey="productos">Productos</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="gondolas">Góndolas</Nav.Link>
          </Nav.Item>
        </Nav>

        <Tab.Content>
          {/* Productos */}
          <Tab.Pane eventKey="productos">
            <Button
              variant="secondary"
              size="sm"
              className="mb-3"
              onClick={handleDownloadProductos}
            >
              Descargar todas las etiquetas de productos
            </Button>

            <Form.Select
              size="sm"
              className="mb-3"
              style={{ maxWidth: "250px" }}
              value={codigoVisual}
              onChange={(e) => setCodigoVisual(e.target.value)}
            >
              <option value="qr">Mostrar código QR</option>
              <option value="barra">Mostrar código de barras</option>
            </Form.Select>

            <Row xs={1} sm={2} md={3} className="g-3">
              {filteredProducts.map((product) => (
                <Col key={product.sku}>
                  <Card
                    id={`label-preview-${product.sku}`}
                    className="label-preview-productos text-center border border-1 p-2"
                  >
                    <Card.Body className="p-2">
                      <div style={{ fontSize: "14px", fontWeight: "bold" }}>
                        {product.nombre}
                      </div>
                      <div style={{ fontSize: "50px" }}>
                        ${product.precio_publico}
                      </div>
                      <div style={{ fontSize: "14px" }}>SKU: {product.sku}</div>
                      <div className="mt-2">
                        {codigoVisual === "barra" ? (
                          <CodigoBarra sku={product.sku} />
                        ) : (
                          <QRCode value={product.sku} size={120} />
                        )}
                      </div>
                      <Button
                        size="sm"
                        variant="outline-secondary"
                        className="mt-2"
                        onClick={() => handleDownload(product.sku)}
                      >
                        Descargar
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Tab.Pane>

          {/* Góndolas */}
          <Tab.Pane eventKey="gondolas">
            <Button
              variant="secondary"
              size="sm"
              className="mb-3"
              onClick={handleDownloadGondolas}
            >
              Descargar todas las etiquetas de góndolas
            </Button>

            <Row xs={1} sm={2} md={3} className="g-3">
              {filteredProducts.map((product) => (
                <Col key={product.sku}>
                  <Card
                    id={`label-preview-${product.sku}`}
                    className="label-preview-gondolas text-center border border-1 p-2"
                  >
                    <Card.Body className="p-2">
                      <div style={{ fontSize: "14px", fontWeight: "bold" }}>
                        {product.nombre}
                      </div>
                      <div style={{ fontSize: "50px" }}>
                        ${product.precio_publico}
                      </div>
                      <div style={{ fontSize: "14px" }}>SKU: {product.sku}</div>
                      <div className="mt-2"></div>
                      <Button
                        size="sm"
                        variant="outline-secondary"
                        className="mt-2"
                        onClick={() => handleDownload(product.sku)}
                      >
                        Descargar
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </Container>
  );
};

export default Labels;
