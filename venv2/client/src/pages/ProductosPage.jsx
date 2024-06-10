import { useEffect, useState } from "react";
import { getAllProductos } from "../api/cerveceria_API";
import { Link } from "react-router-dom";  // Importa Link de react-router-dom
import Navbar from "../components/Navbar";
import { useCart } from "../context/CarritoContext";
import "../css/styleproducto.css";

function ProductosPage() {
  const {
    cartItems,
    addToCart,
    removeFromCart,
    clearCart,
    toggleCart,
    showCart,
    setShowCart,
  } = useCart();

  const [productos, setProductos] = useState([]);

  const clearCartHandler = () => {
    clearCart(setCartItems, setShowCart);
  };

  useEffect(() => {
    async function loadProductos() {
      const res = await getAllProductos();
      console.log(res.data);
      setProductos(res.data);
    }
    loadProductos();
  }, []);

  return (
    <>
      <Navbar
        cartItems={cartItems}
        removeFromCart={removeFromCart}
        toggleCart={toggleCart}
        showCart={showCart}
        setShowCart={setShowCart}
        clearCartHandler={clearCartHandler}
      />

      <div className="cont">
        <div className="row">
          {productos.map((producto) => (
            <div
              key={producto.cod_producto}
              className="col-lg-4 col-md-6 col-12"
              data-aos="fade-up"
              data-aos-delay="400"
            >
              <Link to={`/producto/${producto.cod_producto}`}> {/* Enlace a la página de detalles */}
                <div className="className-thumb">
                  <div className="imagen">
                    <img
                      src="D_NQ_NP_978928-MLC50613847725_072022-O.jpg"
                      className="img-fluid"
                      alt="cerveza 1"
                    />
                  </div>

                  <div className="className-info">
                    <h3 className="mb-1">{producto.nombre_producto}</h3>
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
              </Link>
              <button
                className="agregar-carrito"
                onClick={() => addToCart(producto)}
              >
                Agregar al carrito
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default ProductosPage;
