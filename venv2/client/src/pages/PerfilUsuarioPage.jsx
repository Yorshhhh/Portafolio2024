import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import AgregarProducto from "../components/AgregarProducto";
import RegisterAdmin from "../components/RegisterAdmin";
import ListarProductos from "../components/ListarProductos";
import { actualizarDireccion } from "../api/cerveceria_API";
import "../css/PerfilUsuario.css";

function PerfilUsuarioPage() {
  const [user, setUser] = useState(null);
  const [showAgregarProducto, setShowAgregarProducto] = useState(false);
  const [showCrearAdmin, setShowCrearAdmin] = useState(false);
  const [showModificarProducto, setShowModificarProducto] = useState(false);
  const [editDireccion, setEditDireccion] = useState(false);
  const [direccion, setDireccion] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useNavigate();

  useEffect(() => {
    const userJson = localStorage.getItem("usuario");
    try {
      setUser(JSON.parse(userJson));
    } catch (error) {
      console.error("Error parsing user from localStorage:", error);
    }
  }, []);

  const handleDireccionChange = (e) => {
    setDireccion(e.target.value);
  };

  const handleGuardarDireccionClick = async () => {
    if (!direccion.trim()) {
      alert("Por favor, ingresa una dirección válida.");
      return;
    }

    setLoading(true);
    try {
      const updatedUser = await actualizarDireccion(user.id, direccion.trim());
      const updatedUserData = { ...user, direccion: updatedUser.data.direccion };
      setUser(updatedUserData);
      localStorage.setItem("usuario", JSON.stringify(updatedUserData));
      setEditDireccion(false);
      alert("Dirección actualizada correctamente.");
      history("/perfil");
    } catch (error) {
      console.error("Error al actualizar la dirección:", error);
      alert("Ocurrió un error al actualizar la dirección.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditarDireccionClick = () => {
    setEditDireccion(true);
    setDireccion(user.direccion || "");
  };

  const toggleAgregarProducto = () => setShowAgregarProducto((prev) => !prev);
  const toggleCrearAdmin = () => setShowCrearAdmin((prev) => !prev);
  const toggleModificarProducto = () => setShowModificarProducto((prev) => !prev);

  return (
    <>
      <Navbar />
      <div className="user-profile-center-container">
        <div className="user-profile-card">
          <h1>Información del usuario</h1>
          <p><strong>Nombres:</strong> {user?.nombres}</p>
          <p><strong>Apellidos:</strong> {user?.apellidos}</p>
          <p><strong>Correo:</strong> {user?.correo}</p>
          <p><strong>Teléfono:</strong> {user?.telefono}</p>
          <div className="user-profile-direccion">
            <p><strong>Dirección:</strong></p>
            {editDireccion ? (
              <div className="user-profile-direccion-input-container">
                <input
                  type="text"
                  placeholder="Ingresa tu dirección"
                  value={direccion}
                  onChange={handleDireccionChange}
                  className="user-profile-direccion-input"
                />
                <button
                  onClick={handleGuardarDireccionClick}
                  className="user-profile-button user-profile-btn-primary"
                  disabled={loading}
                >
                  {loading ? "Guardando..." : "Guardar dirección"}
                </button>
              </div>
            ) : (
              <div>
                <p>{user?.direccion || "Dirección no proporcionada"}</p>
                <button
                  onClick={handleEditarDireccionClick}
                  className="user-profile-button user-profile-btn-secondary"
                >
                  Editar dirección
                </button>
              </div>
            )}
          </div>

          {user?.is_staff && (
            <div className="user-profile-staff-actions">
              <button
                className="user-profile-button user-profile-staff-button"
                onClick={toggleAgregarProducto}
              >
                {showAgregarProducto ? "Ocultar Agregar Producto" : "Agregar Producto"}
              </button>
              {showAgregarProducto && <AgregarProducto />}

              <button
                className="user-profile-button user-profile-staff-button"
                onClick={toggleCrearAdmin}
              >
                {showCrearAdmin ? "Ocultar Crear Administrador" : "Crear Administrador"}
              </button>
              {showCrearAdmin && <RegisterAdmin />}

              <button
                className="user-profile-button user-profile-staff-button"
                onClick={toggleModificarProducto}
              >
                {showModificarProducto ? "Ocultar Modificar Producto" : "Modificar Productos"}
              </button>
              {showModificarProducto && <ListarProductos />}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default PerfilUsuarioPage;
