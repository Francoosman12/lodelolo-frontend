import React, { useState, useEffect } from "react";
import ProductForm from "../components/ProductForm";
import axios from "axios";

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
  });

  const [sucursales, setSucursales] = useState([]);
  const [rubrosData, setRubrosData] = useState([]);

  // ✅ Cargar sucursales desde el backend
  useEffect(() => {
    axios.get(`${API_URL}/sucursales`).then((res) => setSucursales(res.data));
  }, []);

  // ✅ Obtener `rubros.json` desde el frontend
  useEffect(() => {
    const fetchRubros = async () => {
      try {
        const response = await fetch("/data/rubros.json");
        const data = await response.json();
        setRubrosData(data.rubros);
      } catch (error) {
        console.error("Error al cargar rubros:", error);
      }
    };
    fetchRubros();
  }, []);

  // ✅ Manejar cambios en los formularios
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      setFormData((prevData) => ({
        ...prevData,
        image: files.length > 0 ? files[0] : null,
      }));
    } else if (name === "precio_costo" || name === "precio_publico") {
      let inputValue = value.replace(/[^0-9]/g, ""); // ✅ Solo números

      while (inputValue.length < 3) {
        inputValue = "0" + inputValue; // ✅ Rellenar con ceros al inicio
      }

      const integerPart = inputValue.slice(0, -2); // ✅ Parte entera
      const decimalPart = inputValue.slice(-2); // ✅ Últimos 2 dígitos como decimales

      const formattedIntegerPart = integerPart
        .replace(/^0+(?!$)/, "") // ✅ Evitar ceros innecesarios
        .replace(/\B(?=(\d{3})+(?!\d))/g, "."); // ✅ Separación de miles con puntos

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

    // ✅ Convertir `atributos` a JSON antes de enviarlo
    formDataToSend.append("atributos", JSON.stringify(formData.atributos));

    // ✅ Convertir `precio_costo` y `precio_publico` a formato numérico válido
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
    <div className="container pt-5 mt-5 pb-5 mb-5 d-flex justify-content-center align-items-center">
      <ProductForm
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        rubros={rubrosData}
        sucursales={sucursales}
        setFormData={setFormData}
      />
    </div>
  );
};

export default AddProduct;
