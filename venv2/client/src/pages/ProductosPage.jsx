import React, { useEffect, useState } from "react";
import { getAllProductos } from "../api/cerveceria_API";
import Navbar from "../components/Navbar";
import { useCart } from "../context/CarritoContext";
import "../css/styleproducto.css";
import CardProducts from "../components/CardProducts";

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
  const [sortCriteria, setSortCriteria] = useState("default");

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

  const handleSortChange = (e) => {
    setSortCriteria(e.target.value);
  };

  const sortProducts = (products, criteria) => {
    switch (criteria) {
      case "price-asc":
        return products.sort((a, b) => a.precio_producto - b.precio_producto);
      case "price-desc":
        return products.sort((a, b) => b.precio_producto - a.precio_producto);
      default:
        return products;
    }
  };

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
      <h1 className="text-black font-bold flex justify-center border-1 rounded-md">
        Todos los productos
      </h1>
      <div className="flex justify-start mb-4">
        <select className="p-2 border border-gray-300 rounded-md bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            onChange={handleSortChange}
            value={sortCriteria}>
          <option value="default">Ordenar por...</option>
          <option value="price-asc">Precio: Menor a Mayor</option>
          <option value="price-desc">Precio: Mayor a Menor</option>
        </select>
      </div>
      <div className="flex flex-wrap gap-4 justify-center mt-4">
        {sortProducts(productos, sortCriteria).map((producto) => (
          <CardProducts key={producto.cod_producto} producto={producto} />
        ))}
      </div>
    </>
  );
}

export default ProductosPage;
