import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ModificarCardProduct from "./ModificarCardProduct";

export default function ListarProductos() {
  const [productos, setProductos] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/productos/");
        if (!response.ok) {
          throw new Error("Error al obtener los productos");
        }
        const data = await response.json();
        setProductos(data);
      } catch (error) {
        console.error("Error al obtener los productos:", error);
      }
    };
    fetchProductos();
  }, []);

  const handleEdit = (index) => {
    setEditIndex(index);
    setErrors({});
  };

  const handleSave = async (index) => {
    const producto = productos[index];

    if (!validateForm(producto, index)) {
      return;
    }

    try {
      const formData = new FormData();
      formData.append("nombre_producto", producto.nombre_producto);
      formData.append("descripcion_producto", producto.descripcion_producto);
      formData.append("precio_producto", producto.precio_producto);
      formData.append("stock_producto", producto.stock_producto);
      formData.append("grado_alcoholico", producto.grado_alcoholico);
      formData.append("litros", producto.litros);
      // Añade la imagen solo si se ha seleccionado una nueva
      if (producto.imagen instanceof File) {
        formData.append("imagen", producto.imagen);
      }

      const response = await fetch(
        `http://127.0.0.1:8000/productos/${producto.cod_producto}/`,
        {
          method: "PUT",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Error al guardar el producto");
      }

      // Actualización exitosa, mostrar alerta toast
      toast.success("Producto modificado correctamente");

      setEditIndex(null);
    } catch (error) {
      console.error("Error al guardar el producto:", error);
    }
  };

  const handleChange = (index, field, value) => {
    const updatedProductos = productos.map((producto, i) =>
      i === index ? { ...producto, [field]: value } : producto
    );
    setProductos(updatedProductos);
  };

  const validateForm = (producto, index) => {
    const errors = {};
    let valid = true;

    if (
      producto.nombre_producto.trim() === "" ||
      producto.nombre_producto.length < 5
    ) {
      errors.nombre_producto =
        "El campo Nombre Producto no puede estar vacío y debe tener al menos 5 caracteres.";
      valid = false;
    }
    if (
      producto.descripcion_producto.trim() === "" ||
      producto.descripcion_producto.length < 10 ||
      producto.descripcion_producto.length > 255
    ) {
      errors.descripcion_producto =
        "El campo Descripción no puede estar vacío y debe tener entre 10 y 255 caracteres.";
      valid = false;
    }
    const precio = parseFloat(producto.precio_producto);
    if (isNaN(precio) || precio <= 0 || precio < 5000 || precio > 20000) {
      errors.precio_producto =
        "Por favor, ingresa un precio válido (entre $5000 y $20000).";
      valid = false;
    }
    if (
      producto.stock_producto === "" ||
      producto.stock_producto <= 0 ||
      producto.stock_producto < 1 ||
      producto.stock_producto > 10
    ) {
      errors.stock_producto = "El Stock debe estar entre 1 y 10.";
      valid = false;
    }
    const gradoAlcoholico = parseFloat(producto.grado_alcoholico);
    if (
      isNaN(gradoAlcoholico) ||
      gradoAlcoholico <= 0 ||
      gradoAlcoholico < 4.5 ||
      gradoAlcoholico > 7.2
    ) {
      errors.grado_alcoholico =
        "El campo Grado Alcohólico no puede estar vacío y estar entre 4.5 y 7.2 grados.";
      valid = false;
    }
    const litros = parseFloat(producto.litros);
    if (isNaN(litros) || litros <= 0 || litros < 473 || litros > 574) {
      errors.litros =
        "El campo Litros no puede estar vacío y estar entre los 473cc y 574cc.";
      valid = false;
    }

    setErrors({ ...errors, [index]: errors });
    return valid;
  };

  const handleImageChange = (index, event) => {
    const file = event.target.files[0];
    if (file) {
      const updatedProductos = productos.map((producto, i) =>
        i === index ? { ...producto, imagen: file } : producto
      );
      setProductos(updatedProductos);
    }
  };

  return (
    <div className="my-[2rem]  flex flex-col items-center justify-center bg-gray-100">
      <div className="w-full max-w-screen-xl p-4">
        <h1 className="text-3xl font-bold text-center mb-8">
          Lista de Productos
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {productos.map((producto, index) => (
            <div
              key={producto.cod_producto}
              className="rounded-md shadow-md hover:shadow-xl bg-white"
            >
              <ModificarCardProduct producto={producto} />
            </div>
          ))}
        </div>
        <ToastContainer />
      </div>
    </div>
  );
}
