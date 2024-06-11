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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProducto({
            ...producto,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

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
                        <input type="text" id="nombre_producto" name="nombre_producto" value={producto.nombre_producto} onChange={handleChange} style={styles.input} />
                    </div>
                    <div style={styles.formGroup}>
                        <label htmlFor="descripcion_producto" style={styles.label}>Descripción:</label>
                        <textarea id="descripcion_producto" name="descripcion_producto" value={producto.descripcion_producto} onChange={handleChange} style={styles.textarea}></textarea>
                    </div>
                    <div style={styles.formGroup}>
                        <label htmlFor="precio_producto" style={styles.label}>Precio:</label>
                        <input type="number" id="precio_producto" name="precio_producto" value={producto.precio_producto} onChange={handleChange} style={styles.input} />
                    </div>
                    <div style={styles.formGroup}>
                        <label htmlFor="stock_producto" style={styles.label}>Stock:</label>
                        <input type="number" id="stock_producto" name="stock_producto" value={producto.stock_producto} onChange={handleChange} style={styles.input} />
                    </div>
                    <div style={styles.formGroup}>
                        <label htmlFor="grado_alcoholico" style={styles.label}>Grado Alcohólico:</label>
                        <input type="number" id="grado_alcoholico" name="grado_alcoholico" value={producto.grado_alcoholico} onChange={handleChange} style={styles.input} />
                    </div>
                    <div style={styles.formGroup}>
                        <label htmlFor="litros" style={styles.label}>Litros:</label>
                        <input type="number" id="litros" name="litros" value={producto.litros} onChange={handleChange} style={styles.input} />
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
    }
};
