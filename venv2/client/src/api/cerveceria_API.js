import axios from "axios";

const cerveceriaAPI = axios.create({
  baseURL: "http://127.0.0.1:8000/",
});

export const getAllProductos = () => {
  return cerveceriaAPI.get("/productos/");
};

export const agregarProducto = (producto) => {
  return cerveceriaAPI.post("/productos/", producto);
}

export const registrarUsuario = (usuario) =>{
  return cerveceriaAPI.post("/usuarios/register/", usuario);
}

export const loginUsuario = (credenciales) =>{
  return cerveceriaAPI.post("/login/", credenciales)
}

export const getProducto = (id) =>{
  return cerveceriaAPI.get(`/productos/${id}`)
}

/* export const getTokenTransbank = async () => {
  try {
    const response = await axios.get(
      "http://localhost:3000/webpay_plus/getToken"
    );
    // Verificar si la respuesta contiene los datos esperados
    const { token, url } = response.data;
    if (!token || !url) {
      throw new Error(
        "La respuesta del servidor no contiene el token o la URL"
      );
    }
    return { token, url };
  } catch (error) {
    console.error("Error al obtener el token de Transbank:", error);
    throw error; // Relanzar el error para que el componente que llama pueda manejarlo
  }
};
 */
export const createTransaction = async (amount) => {
  try {
    const response = await axios.post('http://localhost:3000/webpay_plus/create', { amount });
    return response.data;
  } catch (error) {
    console.error("Error creating transaction:", error);
    throw error;
  }
};
