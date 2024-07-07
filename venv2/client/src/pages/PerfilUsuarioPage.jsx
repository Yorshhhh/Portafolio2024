import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import AgregarProducto from "../components/AgregarProducto";
import RegisterAdmin from "../components/RegisterAdmin";
import ListarProductos from "../components/ListarProductos";
import Ganancias from "../components/GananciasAdmin";
import HistorialPedidos from "../components/HistorialPedidos";
import PedidosPendientes from "../components/PedidosPendientes";
import PedidosEntregados from "../components/PedidosEntregados";
import "../css/PerfilUsuario.css";
import UserCard from "../components/UserCard";

function PerfilUsuarioPage() {
  const [user, setUser] = useState(null);
  const [carro, setCarrito] = useState([]);
  // Estado para mostrar/ocultar diferentes secciones
  const [showSection, setShowSection] = useState({
    infoUser: false,
    agregarProducto: false,
    crearAdmin: false,
    modificarProducto: false,
    nonStaffContent: false,
    ganancias: false,
    historial: false,
    pendientes: false,
    entregados: false,
  });

  useEffect(() => {
    const userJson = localStorage.getItem("usuario");
    try {
      setUser(JSON.parse(userJson));
    } catch (error) {
      console.error("Error parsing user from localStorage:", error);
    }
  }, []);

  useEffect(() => {
    const userCarrito = localStorage.getItem("carrito");
    if (userCarrito) {
      try {
        const carritoParsed = JSON.parse(userCarrito);
        setCarrito(carritoParsed);
        const detalles = carritoParsed.map((producto) => ({
          cod_producto: producto.cod_producto,
          descuento: 0,
          cantidad: producto.quantity,
          precio_unitario: producto.precio_producto,
        }));
        console.log("Detalles del carrito", detalles);
      } catch (error) {
        console.error("Error al parsear el carrito del localStorage:", error);
      }
    } else {
      console.warn("No existen productos en el carrito.");
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

  const toggleSection = (section) => {
    setShowSection((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <>
      <Navbar />
      <div className="user-profile-center-container">
        <div className="m-auto h-screen w-full flex justify-center items-center">
          <UserCard user={user} />
        </div>

      </div>
    </>
  );
}

export default PerfilUsuarioPage;
