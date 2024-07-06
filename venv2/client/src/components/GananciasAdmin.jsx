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

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#FF6384",
  "#36A2EB",
  "#FFCE56",
  "#6A4C93",
];

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
  const [selectedProducts, setSelectedProducts] = useState(""); // Estado para el producto seleccionado

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
  const totalVentas = ganancias.reduce(
    (acc, ganancia) => acc + ganancia.total,
    0
  );

  // Función para renderizar la etiqueta personalizada con el porcentaje
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }) => {
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
  const handleProductChange = (event) => {
    const options = event.target.options;
    const selectedValues = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedValues.push(options[i].value);
      }
    }
    setSelectedProducts(selectedValues);
  };

  const filteredGanancias = selectedProducts.length > 0
    ? ganancias.filter((ganancia) =>
        selectedProducts.includes(ganancia.nombre_producto)
      )
    : ganancias;

  return (
    <div className="ganancias-admin">
      <h1>Total de Ventas Historico</h1>
      <div className="chart-container">
        <ResponsiveContainer width="40%" height={400}>
          <BarChart
            data={ganancias}
            margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
          >
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
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
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
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip formatter={(value) => formatCurrency(value)} />
          </PieChart>
        </ResponsiveContainer>
        <h3>Total Ventas: {formatCurrency(totalVentas)}</h3>
      </div>

      {/* Filtro de productos */}
      <div className="detalle-ganancias">
        <h1 className="font-bold">Ventas por Producto</h1>
        <div className="flex justify-end filter-container">
          <label htmlFor="productFilter">Selecciona Productos:</label>
          <select
            id="productFilter"
            multiple
            value={selectedProducts}
            onChange={handleProductChange}
            style={{ height: '150px' }} // Para ver múltiples opciones a la vez
          >
            {ganancias.map((ganancia) => (
              <option key={ganancia.cod_producto} value={ganancia.nombre_producto}>
                {ganancia.nombre_producto}
              </option>
            ))}
          </select>
        </div>
        <div className="chart-container">
          <ResponsiveContainer width="40%" height={400}>
            <BarChart
              data={filteredGanancias}
              margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
            >
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
                {filteredGanancias.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <ResponsiveContainer width="50%" height={400}>
            <PieChart>
              <Pie
                data={filteredGanancias}
                dataKey="total"
                nameKey="nombre_producto"
                cx="50%"
                cy="50%"
                outerRadius={150}
                fill="#82ca9d"
                label={renderCustomizedLabel}
                labelLine={false}
              >
                {filteredGanancias.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(value)} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default GananciasAdmin;
