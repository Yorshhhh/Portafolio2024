import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import CarritoExito from "../components/CarritoExito";
import Navbar from '../components/Navbar'
import "../css/ExitoPage.css";

function ExitoPage() {
  const location = useLocation();
  const [transactionData, setTransactionData] = useState(null);
  const [error, setError] = useState(null);

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
