import React from "react";
import { Link } from "react-router-dom";

const Users = () => {
  return (
    <div className="my-4 mt-5 mb-5 pt-5 pb-5">
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
