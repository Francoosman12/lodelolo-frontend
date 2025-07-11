import React, { useEffect, useState, useRef } from "react";
import { Modal, Button, Spinner } from "react-bootstrap";
import { Html5QrcodeScanner } from "html5-qrcode";
import Quagga from "quagga";

const SmartScannerHybrid = ({ setSearch }) => {
  const [showModal, setShowModal] = useState(false);
  const [scanMode, setScanMode] = useState(null); // 'qr' or 'barcode'
  const [loading, setLoading] = useState(false);
  const scannerReady = useRef(true);
  const scanCompleted = useRef(false);

  const openScanner = () => {
    if (!scannerReady.current) return;
    scannerReady.current = false;
    setShowModal(true);
    setScanMode(null);
  };

  const closeScanner = () => {
    scannerReady.current = true;
    setShowModal(false);
    scanCompleted.current = false;
    setScanMode(null);
    stopQuagga();
  };

  const onSuccessfulScan = (code) => {
    if (scanCompleted.current) return;
    scanCompleted.current = true;
    setSearch(code);
    closeScanner();
  };

  const stopQuagga = () => {
    try {
      Quagga.stop();
    } catch (err) {}
    Quagga.offDetected(() => {});
  };

  useEffect(() => {
    if (!scanMode) return;
    setLoading(true);

    if (scanMode === "qr") {
      const containerId = "qr-reader";
      const readerElement = document.getElementById(containerId);
      if (readerElement) {
        while (readerElement.firstChild) {
          readerElement.removeChild(readerElement.firstChild);
        }
      }

      const qrScanner = new Html5QrcodeScanner(
        containerId,
        {
          fps: 10,
          qrbox: 250,
          supportedScanTypes: [Html5QrcodeScanner.SCAN_TYPE_CAMERA], // ✅ cámara trasera
        },
        false
      );

      qrScanner.render(
        (decodedText) => {
          console.log("✅ QR detectado:", decodedText);
          qrScanner.clear().then(() => onSuccessfulScan(decodedText));
        },
        (errorMessage) => {
          console.warn("QR error:", errorMessage);
        }
      );

      setTimeout(() => setLoading(false), 1200);
    }

    if (scanMode === "barcode") {
      Quagga.init(
        {
          inputStream: {
            name: "Live",
            type: "LiveStream",
            target: document.querySelector("#barcode-reader"),
          },
          decoder: {
            readers: [
              "code_128_reader",
              "ean_reader",
              "ean_8_reader",
              "upc_reader",
            ],
          },
          locate: true,
        },
        (err) => {
          if (err) {
            console.error("Quagga init error:", err);
            return;
          }
          Quagga.start();
        }
      );

      Quagga.onDetected((data) => {
        const code = data.codeResult.code;
        console.log("📦 Código de barra detectado:", code);
        onSuccessfulScan(code);
      });

      setTimeout(() => setLoading(false), 1200);
    }

    return () => {
      stopQuagga();
    };
  }, [scanMode]);

  return (
    <>
      <Button
        onClick={openScanner}
        variant="outline-secondary"
        className="w-100"
      >
        📷 Escanear producto
      </Button>

      <Modal
        show={showModal}
        onHide={closeScanner}
        centered
        backdrop="static"
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>🔎 Seleccionar modo de escaneo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {!scanMode && (
            <div className="d-flex justify-content-around">
              <Button variant="dark" onClick={() => setScanMode("qr")}>
                🟪 QR
              </Button>
              <Button variant="dark" onClick={() => setScanMode("barcode")}>
                🟫 Código de Barra
              </Button>
            </div>
          )}

          {loading && (
            <div className="text-center mt-4">
              <Spinner animation="border" />
              <p className="mt-2">Activando cámara...</p>
            </div>
          )}

          {scanMode === "qr" && (
            <div id="qr-reader" style={{ width: "100%", marginTop: "20px" }} />
          )}
          {scanMode === "barcode" && (
            <div
              id="barcode-reader"
              style={{ width: "100%", marginTop: "20px" }}
            />
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default SmartScannerHybrid;
