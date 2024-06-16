import React, { useEffect, useState } from "react";
import axios from "axios";
import { registrarPedido, registrarDetalles } from "../api/cerveceria_API";
import { useLocation } from "react-router-dom";
import CarritoExito from "../components/CarritoExito";
import Navbar from "../components/Navbar";
import "../css/ExitoPage.css";

function ExitoPage() {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [carro, setCarrito] = useState([]);
  const [transactionData, setTransactionData] = useState(null);
  const [cantidadProductos, setCantidadProductos] = useState(0);
  const [error, setError] = useState(null);

  const fechaPedido = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const userCarrito = localStorage.getItem("carrito");
    if (userCarrito) {
      try {
        const carritoParsed = JSON.parse(userCarrito);
        setCarrito(carritoParsed);
        setCantidadProductos(carritoParsed.length);
      } catch (error) {
        console.error("Error al parsear el carrito del localStorage:", error);
      }
    } else {
      console.warn("No existen productos en el carrito.");
    }
  }, []);

  useEffect(() => {
    const userJson = localStorage.getItem("usuario");
    if (userJson) {
      try {
        const userParsed = JSON.parse(userJson);
        setUser(userParsed);
      } catch (error) {
        console.error("Error al parsear el usuario del localStorage: ", error);
      }
    } else {
      console.warn("No existe un usuario en el localStorage");
    }
  }, []);

  const confirmTransaction = async () => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token_ws");

    if (token) {
      try {
        const response = await axios.post(
          "http://localhost:3000/webpay_plus/commit",
          { token_ws: token }
        );

        if (response.data.status === "success") {
          setTransactionData(response.data.viewData.commitResponse);

          if (user) {
            const nuevoPedido = {
              fecha_pedido: fechaPedido,
              id_usuario: user.id,
            };

            try {
              const pedido = await registrarPedido(nuevoPedido);
              console.log("Pedido registrado:", pedido);

              try {
                const detalles = carro.map((producto) => ({
                  cod_producto: producto.cod_producto,
                  cod_pedido: pedido.cod_pedido,
                  descuento: 0,
                  cantidad: producto.quantity,
                  precio_unitario: producto.precio_producto,
                }));

                const promises = detalles.map((detalle) =>
                  registrarDetalles(detalle)
                );
                await Promise.all(promises);
                console.log(
                  "Todos los detalles de pedidos han sido registrados."
                )
                localStorage.removeItem("carrito");
                //AGREGAR REFRESH DEL COMPONENTE CARRITO
                console.log("Carrito eliminado del localStorage.");
              } catch (error) {
                console.error(
                  "Error al registrar los detalles del pedido:",
                  error
                );
              }
            } catch (error) {
              console.error("Error al registrar pedido:", error);
            }
          }
        } else {
          setError(
            "Error en la transacción: " +
              JSON.stringify(response.data.commitResponse)
          );
        }
      } catch (error) {
        setError("Error confirmando la transacción: " + error.message);
      }
    } else if (!token) {
      setError("Token no encontrado en la URL");
    }
  };

  useEffect(() => {
    if (user && carro.length > 0) {
      confirmTransaction();
    }
  }, [location, user, carro]);
  return (
    <>
      <Navbar />
      <hr />
      <hr />
      <hr />
      <hr />
      <hr />
      <hr />
      {/* Mostrar la cantidad de productos únicos en el carrito */}
      <div>
        <h2>Cod productos en el carro: {cantidadProductos}</h2>
        <ul>
          <h1>Productos en el carrito</h1>
          {carro.map((producto, index) => (
            <li key={index}>
              <p>
                <strong>Producto:</strong> {producto.nombre_producto}
              </p>
              <p>
                <strong>Código:</strong> {producto.cod_producto}
              </p>
              <p>
                <strong>Cantidad:</strong> {producto.quantity}
              </p>
              <p>
                <strong>Precio:</strong> ${producto.precio_producto}
              </p>
              {/* Añade más detalles del producto si lo deseas */}
            </li>
          ))}
        </ul>
      </div>
      <p>Fecha formateada: {fechaPedido}</p>
      <div className="center-container">
        <h1>Confirmando transacción...</h1>
        {transactionData && (
          <div>
            <div className="alert alert-success" role="alert">
              <h2>Transaccion exitosa!</h2>
              <img
                src="tic-verde.jpg"
                alt=""
                style={{ width: "20%", height: "auto" }}
              />
              <CarritoExito />
            </div>
            <h2>Transacción confirmada</h2>
            <pre>{JSON.stringify(transactionData, null, 2)}</pre>
          </div>
        )}
        {error && (
          <div>
            <h2>Error!</h2>
            <img
              src="cruz-roja.png"
              alt=""
              style={{ width: "30%", height: "auto" }}
            />
            <p>{error}</p>
          </div>
        )}
        <a href="/home">Volver al inicio</a>
        <hr />
      </div>
    </>
  );
}

export default ExitoPage;
