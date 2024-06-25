import { useEffect, useState } from "react";
import { getAllProductos } from "../api/cerveceria_API";
import { useCart } from "../context/CarritoContext";
import Membresias from "../components/Membresias";
import Contacto from "../components/Contacto";
import Modalidad from "../components/Modalidad";
import Bienvenida from "../components/Bienvenida";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

import "../css/font-awesome.min.css";
import "../css/bootstrap.min.css";
import "../css/paginaestilo.css";

function HomePage() {
  const [productos, setProductos] = useState([]);
  const {
    cartItems,
    addToCart,
    removeFromCart,
    clearCart,
    toggleCart,
    showCart,
    setShowCart,
  } = useCart();

  const clearCartHandler = () => {
    clearCart(setCartItems, setShowCart);
  };

  useEffect(() => {
    async function loadProductos() {
      const res = await getAllProductos();
      /* console.log(res.data); */
      setProductos(res.data);
    }
    loadProductos();
  }, []);

  return (
    <body data-spy="scroll" data-target="#navbarNav" data-offset="50">
      {/* BARRA DE NAVEGACION */}
      <Navbar
        cartItems={cartItems}
        removeFromCart={removeFromCart}
        toggleCart={toggleCart}
        showCart={showCart}
        setShowCart={setShowCart}
        clearCartHandler={clearCartHandler}
      />
      {/* BIENVENIDA */}
      <Bienvenida />

      {/* PRODUCTOS DESTACADOS */}
      <section className="section" id="productos">
        <div className="container">
          <div className="row">
           {/*  <h1>Esta es la V4</h1> */}
            <h1>Productos Destacados!</h1>
            {productos.map((producto) => (
              <div
                key={producto.cod_producto}
                className="col-lg-4 col-md-6 col-12"
                data-aos="fade-up"
                data-aos-delay="400"
              >
                <div className="className-thumb">
                  <img
                    src="D_NQ_NP_978928-MLC50613847725_072022-O.jpg"
                    className="img-fluid"
                    alt="cerveza 1"
                  />

                  <div className="className-info">
                    <h3 className="mb-1">{producto.nombre_producto}</h3>
                    <span>
                      <strong>Producto Disponible</strong>{" "}
                    </span>
                    <h2>Cod Producto: {producto.cod_producto}</h2>
                    <p className="mt-3">
                      Descripcion: {producto.descripcion_producto}
                    </p>
                    <p>Grado alcoholico: {producto.grado_alcoholico}</p>
                    <p>Cantidad: {producto.litros} CC.</p>
                    <p>Precio: ${producto.precio_producto}</p>
                    <p>Stock: {producto.stock_producto}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* CARRUSEL */}
      {/* INFORMACION Y MODALIDAD DE VENTAS */}
      <Modalidad />
      {/*  SECCION DE MEMBRESIAS */}
      <Membresias />
      {/* CONTACTO */}
      <Contacto />
      {/* FOOTER */}
      <Footer />
    </body>
  );
}

export default HomePage;
