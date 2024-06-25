import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ListarProductos() {
    const [productos, setProductos] = useState([]);
    const [editIndex, setEditIndex] = useState(null);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchProductos = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/productos/');
                if (!response.ok) {
                    throw new Error('Error al obtener los productos');
                }
                const data = await response.json();
                setProductos(data);
            } catch (error) {
                console.error('Error al obtener los productos:', error);
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
            const response = await fetch(`http://127.0.0.1:8000/productos/${producto.cod_producto}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(producto)
            });

            if (!response.ok) {
                throw new Error('Error al guardar el producto');
            }

            // Actualización exitosa, mostrar alerta toast
            toast.success('Producto modificado correctamente');

            setEditIndex(null);
        } catch (error) {
            console.error('Error al guardar el producto:', error);
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

        if (producto.nombre_producto.trim() === '' || producto.nombre_producto.length < 5) {
            errors.nombre_producto = 'El campo Nombre Producto no puede estar vacío y debe tener al menos 5 caracteres.';
            valid = false;
        }
        if (producto.descripcion_producto.trim() === '' || producto.descripcion_producto.length < 10 || producto.descripcion_producto.length > 255) {
            errors.descripcion_producto = 'El campo Descripción no puede estar vacío y debe tener entre 10 y 255 caracteres.';
            valid = false;
        }
        const precio = parseFloat(producto.precio_producto);
        if (isNaN(precio) || precio <= 0 || precio < 5000 || precio > 20000) {
            errors.precio_producto = 'Por favor, ingresa un precio válido (entre $5000 y $20000).';
            valid = false;
        }
        if (producto.stock_producto === '' || producto.stock_producto <= 0 || producto.stock_producto < 1 || producto.stock_producto > 10) {
            errors.stock_producto = 'El Stock debe estar entre 1 y 10.';
            valid = false;
        }
        const gradoAlcoholico = parseFloat(producto.grado_alcoholico);
        if (isNaN(gradoAlcoholico) || gradoAlcoholico <= 0 || gradoAlcoholico < 4.5 || gradoAlcoholico > 7.2) {
            errors.grado_alcoholico = 'El campo Grado Alcohólico no puede estar vacío y estar entre 4.5 y 7.2 grados.';
            valid = false;
        }
        const litros = parseFloat(producto.litros);
        if (isNaN(litros) || litros <= 0 || litros < 473 || litros > 574) {
            errors.litros = 'El campo Litros no puede estar vacío y estar entre los 473cc y 574cc.';
            valid = false;
        }

        setErrors({ ...errors, [index]: errors });
        return valid;
    };

    return (
        <>
            <div style={styles.container}>
                <h1 style={styles.title}>Lista de Productos</h1>
                {productos.map((producto, index) => (
                    <div key={producto.cod_producto} style={styles.productCard}>
                        {editIndex === index ? (
                            <>
                                <label style={styles.label}>Nombre Producto:</label>
                                <input
                                    type="text"
                                    value={producto.nombre_producto}
                                    onChange={(e) => handleChange(index, 'nombre_producto', e.target.value)}
                                    style={styles.input}
                                />
                                {errors[index]?.nombre_producto && (
                                    <div style={styles.errorMessage}>{errors[index].nombre_producto}</div>
                                )}
                                <label style={styles.label}>Descripción:</label>
                                <textarea
                                    value={producto.descripcion_producto}
                                    onChange={(e) => handleChange(index, 'descripcion_producto', e.target.value)}
                                    style={styles.textarea}
                                />
                                <label style={styles.label}>Precio:</label>
                                <input
                                    type="number"
                                    value={producto.precio_producto}
                                    onChange={(e) => handleChange(index, 'precio_producto', e.target.value)}
                                    style={styles.input}
                                />
                                {errors[index]?.precio_producto && (
                                    <div style={styles.errorMessage}>{errors[index].precio_producto}</div>
                                )}
                                <label style={styles.label}>Stock:</label>
                                <input
                                    type="number"
                                    value={producto.stock_producto}
                                    onChange={(e) => handleChange(index, 'stock_producto', e.target.value)}
                                    style={styles.input}
                                />
                                {errors[index]?.stock_producto && (
                                    <div style={styles.errorMessage}>{errors[index].stock_producto}</div>
                                )}
                                <label style={styles.label}>Grado Alcohólico:</label>
                                <input
                                    type="number"
                                    value={producto.grado_alcoholico}
                                    onChange={(e) => handleChange(index, 'grado_alcoholico', e.target.value)}
                                    style={styles.input}
                                />
                                {errors[index]?.grado_alcoholico && (
                                    <div style={styles.errorMessage}>{errors[index].grado_alcoholico}</div>
                                )}
                                <label style={styles.label}>Litros:</label>
                                <input
                                    type="number"
                                    value={producto.litros}
                                    onChange={(e) => handleChange(index, 'litros', e.target.value)}
                                    style={styles.input}
                                />
                                {errors[index]?.litros && (
                                    <div style={styles.errorMessage}>{errors[index].litros}</div>
                                )}
                                <button onClick={() => handleSave(index)} style={styles.button}>
                                    Guardar
                                </button>
                            </>
                        ) : (
                            <>
                                <h2>{producto.nombre_producto}</h2>
                                <p>{producto.descripcion_producto}</p>
                                <p>Precio: {producto.precio_producto}</p>
                                <p>Stock: {producto.stock_producto}</p>
                                <p>Grado Alcohólico: {producto.grado_alcoholico}</p>
                                <p>Litros: {producto.litros}</p>
                                <div style={styles.buttonContainer}>
                                    <button onClick={() => handleEdit(index)} style={styles.button}>
                                        Modificar
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>
            <ToastContainer />
        </>
    );
}

const styles = {
    container: {
        maxWidth: '800px',
        margin: '0 auto',
        padding: '20px',
        fontFamily: 'Arial, sans-serif'
    },
    title: {
        textAlign: 'center',
        marginBottom: '20px'
    },
    productCard: {
        border: '1px solid #ccc',
        borderRadius: '4px',
        padding: '10px',
        marginBottom: '15px'
    },
    input: {
        width: '100%',
        padding: '8px',
        boxSizing: 'border-box',
        borderRadius: '4px',
        border: '1px solid #ccc',
        marginBottom: '10px'
    },
    textarea: {
        width: '100%',
        padding: '8px',
        boxSizing: 'border-box',
        borderRadius: '4px',
        border: '1px solid #ccc',
        marginBottom: '10px'
    },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'center',
        marginTop: '10px'
    },
    button: {
        padding: '10px 15px',
        border: 'none',
        borderRadius: '4px',
        background: '#000000', // Fondo negro
        color: '#ff0000', // Letras rojas
        cursor: 'pointer',
        textAlign: 'center'
    },
    errorMessage: {
        color: 'red',
        marginBottom: '10px'
    }
};
