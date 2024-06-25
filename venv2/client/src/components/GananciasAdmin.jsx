import React, { useEffect, useState } from "react";
import { getGanancias } from "../api/cerveceria_API";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,Cell } from 'recharts';
import "../css/GananciasAdmin.css";

function GananciasAdmin() {
  const [user, setUser] = useState(null);
  const [ganancias, setGanancias] = useState([]);
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

        const res = await getGanancias(userParsed.correo);
        setGanancias(res);

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

  const obtenerClientesTop5 = () => {
    const clientesMap = historial.reduce((acc, pedido) => {
      const correo = pedido.correo;
      const total = pedido.total;

      if (acc.has(correo)) {
        acc.set(correo, acc.get(correo) + total);
      } else {
        acc.set(correo, total);
      }

      return acc;
    }, new Map());

    const clientesArray = Array.from(clientesMap, ([correo, total]) => ({
      correo,
      total,
    }));

    return clientesArray.sort((a, b) => b.total - a.total).slice(0, 5);
  };

  const clientesTop5 = obtenerClientesTop5();

  const COLORS = ["#FF6384", "#36A2EB", "#FFCE56", "#5cb85c", "#f0ad4e"];

  return (
    <div>
      <h2>Ganancias</h2>
      <table className="historial-table">
        <thead>
          <tr>
            <th>Nombre Cliente</th>
            <th>Correo</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {historial.map((pedido) => (
            <tr key={pedido.correo}>
              <td>{pedido.nombres_clientes}</td>
              <td>{pedido.correo}</td>
              <td>{pedido.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="chart-container" style={{ width: "100%", height: 400 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={clientesTop5}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="correo" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="total" fill="#82ca9d">
              {clientesTop5.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default GananciasAdmin;
