import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CarritoContext";
import Carrito from "./Carrito";
import "../css/Navbar.css";

function Navbar() {
  const {
    cartItems,
    removeFromCart,
    clearCartHandler,
    toggleCart,
    showCart,
    setShowCart,
  } = useCart();
  const user = JSON.parse(localStorage.getItem("usuario"));
  const history = useNavigate();

  const logout = () => {
    localStorage.removeItem("usuario");
    localStorage.removeItem("token")
    localStorage.removeItem("carrito")
    history("/");
  };

  return (
    <nav className="navbar navbar-expand-lg fixed-top">
      <div className="container">
        <a className="navbar-brand" href="/">
          Cervezas llicapilsen
        </a>

        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ml-lg-auto">
            <li className="nav-item">
              <a href="/" className="nav-link active smoothScroll">
                <strong>Inicio</strong>
              </a>
            </li>

            <li className="nav-item">
              <a href="/productos" className="nav-link active smoothScroll">
                <strong>Productos</strong>
              </a>
            </li>
            {!user ? (
              <>
                <li className="nav-item">
                  <a href="/register" className="nav-link active smoothScroll">
                    <strong>Registrarse</strong>
                  </a>
                </li>

                <li className="nav-item">
                  <a href="/login" className="nav-link active smoothScroll">
                    <strong>Login</strong>
                  </a>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <a href="/perfil">
                    <strong>
                      {" "}
                      Bienvenido {user.nombres} {user.apellidos}
                    </strong>
                  </a>
                </li>
                <li>
                  <button
                    onClick={logout}
                    className="bg-red-500 text-gray-200 p-2 rounded hover:bg-red-400 hover:text-gray-100"
                  >
                    Log Out
                  </button>
                </li>
              </>
            )}
            <li className="nav-item carrito-item">
              <Carrito
                cartItems={cartItems}
                removeFromCart={removeFromCart}
                toggleCart={toggleCart}
                showCart={showCart}
                setShowCart={setShowCart}
                clearCart={clearCartHandler}
              />
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
