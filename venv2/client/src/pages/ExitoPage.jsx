import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import CarritoExito from "../components/CarritoExito";
import Navbar from "../components/Navbar";
import "../css/ExitoPage.css";
/* 
const formatearFecha = (fecha) => {
  const dia = String(fecha.getDate()).padStart(2, "0"); // dd
  const mes = String(fecha.getMonth() + 1).padStart(2, "0"); // MM
  const anio = fecha.getFullYear(); // yyyy
  const hora = String(fecha.getHours()).padStart(2, "0"); // HH
  const minutos = String(fecha.getMinutes()).padStart(2, "0"); // Minute

  return `${dia}/${mes}/${anio} - ${hora}:${minutos}`;
}; */

function ExitoPage() {
  const location = useLocation();
  const [user, setUser] = useState([]);
  const [carro, setCarrito] = useState([]);
  const [transactionData, setTransactionData] = useState(null);
  const [cantidadProductos, setCantidadProductos] = useState(0);
  const [error, setError] = useState(null);

  const fechaActual = new Date();
  const fechaIso = fechaActual.toISOString();

  useEffect(() => {
    const userCarrito = localStorage.getItem("carrito");
    if (userCarrito) {
      try {
        const carritoParsed = JSON.parse(userCarrito);
        setCarrito(carritoParsed);
        console.log(carritoParsed);

        // Contar la cantidad de productos únicos
        const cantidad = carritoParsed.length;
        setCantidadProductos(cantidad);
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
        console.log(userParsed);
      } catch (error) {
        console.error("Error al parsear el usuario del localStorage: ", error);
      }
    } else {
      console.warn("No existe un usuario en el localStorage");
    }
  }, []);

  if (!user) {
    return (
      <>
        <Navbar />
        <div className="center-container">
          <h2>No se pudo cargar la información del usuario.</h2>
        </div>
      </>
    );
  }

  useEffect(() => {
    async function confirmTransaction() {
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
            //SI LA RESPUESTA ES EXITOSA ENTONCES
          } else {
            setError(
              "Error en la transacción: " +
                JSON.stringify(response.data.commitResponse)
            );
          }
        } catch (error) {
          setError("Error confirming transaction: " + error.message);
        }
      } else {
        setError("Token no encontrado en la URL");
      }
    }

    confirmTransaction();
  }, [location]);

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
      <p>Fecha formateada: {fechaIso}</p>
      <p>Usuario ID: {user.id}</p>
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
