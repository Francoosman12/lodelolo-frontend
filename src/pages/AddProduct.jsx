import React, { useState, useEffect } from "react";
import ProductForm from "../components/ProductForm";
import axios from "axios";
import "../styles/AddProduct.css"; // Asegúrate de tener este archivo CSS
import logo from "../assets/4.png"; // Asegúrate de tener esta imagen

const API_URL = import.meta.env.VITE_API_URL;

const AddProduct = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    rubro: "",
    categoria: "",
    atributos: [],
    precio_costo: "",
    precio_publico: "",
    cantidad_stock: "",
    descripcion: "",
    fabricante: "",
    imagen_url: "",
    sucursal: "",
    image: null,
    fecha_vencimiento: "",
  });

  const [sucursales, setSucursales] = useState([]);
  const [rubrosData, setRubrosData] = useState([]);
  const [autoGenerateSKU, setAutoGenerateSKU] = useState(true);

  // ✅ Cargar sucursales desde el backend
  useEffect(() => {
    axios.get(`${API_URL}/sucursales`).then((res) => setSucursales(res.data));
  }, []);

  // ✅ Obtener `rubros.json` desde el frontend
  useEffect(() => {
    const fetchRubrics = async () => {
      try {
        const response = await axios.get(`${API_URL}/rubrics`);
        setRubrosData(response.data); // cada rubro tiene .name y .categories[]
      } catch (error) {
        console.error("Error loading rubrics:", error);
      }
    };
    fetchRubrics();
  }, []);

  // ✅ Manejar cambios en los formularios
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      setFormData((prevData) => ({
        ...prevData,
        image: files.length > 0 ? files[0] : null,
      }));
    } else if (name === "fecha_vencimiento") {
      console.log("📅 Fecha seleccionada:", value);
      setFormData((prevData) => ({
        ...prevData,
        fecha_vencimiento: value ? new Date(value) : null, // ✅ Almacena como `Date`
      }));
    } else if (name === "precio_costo" || name === "precio_publico") {
      let inputValue = value.replace(/[^0-9]/g, "");

      while (inputValue.length < 3) {
        inputValue = "0" + inputValue;
      }

      const integerPart = inputValue.slice(0, -2);
      const decimalPart = inputValue.slice(-2);

      const formattedIntegerPart = integerPart
        .replace(/^0+(?!$)/, "")
        .replace(/\B(?=(\d{3})+(?!\d))/g, ".");

      const formattedValue = `${formattedIntegerPart || "0"},${decimalPart}`;

      setFormData((prevData) => ({
        ...prevData,
        [name]: formattedValue,
      }));
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  // ✅ Enviar datos al backend con la imagen
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();

    // ✅ Si el usuario asignó manualmente el SKU, enviarlo en la solicitud
    if (!autoGenerateSKU && formData.sku.trim() !== "") {
      formDataToSend.append("sku", formData.sku);
    }

    const atributosElegidos = formData.attributes
      .filter((attr) => attr.name === formData.selectedOption)
      .map((attr) => ({
        nombre: attr.name,
        tipo: attr.type,
        valor: attr.value,
      }));

    formDataToSend.append("atributos", JSON.stringify(atributosElegidos));

    const precioCosto = formData.precio_costo
      .replace(/\./g, "")
      .replace(",", ".");
    const precioPublico = formData.precio_publico
      .replace(/\./g, "")
      .replace(",", ".");

    formDataToSend.append("precio_costo", precioCosto);
    formDataToSend.append("precio_publico", precioPublico);

    Object.entries(formData).forEach(([key, value]) => {
      if (
        !["atributos", "image", "precio_costo", "precio_publico"].includes(key)
      ) {
        formDataToSend.append(key, value);
      }
    });

    if (formData.image && formData.image instanceof File) {
      formDataToSend.append("image", formData.image);
    }

    if (formData.fecha_vencimiento) {
      console.log("📅 Fecha antes de enviar:", formData.fecha_vencimiento);

      formDataToSend.append(
        "fecha_vencimiento",
        formData.fecha_vencimiento.toISOString()
      ); // ✅ Enviar en formato ISO
    }

    console.log(
      "🚀 Datos finales a enviar:",
      Object.fromEntries(formDataToSend.entries())
    );

    try {
      const response = await axios.post(`${API_URL}/products`, formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("✅ Producto agregado exitosamente.");
      setFormData({
        nombre: "",
        rubro: "",
        categoria: "",
        atributos: [],
        precio_costo: "",
        precio_publico: "",
        cantidad_stock: "",
        sku: "", // ✅ Limpiar SKU manual después de enviarlo
        descripcion: "",
        fabricante: "",
        imagen_url: "",
        sucursal: "",
        image: null,
      });
    } catch (error) {
      console.error(
        "❌ Error al agregar producto:",
        error.response?.data || error.message
      );
      alert("⚠️ Hubo un error al agregar el producto.");
    }
  };

  return (
    <div className="container pt-5 mt-5 pb-5 mb-5">
      <div className="row justify-content-center align-items-center ">
        {/* ✅ Columna izquierda: Información adicional */}
        <div className="col-md-5 col-12 text-center info-products  ">
          <div className="pt-4 pb-4 px-3">
            <h2>🌟 Agrega un nuevo producto</h2>
            <p className="text-muted">
              Recuerda completar todos los campos correctamente. Los productos
              bien descritos son más fáciles de gestionar.
            </p>
            <ul className="list-unstyled text-start">
              <li>✅ Nombre claro y preciso</li>
              <li>✅ Precios correctamente formateados</li>
              <li>✅ Categoría y rubro adecuados</li>
              <li>✅ Imagen representativa</li>
            </ul>
            <img
              src={logo}
              alt="Ejemplo de producto"
              className="img-fluid rounded mt-3"
              width="250"
            />
          </div>
        </div>

        {/* ✅ Columna derecha: Formulario */}
        <div className="col-md-5 col-12">
          <ProductForm
            formData={formData}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            rubros={rubrosData}
            sucursales={sucursales}
            setFormData={setFormData}
          />
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
