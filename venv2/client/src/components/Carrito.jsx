import { useCart } from "../context/CarritoContext";
import '../css/Carrito.css'

function Carrito() {
  const {
    cartItems,
    removeFromCart,
    toggleCart,
    showCart,
    setShowCart,
    clearCart,
  } = useCart();

  const calculateTotal = (cartItems) => {
    return cartItems.reduce(
      (total, producto) => total + producto.precio_producto * producto.quantity,
      0
    );
  };

  return (
    <div>
      <a className="cart-icon"
        onClick={() => setShowCart(!showCart)}
        style={{ color: "white", textDecoration: "none" }}
      >
        Carrito ({cartItems.length})
      </a>
      {showCart && (
        <div id="carrito" className="cart-dropdown">
          <table className="cart-table">
            <thead>
              <tr>
                <th>Imagen</th>
                <th>Nombre</th>
                <th>Cantidad</th>
                <th>Precio</th>
                <th>Eliminar</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((producto) => (
                <tr key={producto.cod_producto}>
                  <td>
                    <img
                      src="../../public/D_NQ_NP_978928-MLC50613847725_072022-O.jpg"
                      alt=""
                      style={{ width: "50px" }}
                    />
                  </td>
                  <td>
                    <p>{producto.nombre_producto}</p>
                  </td>
                  <td>
                    <p>{producto.quantity}</p>
                  </td>
                  <td>
                    <p>${producto.precio_producto * producto.quantity}</p>
                  </td>
                  <td>
                    <button
                      className="btn btn-danger"
                      onClick={() => removeFromCart(producto.cod_producto)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="btn btn-warning" onClick={clearCart}>
            Vaciar Carrito
          </button>

          <button
            className="btn btn-primary"
            onClick={() => (window.location.href = "/prepago")}
          >
            Pagar
          </button>
          <div className="cart-total-preview">
            <span>
              <p>Total: ${calculateTotal(cartItems)}</p>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default Carrito;
