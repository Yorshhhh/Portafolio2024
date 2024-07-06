import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

function CardProducts({ producto }) {
  CardProducts.propTypes = {
    producto: PropTypes.object,
  };

  return (
    <div className="w-[250px] h-[400px] border-1 rounded-md bg-white shadow-md hover:shadow-xl">
      <div className="flex flex-col justify-between h-100 items-center">
        <div className="h-[300px] bg-cover">
          <Link to={`/producto/${producto.cod_producto}`}>
            <img
              src={producto.imagen} // Usar la URL real de la imagen del producto
              className="h-100 bg-cover"
              alt={`Imagen de ${producto.nombre_producto}`}
            />
          </Link>
        </div>

        <div className="mb-2">
          <h3 className="mb-1">{producto.nombre_producto}</h3>
          <p>Precio: ${producto.precio_producto}</p>
        </div>
        <button className="w-full bg-orange-400 py-2 px-6 text-white text-lg font-bold rounded-bt-md hover:bg-orange-600">
          Agregar al carrito
        </button>
      </div>
    </div>
  );
}

export default CardProducts;
