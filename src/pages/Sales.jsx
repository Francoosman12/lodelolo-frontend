import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import "../styles/Sales.css";

const API_URL = import.meta.env.VITE_API_URL;

const Sales = ({ user }) => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(user || null);
  const total = cart.reduce(
    (sum, item) => sum + parseFloat(item.precio_publico || 0),
    0
  );

  const [paymentMethod, setPaymentMethod] = useState("efectivo");
  const [paymentDetails, setPaymentDetails] = useState({
    moneda: "pesos",
    monto: total,
  });
  const [cliente, setCliente] = useState("");
  const [direccionEntrega, setDireccionEntrega] = useState("");
  const [comentario, setComentario] = useState("");

  useEffect(() => {
    if (!user) {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
        console.log(
          "✅ Usuario recuperado desde localStorage:",
          JSON.parse(storedUser)
        );
      }
    }
  }, []);

  useEffect(() => {
    let currentUser = user;

    if (!currentUser) {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        currentUser = JSON.parse(storedUser);
      }
    }

    if (!currentUser || !currentUser.sucursal) {
      console.warn("⚠ Usuario o sucursal no definidos, esperando datos...");
      setLoading(false);
      return;
    }

    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/products/sucursal/${currentUser.sucursal}`
        );
        console.log("Productos obtenidos:", res.data);
        setProducts(res.data);
      } catch (error) {
        console.error("Error al obtener productos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleCheckout = async () => {
    console.log("Usuario al procesar compra:", currentUser);

    if (cart.length === 0) {
      alert(
        "⚠ El carrito está vacío. Agrega productos antes de finalizar la compra."
      );
      return;
    }

    if (!currentUser) {
      alert(
        "⚠ No se ha identificado al usuario. Inicia sesión antes de proceder."
      );
      return;
    }

    const totalCompra = Number(
      cart
        .reduce(
          (sum, item) =>
            sum + parseFloat(item.precio_publico || 0) * (item.cantidad || 1),
          0
        )
        .toFixed(2)
    );

    const saleData = {
      id_vendedor: currentUser._id,
      sucursal: currentUser.sucursal,
      productos: cart.map((item) => ({
        id_producto: item._id,
        cantidad_vendida: item.cantidad || 1,
        subtotal: parseFloat(item.precio_publico || 0) * (item.cantidad || 1),
      })),
      total: totalCompra,
      metodo_pago: {
        tipo: paymentMethod,
        detalles:
          paymentMethod === "combinado"
            ? paymentDetails
            : { [paymentMethod]: paymentDetails },
      },
      comentario,
      direccion_entrega: direccionEntrega,
      cliente,
    };

    console.log("🛒 Datos enviados al backend:", saleData);

    try {
      const response = await axios.post(`${API_URL}/sales`, saleData);
      console.log("✅ Venta registrada:", response.data);
      alert("🎉 Venta realizada con éxito!");
      setCart([]);

      // 🔄 Recargar la página después de completar la venta
      window.location.reload();
    } catch (error) {
      console.error(
        "❌ Error al registrar la venta:",
        error.response?.data || error.message
      );
      alert("Hubo un error al procesar la venta.");
    }
  };

  const handleAddToCart = (product) => {
    if (!product || product.cantidad_stock <= 0) {
      console.warn(
        "⚠️ Este producto no tiene stock suficiente y no puede agregarse."
      );
      return; // 🚫 Evita que se agregue
    }

    setCart((prevCart) => [...prevCart, product]);
  };

  const handleRemoveFromCart = (index) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  if (loading) {
    return <p className="text-center text-warning">🔄 Cargando productos...</p>;
  }

  const handleQuantityChange = (index, increment) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.map((item, i) =>
        i === index
          ? { ...item, cantidad: Math.max(1, (item.cantidad || 1) + increment) } // ✅ Asegura que la cantidad siempre sea 1 o más
          : item
      );
      console.log("Nuevo estado actualizado del carrito:", updatedCart);
      return [...updatedCart];
    });
  };

  const handlePaymentChange = (e) => {
    const method = e.target.value;
    setPaymentMethod(method);

    if (method === "tarjeta") {
      setPaymentDetails({ tipo: "credito", monto: total }); // 📌 Crédito por defecto, se puede modificar
    } else if (method === "efectivo") {
      setPaymentDetails({ moneda: "pesos", monto: total });
    } else if (method === "combinado") {
      setPaymentDetails({
        tarjeta: { tipo: "credito", monto: total / 2 },
        efectivo: { moneda: "pesos", monto: total / 2 },
      });
    }
  };

  return (
    <Container fluid className="sales-container">
      <Row>
        {/* ✅ Sección 1: Carrito */}
        <Col md={4} className="cart-section mt-5 pt-5 mb-5 pb-5">
          <h3>🛒 Carrito de compras</h3>
          {cart.length === 0 ? (
            <p className="text-muted">Aún no hay productos agregados.</p>
          ) : (
            <table className="cart-table">
              <thead>
                <tr>
                  <th>Imagen</th>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Precio</th>
                  <th>Eliminar</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item, index) => (
                  <tr key={index}>
                    <td>
                      <img
                        src={
                          item.imagen_url || "https://via.placeholder.com/45"
                        }
                        alt={item.nombre}
                        className="cart-img"
                      />
                    </td>
                    <td>{item.nombre}</td>
                    <td>
                      <div className="quantity-container">
                        <Button
                          variant="secondary"
                          size="sm"
                          className="quantity-btn"
                          onClick={() => handleQuantityChange(index, -1)}
                        >
                          ➖
                        </Button>
                        <span className="quantity-value">
                          {item.cantidad || 1}
                        </span>
                        <Button
                          variant="secondary"
                          size="sm"
                          className="quantity-btn"
                          onClick={() => handleQuantityChange(index, 1)}
                        >
                          ➕
                        </Button>
                      </div>
                    </td>
                    <td>
                      $
                      {(
                        parseFloat(item.precio_publico || 0) *
                        (item.cantidad || 1)
                      ).toFixed(2)}
                    </td>
                    <td>
                      <Button
                        variant="danger"
                        size="sm"
                        className="remove-btn"
                        onClick={() => handleRemoveFromCart(index)}
                      >
                        ❌
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <h4 className="mt-3 total-box">
            Total:{" "}
            <strong>
              $
              {cart
                .reduce(
                  (sum, item) =>
                    sum +
                    parseFloat(item.precio_publico || 0) * (item.cantidad || 1),
                  0
                )
                .toFixed(2)}
            </strong>
          </h4>

          <Form.Group controlId="paymentMethod">
            <Form.Label>🛒 Método de pago</Form.Label>
            <Form.Select
              value={paymentMethod}
              onChange={handlePaymentChange}
              className="mb-3"
            >
              <option value="efectivo">Efectivo</option>
              <option value="tarjeta">Tarjeta</option>
              <option value="combinado">Combinado</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3" controlId="nombreCliente">
            <Form.Label>👤 Nombre del cliente</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ej: Juan Pérez"
              value={cliente}
              onChange={(e) => setCliente(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="direccionEntrega">
            <Form.Label>🏠 Dirección de entrega</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ej: Calle Falsa 123"
              value={direccionEntrega}
              onChange={(e) => setDireccionEntrega(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="comentario">
            <Form.Label>📝 Comentario</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              placeholder="Ej: Sin hielo / Llevar servilletas"
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
            />
          </Form.Group>

          <Button
            variant="success"
            className="mt-3 btn-lg"
            onClick={handleCheckout}
          >
            Finalizar Compra
          </Button>
        </Col>

        {/* ✅ Sección 2: Productos */}
        <Col md={8} className="product-section pt-4">
          <Form.Control
            type="text"
            placeholder="🔍 Buscar producto por nombre, SKU o categoría..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-bar mb-3 mt-5"
          />
          <Row>
            {products.length === 0 ? (
              <p className="text-center text-danger">
                ⚠ No hay productos disponibles.
              </p>
            ) : (
              products
                .filter((product) => product.activo === true) // ✅ Filtrar productos activos
                .filter(
                  (product) =>
                    (product.sku && product.sku.includes(search)) ||
                    (product.nombre &&
                      product.nombre
                        .toLowerCase()
                        .includes(search.toLowerCase())) ||
                    (product.categoria &&
                      product.categoria
                        .toLowerCase()
                        .includes(search.toLowerCase()))
                )
                .map((product) => (
                  <Col md={4} key={product._id}>
                    <Card className="product-card">
                      <Card.Img
                        variant="top"
                        src={
                          product.imagen_url ||
                          "https://via.placeholder.com/150"
                        }
                      />
                      <Card.Body>
                        <Card.Title>
                          {product.nombre || "Sin nombre"}
                        </Card.Title>
                        <Card.Text>
                          ${parseFloat(product.precio_publico || 0).toFixed(2)}
                        </Card.Text>
                        <Card.Text
                          className={
                            product.cantidad_stock > 0
                              ? "text-success"
                              : "text-danger"
                          }
                        >
                          {product.cantidad_stock > 0
                            ? `Stock disponible: ${product.cantidad_stock}`
                            : "❌ Agotado"}
                        </Card.Text>
                        <Button
                          variant={
                            product.cantidad_stock > 0 ? "primary" : "secondary"
                          }
                          onClick={() =>
                            product.cantidad_stock > 0 &&
                            handleAddToCart(product)
                          } // ✅ Bloquear función
                          disabled={product.cantidad_stock === 0}
                        >
                          {product.cantidad_stock > 0
                            ? "Agregar al carrito"
                            : "Sin stock"}
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                ))
            )}
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default Sales;
