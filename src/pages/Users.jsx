import React from "react";
import { Link } from "react-router-dom";

const Users = () => {
  return (
    <div>
      <h1>Usuarios</h1>
      <ul>
        <li>
          <Link to="/users/create">Crear Usuario</Link>
        </li>
        <li>
          <Link to="/users/schedules">Horarios</Link>
        </li>
        <li>
          <Link to="/users/attendance">Asistencias</Link>
        </li>
      </ul>
    </div>
  );
};

export default Users;
