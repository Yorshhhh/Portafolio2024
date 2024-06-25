import React, { useEffect, useState } from "react";
import { obtenerGananciasPorProducto } from "../api/cerveceria_API";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,Cell } from 'recharts';
import "../css/GananciasAdmin.css";

function GananciasAdmin() {
  const [ganancias, setGanancias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGanancias = async () => {
      try {
        const data = await obtenerGananciasPorProducto();
        setGanancias(data);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener las ganancias: ", error);
        setError("Error al cargar las ganancias por producto.");
        setLoading(false);
      }
    };

    fetchGanancias();
  }, []);

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h2>Ganancias por Producto</h2>
      {ganancias.map((ganancia, index) => (
        <div key={index}>
          <h3>Codigo Producto: {ganancia.cod_producto}</h3>
          <p>Nombre Producto{ganancia.nombre_producto}</p>
          <p>Total: {ganancia.total}</p>
          
        </div>
      ))}
    </div>
  );
}

export default GananciasAdmin;
