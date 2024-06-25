import React, { useEffect, useState } from "react";
import { historialPedidos } from '../api/cerveceria_API'

function HistorialPedidos() {
  const [user, setUser] = useState(null);
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistorial = async () => {
      try {
        const userJson = localStorage.getItem("usuario");
        if (!userJson) {
          throw new Error("No se encontró un usuario en el localStorage.");
        }
        const userParsed = JSON.parse(userJson);
        setUser(userParsed);

        const res = await historialPedidos(userParsed.id);
        setHistorial(res);

        setLoading(false);
      } catch (error) {
        console.error("Error al obtener el historial ", error);
        setError("Error al cargar el historial de pedidos.");
        setLoading(false);
      }
    };

    fetchHistorial();
  }, []);

  if (!user) {
    return (
      <div className="center-container">
        <h2>No se pudo cargar la información del usuario.</h2>
      </div>
    );
  }

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }
  return <></>;
}

export default HistorialPedidos;
