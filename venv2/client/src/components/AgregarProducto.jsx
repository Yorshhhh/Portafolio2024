import React, { useState } from 'react'


export default function AgregarProducto() {
    const [producto, setProducto] = useState({
        nombre_producto: '',
        descripcion_producto: '',
        precio_producto: 0,
        stock_producto: 0,
        grado_alcoholico: 0,
        litros: 0
    });

    const [error, setError] = useState('');
    const [errorNombreProducto, setErrorNombreProducto] = useState(false);
    const [errorDescripcionProducto, setErrorDescripcionProducto] = useState(false);
    const [errorPrecioProducto, setErrorPrecioProducto] = useState(false);
    const [errorStockProducto, setErrorStockProducto] = useState(false); // Nuevo estado de error
    const [errorGradoAlcoholico, setErrorGradoAlcoholico] = useState(false); // Nuevo estado de error
    const [errorLitros, setErrorLitros] = useState(false); // Nuevo estado de error

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProducto({
            ...producto,
            [name]: value
        });
        if (name === 'nombre_producto') {
            setErrorNombreProducto(false);
        }
        if (name === 'descripcion_producto') {
            setErrorDescripcionProducto(false);
        }
        if (name === 'precio_producto') {
            setErrorPrecioProducto(false);
        }
        if (name === 'stock_producto') {
            setErrorStockProducto(false); // Resetear error de stock_producto
        }
        if (name === 'grado_alcoholico') {
            setErrorStockProducto(false);
        }
        if (name === 'litros') {
            setErrorLitros(false); // Reiniciar el error de litros
        }
    };

    const validateForm = () => {
        let valid = true;
        if (producto.nombre_producto.trim() === '' || producto.nombre_producto.length < 5) {
            setErrorNombreProducto(true);
            valid = false;
        }
        if (producto.descripcion_producto.trim() === '' || producto.descripcion_producto.length < 10 || producto.descripcion_producto.length > 255) {
            setErrorDescripcionProducto(true);
            valid = false;
        }
        const precio = parseFloat(producto.precio_producto);
        if (isNaN(precio) || precio <= 0 || precio < 5000 || precio > 20000) {
            setErrorPrecioProducto(true);
            valid = false;
        } else {
            setErrorPrecioProducto(false);
        }
        // Validar campo stock_producto
        if (producto.stock_producto === '' || producto.stock_producto === 0 || producto.stock_producto < 1 || producto.stock_producto > 10) {
            setErrorStockProducto(true);
            valid = false;
        } else {
            setErrorStockProducto(false);
        }
        const gradoAlcoholico = parseFloat(producto.grado_alcoholico);
        if (isNaN(gradoAlcoholico) || gradoAlcoholico === 0 || gradoAlcoholico < 4.5 || gradoAlcoholico > 7.2) {
            setErrorGradoAlcoholico(true); // Error de grado_alcoholico
            valid = false;
        }
        const litros = parseFloat(producto.litros);
        if (isNaN(litros) || litros === 0 || litros < 473 || litros > 574) {
            setErrorLitros(true); // Error de litros
            valid = false;
        }
        return valid;

    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            const response = await fetch('http://127.0.0.1:8000/productos/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(producto)
            });

            if (!response.ok) {
                throw new Error('Error al agregar el producto');
            }

            console.log('Producto:', producto);
            // También puedes reiniciar el estado del formulario después de enviar los datos
            setProducto({
                nombre_producto: '',
                descripcion_producto: '',
                precio_producto: 0,
                stock_producto: 0,
                grado_alcoholico: 0,
                litros: 0
            });
            // Limpiar el mensaje de error si la validación es exitosa
            setError('');
            console.log('Producto agregado exitosamente');
        } catch (error) {
            setError('Error al agregar el producto');
            console.error('Error al agregar el producto:', error);
        }
    };


    return (
        <>
            <div style={styles.container}>
                <h1 style={styles.title}>Agregar Producto</h1>
                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.formGroup}>
                        <label htmlFor="nombre_producto" style={styles.label}>Nombre:</label>
                        <input
                            type="text"
                            id="nombre_producto"
                            name="nombre_producto"
                            value={producto.nombre_producto}
                            onChange={handleChange}
                            style={styles.input} />
                        {errorNombreProducto && (
                            <div style={styles.errorMessage}>
                                El campo Nombre Producto no puede estar vacío y debe tener al menos 5 caracteres.
                            </div>
                        )}
                    </div>
                    <div style={styles.formGroup}>
                        <label htmlFor="descripcion_producto" style={styles.label}>Descripción:</label>
                        <textarea
                            id="descripcion_producto"
                            name="descripcion_producto"
                            value={producto.descripcion_producto}
                            onChange={handleChange}
                            style={styles.textarea}></textarea>
                        {errorDescripcionProducto && (
                            <div style={styles.errorMessage}>
                                El campo Descripción no puede estar vacío y debe tener entre 10 y 255 caracteres.
                            </div>
                        )}
                    </div>
                    <div style={styles.formGroup}>
                        <label htmlFor="precio_producto" style={styles.label}>Precio:</label>
                        <input
                            type="number"
                            id="precio_producto"
                            name="precio_producto"
                            value={producto.precio_producto}
                            onChange={handleChange}
                            style={styles.input} />
                        {errorPrecioProducto && (
                            <div style={styles.errorMessage}>
                                Por favor, ingresa un precio válido (entre $5000 y $20000).
                            </div>
                        )}
                    </div>
                    <div style={styles.formGroup}>
                        <label htmlFor="stock_producto" style={styles.label}>Stock:</label>
                        <input
                            type="number"
                            id="stock_producto"
                            name="stock_producto"
                            value={producto.stock_producto}
                            onChange={handleChange}
                            style={styles.input} />
                        {errorStockProducto && (
                            <div style={styles.errorMessage}>
                                El Stock debe estar entre 1 y 10.
                            </div>
                        )}
                    </div>
                    <div style={styles.formGroup}>
                        <label htmlFor="grado_alcoholico" style={styles.label}>Grado Alcohólico:</label>
                        <input
                            type="number"
                            id="grado_alcoholico"
                            name="grado_alcoholico"
                            value={producto.grado_alcoholico}
                            onChange={handleChange}
                            style={styles.input} />
                        {errorGradoAlcoholico && (
                            <div style={styles.errorMessage}>
                                El campo Grado Alcohólico no puede estar vacío y estar entre 4.5 y 7.2 grados.
                            </div>
                        )}
                    </div>
                    <div style={styles.formGroup}>
                        <label htmlFor="litros" style={styles.label}>Litros:</label>
                        <input
                            type="number"
                            id="litros"
                            name="litros"
                            value={producto.litros}
                            onChange={handleChange}
                            style={styles.input} />
                        {errorLitros && (
                            <div style={styles.errorMessage}>
                                El campo Litros no puede estar vacío y estar entre los 473cc y 563cc.
                            </div>
                        )}
                    </div>
                    <button type="submit" style={styles.button}>Agregar Producto</button>
                </form>
                {error && <div style={styles.error}>{error}</div>}
            </div>
        </>
    )
}

const styles = {
    container: {
        maxWidth: '600px',
        margin: '0 auto',
        padding: '20px',
        fontFamily: 'Arial, sans-serif'
    },
    title: {
        textAlign: 'center',
        marginBottom: '20px'
    },
    form: {
        display: 'flex',
        flexDirection: 'column'
    },
    formGroup: {
        marginBottom: '15px'
    },
    label: {
        marginBottom: '5px'
    },
    input: {
        width: '100%',
        padding: '8px',
        boxSizing: 'border-box',
        borderRadius: '4px',
        border: '1px solid #ccc'
    },
    textarea: {
        width: '100%',
        padding: '8px',
        boxSizing: 'border-box',
        borderRadius: '4px',
        border: '1px solid #ccc'
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
    error: {
        marginTop: '20px',
        color: 'red',
        textAlign: 'center'
    },

    errorMessage: {
        color: 'red',
        marginTop: '5px'
    }
};
