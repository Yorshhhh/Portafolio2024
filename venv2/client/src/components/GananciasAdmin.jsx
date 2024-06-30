import React, { useEffect, useState } from "react";
import { obtenerGananciasPorProducto } from "../api/cerveceria_API";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import "../css/GananciasAdmin.css";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#FF6384", "#36A2EB", "#FFCE56", "#6A4C93"];

// Formato de moneda
const formatCurrency = (value) => {
  return `$${Number(value).toLocaleString("es-CL", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
};

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

  // Calcular el total de ventas
  const totalVentas = ganancias.reduce((acc, ganancia) => acc + ganancia.total, 0);

  // Función para renderizar la etiqueta personalizada con el porcentaje
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(2)}%`}
      </text>
    );
  };

  return (
    <div className="ganancias-admin">
      <h2>Ganancias por Producto</h2>
      <div className="chart-container">
        <ResponsiveContainer width="40%" height={400}>
          <BarChart data={ganancias} margin={{ top: 20, right: 30, left: 20, bottom: 50 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="nombre_producto"
              interval={0}
              angle={-45}
              textAnchor="end"
              tick={{ fontSize: 12, fill: "#8884d8" }}
            />
            <YAxis tickFormatter={formatCurrency} />
            <Tooltip formatter={(value) => formatCurrency(value)} />
            <Legend />
            <Bar dataKey="total" fill="#8884d8" barSize={30}>
              {ganancias.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <ResponsiveContainer width="50%" height={400}>
          <PieChart>
            <Pie
              data={ganancias}
              dataKey="total"
              nameKey="nombre_producto"
              cx="50%"
              cy="50%"
              outerRadius={150}
              fill="#82ca9d"
              label={renderCustomizedLabel}
              labelLine={false}
            >
              {ganancias.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => formatCurrency(value)} />
          </PieChart>
        </ResponsiveContainer>
        <h3>Total ganancias: {formatCurrency(totalVentas)}</h3>
      </div>
      <div className="detalle-ganancias">
        {ganancias.map((ganancia, index) => (
          <div key={index} className="ganancia-detalle">
            <h3>Codigo Producto: {ganancia.cod_producto}</h3>
            <p>Nombre Producto: {ganancia.nombre_producto}</p>
            <p>Total: {formatCurrency(ganancia.total)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default GananciasAdmin;
