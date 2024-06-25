import {useState,useEffect} from 'react'
import {historialPedidos} from '../api/cerveceria_API'

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
        setHistorial(res);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener el historial ");
        console.error(error);
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

  return (
    <div>
      <h2>Historial de Pedidos</h2>
      {historial.map((pedido, index) => (
        <div key={index}>
          <h3>{pedido.nombre_producto}</h3>
          <p>Cantidad: {pedido.cantidad}</p>
          <p>Precio Unitario: {pedido.precio_unitario}</p>
          <p>Total: {pedido.total}</p>
          <p>Fecha de Pedido: {pedido.fecha_pedido}</p>
          <p>Fecha de Entrega: {pedido.fecha_entrega}</p>
        </div>
      ))}
    </div>
  );
};

export default HistorialPedidos;