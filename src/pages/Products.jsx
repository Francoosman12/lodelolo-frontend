import React from "react";
import { Link } from "react-router-dom";

const Products = () => {
  return (
    <div>
      <h1>Productos</h1>
      <ul>
        <li>
          <Link to="/products/add">Agregar Productos</Link>
        </li>
        <li>
          <Link to="/products/list">Mis Productos</Link>
        </li>
        <li>
          <Link to="/products/inventory">Inventario</Link>
        </li>
      </ul>
    </div>
  );
};

export default Products;
