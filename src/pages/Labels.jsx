import React, { useState, useEffect, useRef } from "react";
import QRCode from "react-qr-code";
import JsBarcode from "jsbarcode";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const Labels = () => {
  const [products, setProducts] = useState([]);
  const [labelType, setLabelType] = useState("qr");
  const allLabelsRef = useRef(null);

  useEffect(() => {
    axios
      .get(`${API_URL}/products`)
      .then((res) => setProducts(res.data))
      .catch((error) => console.error("Error al obtener productos", error));
  }, []);

  useEffect(() => {
    products.forEach((product) => {
      if (labelType === "barcode") {
        JsBarcode(`#barcode-${product.sku}`, product.sku, {
          format: "CODE128",
        });
      }
    });
  }, [products, labelType]);

  const handleDownload = (sku) => {
    const element = document.getElementById(`label-preview-${sku}`);
    const buttonContainer = document.getElementById(`button-container-${sku}`);

    // Ocultar botón antes de la captura
    buttonContainer.style.display = "none";

    html2canvas(element).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      pdf.addImage(imgData, "PNG", 10, 10);
      pdf.save(`Etiqueta_${sku}.pdf`);

      // Restaurar visibilidad del botón
      buttonContainer.style.display = "block";
    });
  };

  const handleDownloadAll = () => {
    // Ocultar todos los botones antes de la captura
    document
      .querySelectorAll(".button-container")
      .forEach((el) => (el.style.display = "none"));

    html2canvas(allLabelsRef.current, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4"); // Ajustar a tamaño A4
      const imgWidth = 210; // Ancho A4 en mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width; // Escalar correctamente

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save("Etiquetas_Todas.pdf");

      // Restaurar visibilidad de los botones después de la captura
      document
        .querySelectorAll(".button-container")
        .forEach((el) => (el.style.display = "block"));
    });
  };

  return (
    <Container className="my-4 mt-5 mb-5 pt-5 pb-5">
      <h2>Generar Etiquetas de Productos</h2>
      <Form.Select
        onChange={(e) => setLabelType(e.target.value)}
        className="mb-4"
      >
        <option value="qr">Código QR</option>
        <option value="barcode">Código de barras</option>
      </Form.Select>

      <Button variant="success" className="mb-3" onClick={handleDownloadAll}>
        Descargar Todas las Etiquetas
      </Button>

      <Row xs={1} md={3} lg={4} className="g-4" ref={allLabelsRef}>
        {products.map((product) => (
          <Col key={product.sku}>
            <Card id={`label-preview-${product.sku}`} className="p-3">
              <Card.Body>
                <Card.Title>{product.nombre}</Card.Title>
                <Card.Text>
                  <strong>Categoría:</strong> {product.categoria}
                  <br />
                  <strong>Precio:</strong> ${product.precio_publico}
                  <br />
                  <strong>SKU:</strong> {product.sku}
                </Card.Text>
                {labelType === "qr" ? (
                  <QRCode value={product.sku} size={128} />
                ) : (
                  <svg id={`barcode-${product.sku}`}></svg>
                )}
                <div
                  id={`button-container-${product.sku}`}
                  className="button-container"
                >
                  <Button
                    variant="primary"
                    className="mt-3"
                    onClick={() => handleDownload(product.sku)}
                  >
                    Descargar Etiqueta
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Labels;
