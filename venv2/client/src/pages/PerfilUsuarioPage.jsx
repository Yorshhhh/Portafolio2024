import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import AgregarProducto from "../components/AgregarProducto";
import RegisterAdmin from "../components/RegisterAdmin";
import ListarProductos from "../components/ListarProductos";
import { actualizarDireccion } from "../api/cerveceria_API"; // Importa la función de Axios

function PerfilUsuarioPage() {
  const [user, setUser] = useState(null); // Cambiado a null inicialmente
  const [showAgregarProducto, setShowAgregarProducto] = useState(false);
  const [showCrearAdmin, setShowCrearAdmin] = useState(false);
  const [showModificarProducto, setModificarProducto] = useState(false);
  const [showNonStaffContent, setShowNonStaffContent] = useState(false);
  const [editDireccion, setEditDireccion] = useState(false);
  const [direccion, setDireccion] = useState("");
  const [loading, setLoading] = useState(false);

  const history = useNavigate();

  // Cargar usuario desde localStorage al cargar la página
  useEffect(() => {
    const userJson = localStorage.getItem("usuario");
    try {
      setUser(JSON.parse(userJson));
    } catch (error) {
      console.error("Error parsing user from localStorage:", error);
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

  // Función para manejar el cambio en el campo de dirección
  const handleDireccionChange = (e) => {
    setDireccion(e.target.value);
  };

  // Función para guardar la dirección editada y enviarla al servidor
  const handleGuardarDireccionClick = async () => {
    if (direccion.trim()) {
      setLoading(true); // Muestra un indicador de carga

      try {
        const updatedUser = await actualizarDireccion(
          user.id,
          direccion.trim()
        );
        // Actualiza la dirección localmente
        setUser({
          ...user,
          direccion: updatedUser.data.direccion, // Suponiendo que la respuesta contiene 'direccion'
        });
        localStorage.setItem(
          "usuario",
          JSON.stringify({
            ...user,
            direccion: updatedUser.data.direccion, // Actualiza también en localStorage
          })
        );
        setEditDireccion(false); // Ocultar el input de edición después de guardar
        alert("Dirección actualizada correctamente.");
        history("/perfil"); // Redirige al perfil después de guardar
      } catch (error) {
        console.error("Error al actualizar la dirección:", error);
        alert("Ocurrió un error al actualizar la dirección.");
      } finally {
        setLoading(false); // Oculta el indicador de carga
      }
    } else {
      alert("Por favor, ingresa una dirección válida.");
    }
  };

  // Función para manejar el clic en el botón para editar dirección
  const handleEditarDireccionClick = () => {
    setEditDireccion(true); // Mostrar el input de edición
    setDireccion(user.direccion || ""); // Cargar la dirección actual si existe
  };

  // Funciones para manejar los clics en los botones de acciones
  const handleAgregarProductoClick = () => {
    setShowAgregarProducto((prev) => !prev);
  };

  const handleCrearAdminClick = () => {
    setShowCrearAdmin((prev) => !prev);
  };

  const handleModificarProducto = () => {
    setModificarProducto((prev) => !prev);
  };

  const handleNonStaffContentClick = () => {
    setShowNonStaffContent((prev) => !prev);
  };

  return (
    <>
      <hr />
      <hr />
      <hr />
      <Navbar />
      <div className="center-container">
        <h1>Información del usuario</h1>
        <h2>ID: {user.id}</h2>
        <h2>Nombres: {user.nombres}</h2>
        <h2>Apellidos: {user.apellidos}</h2>
        <h2>Correo: {user.correo}</h2>
        <h2>Teléfono: {user.telefono}</h2>
        <h2>Dirección: </h2>
        {editDireccion ? (
          // Mostrar input de edición si se está editando la dirección
          <div className="direccion-input-container">
            <input
              type="text"
              placeholder="Ingresa tu dirección"
              value={direccion}
              onChange={handleDireccionChange}
              className="direccion-input"
            />
            <button
              onClick={handleGuardarDireccionClick}
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Guardando..." : "Guardar dirección"}
            </button>
          </div>
        ) : (
          // Mostrar la dirección y botón de editar si está proporcionada
          <div>
            <h2>{user.direccion || "Dirección no proporcionada"}</h2>
            <button
              onClick={handleEditarDireccionClick}
              className="btn btn-secondary"
            >
              Editar dirección
            </button>
          </div>
        )}

        <h2>¿Es Staff?: {user.is_staff ? "Sí" : "No"}</h2>

        {user.is_staff ? (
          // Si el usuario es staff
          <div className="staff-actions">
            <button
              className="staff-button"
              onClick={handleAgregarProductoClick}
            >
              {showAgregarProducto
                ? "Ocultar Agregar Producto"
                : "Agregar Producto"}
            </button>
            <div className="content-container">
              {showAgregarProducto && <AgregarProducto />}
            </div>

            <button className="staff-button" onClick={handleCrearAdminClick}>
              {showCrearAdmin
                ? "Ocultar Crear Administrador"
                : "Crear Administrador"}
            </button>
            <div className="content-container">
              {showCrearAdmin && <RegisterAdmin />}
            </div>

            <button className="staff-button" onClick={handleModificarProducto}>
              {showModificarProducto
                ? "Ocultar Modificar Producto"
                : "Modificar Productos"}
            </button>
            <div className="content-container">
              {showModificarProducto && <ListarProductos />}
            </div>
          </div>
        ) : (
          // Si el usuario no es staff
          <div className="non-staff-actions">
            <button
              className="non-staff-button"
              onClick={handleNonStaffContentClick}
            >
              {showNonStaffContent
                ? "Ocultar Opciones de Usuario"
                : "Mostrar Opciones de Usuario"}
            </button>
            <div className="content-container">
              {showNonStaffContent && (
                <div>
                  <h1>No eres staff</h1>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default PerfilUsuarioPage;
