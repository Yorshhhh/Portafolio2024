import React, { useState, useEffect } from 'react';

export default function ListarProductos() {
    const [productos, setProductos] = useState([]);
    const [editIndex, setEditIndex] = useState(null);

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
    };

    const handleSave = async (index) => {
        const producto = productos[index];

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

    return (
        <>
            <div style={styles.container}>
                <h1 style={styles.title}>Lista de Productos</h1>
                {productos.map((producto, index) => (
                    <div key={producto.cod_producto} style={styles.productCard}>
                        {editIndex === index ? (
                            <>
                                <input
                                    type="text"
                                    value={producto.nombre_producto}
                                    onChange={(e) => handleChange(index, 'nombre_producto', e.target.value)}
                                    style={styles.input}
                                />
                                <textarea
                                    value={producto.descripcion_producto}
                                    onChange={(e) => handleChange(index, 'descripcion_producto', e.target.value)}
                                    style={styles.textarea}
                                />
                                <input
                                    type="number"
                                    value={producto.precio_producto}
                                    onChange={(e) => handleChange(index, 'precio_producto', e.target.value)}
                                    style={styles.input}
                                />
                                <input
                                    type="number"
                                    value={producto.stock_producto}
                                    onChange={(e) => handleChange(index, 'stock_producto', e.target.value)}
                                    style={styles.input}
                                />
                                <input
                                    type="number"
                                    value={producto.grado_alcoholico}
                                    onChange={(e) => handleChange(index, 'grado_alcoholico', e.target.value)}
                                    style={styles.input}
                                />
                                <input
                                    type="number"
                                    value={producto.litros}
                                    onChange={(e) => handleChange(index, 'litros', e.target.value)}
                                    style={styles.input}
                                />
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
    }
};
