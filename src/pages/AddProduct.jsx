import React, { useState, useEffect } from "react";
import ProductForm from "../components/ProductForm";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const AddProduct = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    rubro: "",
    categoria: "",
    atributos: {},
    precio_costo: "",
    precio_publico: "",
    cantidad_stock: "",
    descripcion: "",
    fabricante: "",
    imagen_url: "",
    sucursal: "",
    image: "", // ✅ Guardar imagen como archivo
  });

  const [sucursales, setSucursales] = useState([]);
  const [rubros, setRubros] = useState([]);
  const [categories, setCategories] = useState([]);
  const [attributes, setAttributes] = useState([]);

  // ✅ Obtener datos desde el backend
  useEffect(() => {
    axios.get(`${API_URL}/sucursales`).then((res) => setSucursales(res.data));
    axios
      .get(`${API_URL}/attributes/distinctRubros`)
      .then((res) => setRubros(res.data));
  }, []);

  useEffect(() => {
    if (!formData.rubro) return;
    axios
      .get(`${API_URL}/attributes/distinctCategories?rubro=${formData.rubro}`)
      .then((res) => setCategories(res.data));
  }, [formData.rubro]);

  useEffect(() => {
    if (!formData.rubro || !formData.categoria) return;
    axios
      .get(
        `${API_URL}/attributes?rubro=${formData.rubro}&categoria=${formData.categoria}`
      )
      .then((res) => setAttributes(res.data));
  }, [formData.categoria]);

  // ✅ Manejo de cambios en los campos, incluyendo imágenes y precios
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      setFormData((prevData) => ({
        ...prevData,
        image: files.length > 0 ? files[0] : null, // ✅ Guardar archivo correctamente
      }));
    } else if (name === "precio_costo" || name === "precio_publico") {
      let inputValue = value.replace(/[^0-9]/g, "");
      while (inputValue.length < 3) inputValue = "0" + inputValue;
      const integerPart = inputValue.slice(0, -2);
      const decimalPart = inputValue.slice(-2);
      const formattedValue = `${integerPart
        .replace(/^0+(?!$)/, "")
        .replace(/\B(?=(\d{3})+(?!\d))/g, ".")},${decimalPart}`;

      setFormData((prevData) => ({ ...prevData, [name]: formattedValue }));
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  // ✅ Enviar datos al backend con la imagen sin procesarla
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();

    // ✅ Convertir `atributos` en JSON antes de enviarlo
    formDataToSend.append("atributos", JSON.stringify(formData.atributos));

    Object.entries(formData).forEach(([key, value]) => {
      if (key !== "atributos" && key !== "image") {
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
        atributos: {},
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
    <div className="container pt-5 mt-5 d-flex justify-content-center align-items-center">
      <ProductForm
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        rubros={rubros}
        categories={categories}
        attributes={attributes}
        sucursales={sucursales}
        setFormData={setFormData}
      />
    </div>
  );
};

export default AddProduct;
