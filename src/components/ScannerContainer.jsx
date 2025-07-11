import React, { useState, useRef, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import { Html5QrcodeScanner } from "html5-qrcode";

const ScannerLocal = ({ onScanSuccess }) => {
  useEffect(() => {
    console.log("🟢 Scanner montado");

    const containerId = "reader";
    let hasScanned = false;

    const readerElement = document.getElementById(containerId);
    if (!readerElement) {
      console.warn("⚠️ #reader no encontrado");
      return;
    }

    while (readerElement.firstChild) {
      readerElement.removeChild(readerElement.firstChild);
    }

    const scanner = new Html5QrcodeScanner(
      containerId,
      { fps: 10, qrbox: 250 },
      false
    );
    console.log("🚀 Escáner instanciado");

    scanner.render(
      (decodedText) => {
        console.log("✅ Código detectado:", decodedText);
        if (!hasScanned) {
          hasScanned = true;
          scanner.clear().then(() => onScanSuccess(decodedText));
        }
      },
      (error) => {
        console.log("📛 Error escaneando (ignorado):", error?.name);
      }
    );

    return () => {
      console.log("🔴 Scanner desmontado");
      scanner.clear().catch(() => {});
    };
  }, [onScanSuccess]);

  return <div id="reader" style={{ width: "100%" }} />;
};

const ScannerContainer = ({ setSearch }) => {
  const [showScanner, setShowScanner] = useState(false);
  const scannerReady = useRef(true);

  const handleOpen = () => {
    if (scannerReady.current) {
      scannerReady.current = false;
      setShowScanner(true);
    }
  };

  const handleClose = () => {
    scannerReady.current = true;
    setShowScanner(false);
  };

  return (
    <>
      <Button
        variant="outline-secondary"
        onClick={handleOpen}
        className="w-100"
      >
        📷 Escanear
      </Button>

      <Modal
        show={showScanner}
        onHide={handleClose}
        centered
        backdrop="static"
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>📲 Escanear producto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ScannerLocal
            onScanSuccess={(text) => {
              setSearch(text);
              handleClose();
            }}
          />
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ScannerContainer;
