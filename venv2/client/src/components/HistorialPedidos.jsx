import { useState, useEffect } from "react";
import { historialPedidos } from "../api/cerveceria_API";
import "../css/PedidosPendientes.css";

const HistorialPedidos = () => {
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
        console.log("Datos recibidos:", res); // Debug: Verifica los datos recibidos
        setHistorial(res);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener el historial: ", error);
        setError("Error al cargar el historial de pedidos.");
        setLoading(false);
      }
    };

    fetchHistorial();
  }, []);

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  // Función para agrupar los pedidos por `cod_pedido_id`
  const agruparPedidos = (pedidos) => {
    const pedidosAgrupados = {};

    pedidos.forEach((pedido) => {
      if (!pedidosAgrupados[pedido.cod_pedido_id]) {
        pedidosAgrupados[pedido.cod_pedido_id] = {
          ...pedido,
          detalles: [],
        };
      }
      pedidosAgrupados[pedido.cod_pedido_id].detalles.push({
        id_detalle_pedido: pedido.id_detalle_pedido,
        cod_producto: pedido.cod_producto,
        nombre_producto: pedido.nombre_producto,
        cantidad: pedido.cantidad,
        precio_unitario: pedido.precio_unitario,
        total: pedido.total,
      });
    });

    return Object.values(pedidosAgrupados);
  };

  const calcularTotalBoleta = (detalles) => {
    let totalBoleta = 0;
    detalles.forEach((detalle) => {
      totalBoleta += detalle.total;
    });
    return totalBoleta.toLocaleString("es-CL", {
      style: "currency",
      currency: "CLP",
    });
  };

  // Filtrar pedidos en pendientes y recibidos
  const pedidosPendientes = historial.filter(
    (pedido) => pedido.fecha_entrega === null
  );
  const pedidosRecibidos = historial.filter(
    (pedido) => pedido.fecha_entrega !== null
  );

  const renderPedidos = (pedidos) => {
    const pedidosAgrupados = agruparPedidos(pedidos);

    return pedidosAgrupados.map((pedidoAgrupado, index) => (
      <tr key={index}>
        <td>{pedidoAgrupado.cod_pedido_id}</td>
        <td>
          <ul>
            {pedidoAgrupado.detalles.map((detalle, idx) => (
              <li key={idx}>
                <strong>Codigo Producto:</strong> {detalle.cod_producto} <br />
                <strong>Nombre Producto:</strong> {detalle.nombre_producto}{" "}
                <br />
                <strong>Cantidad:</strong> {detalle.cantidad} <br />
                <strong>Precio:</strong>{" "}
                {detalle.precio_unitario.toLocaleString("es-CL", {
                  style: "currency",
                  currency: "CLP",
                })}
                <br />
              </li>
            ))}
          </ul>
        </td>
        <td>{pedidoAgrupado.fecha_pedido}</td>
        <td>{pedidoAgrupado.fecha_entrega || "Pendiente"}</td>
        <td>
          <strong>{calcularTotalBoleta(pedidoAgrupado.detalles)}</strong>{" "}
        </td>
      </tr>
    ));
  };

  return (
    <>
      <div>
        <h2>Pedidos Pendientes</h2>
        {pedidosPendientes.length > 0 ? (
          <table className="pedidos-table">
            <thead>
              <tr>
                <th>Id Pedido</th>
                <th>Detalle Pedido</th>
                <th>Fecha de Pedido</th>
                <th>Fecha de Entrega</th>
                <th>Total del Pedido</th>
              </tr>
            </thead>
            <tbody>{renderPedidos(pedidosPendientes)}</tbody>
          </table>
        ) : (
          <p>No hay pedidos pendientes.</p>
        )}
      </div>

      <div>
        <h2>Pedidos Recibidos</h2>
        {pedidosRecibidos.length > 0 ? (
          <table className="pedidos-table">
            <thead>
              <tr>
                <th>Id Pedido</th>
                <th>Detalle Pedido</th>
                <th>Fecha de Pedido</th>
                <th>Fecha de Entrega</th>
                <th>Total del Pedido</th>
              </tr>
            </thead>
            <tbody>{renderPedidos(pedidosRecibidos)}</tbody>
          </table>
        ) : (
          <p>No hay pedidos recibidos.</p>
        )}
      </div>
    </>
  );
};

export default HistorialPedidos;
