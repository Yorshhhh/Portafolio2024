import { useState, useEffect } from "react";
import { historialPedidos } from "../api/cerveceria_API";
import '../css/PedidosPendientes.css';

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

  // Filtrar pedidos en pendientes y recibidos
  const pedidosPendientes = historial.filter(pedido => pedido.fecha_entrega === null);
  const pedidosRecibidos = historial.filter(pedido => pedido.fecha_entrega !== null);

  const renderPedidos = (pedidos) => {
    return pedidos.map((pedido, index) => (
      <tr key={index}>
        <td>
          <img
            src={pedido.imagen || "D_NQ_NP_978928-MLC50613847725_072022-O.jpg"}
            alt=""
            style={{ width: "50px" }}
          />
        </td>
        <td>{pedido.cod_pedido_id}</td>
        <td>{pedido.id_detalle_pedido}</td>
        <td>{pedido.nombre_producto}</td>
        <td>{pedido.cantidad}</td>
        <td>{pedido.precio_unitario}</td>
        <td>{pedido.total}</td>
        <td>{pedido.fecha_pedido}</td>
        <td>{pedido.fecha_entrega || "Pendiente"}</td>
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
                <th>Imagen</th>
                <th>Id Pedido</th>
                <th>Detalle Pedido</th>
                <th>Nombre Producto</th>
                <th>Cantidad</th>
                <th>Precio Unitario</th>
                <th>Total</th>
                <th>Fecha de Pedido</th>
                <th>Estado de entrega</th>
              </tr>
            </thead>
            <tbody>
              {renderPedidos(pedidosPendientes)}
            </tbody>
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
                <th>Imagen</th>
                <th>Id Pedido</th>
                <th>Detalle Pedido</th>
                <th>Nombre Producto</th>
                <th>Cantidad</th>
                <th>Precio Unitario</th>
                <th>Total</th>
                <th>Fecha de Pedido</th>
                <th>Fecha de Entrega</th>
              </tr>
            </thead>
            <tbody>
              {renderPedidos(pedidosRecibidos)}
            </tbody>
          </table>
        ) : (
          <p>No hay pedidos recibidos.</p>
        )}
      </div>
    </>
  );
};

export default HistorialPedidos;
