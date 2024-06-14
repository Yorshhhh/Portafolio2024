import axios from "axios";

const cerveceriaAPI = axios.create({
  baseURL: "http://127.0.0.1:8000/",
});
// Agregar un interceptor para incluir el token en todas las solicitudes
cerveceriaAPI.interceptors.request.use(
  (config) => {
    // Obtener el token del almacenamiento local o algún otro lugar seguro
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Token ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const getAllProductos = () => {
  return cerveceriaAPI.get("/productos/");
};

export const agregarProducto = (producto) => {
  return cerveceriaAPI.post("/productos/", producto);
};

export const registrarUsuario = (usuario) => {
  return cerveceriaAPI.post("/usuarios/register/", usuario);
};

export const registrarAdmin = (admin) =>{
  return cerveceriaAPI.post("/usuarios/create_admin/", admin)
}

export const loginUsuario = (credenciales) => {
  return cerveceriaAPI.post("/login/", credenciales);
};
// Función para actualizar la dirección del usuario
export const actualizarDireccion = (id, nuevaDireccion) => {
  return cerveceriaAPI.patch(
    `/usuarios/${id}/`,
    { direccion: nuevaDireccion }
  );
};

/* export const actualizarDireccion = (correoUsuario, nuevaDireccion) => {
  return axios.put(`http://localhost:8000/usuarios/actualizar-direccion/${correoUsuario}/`, { direccion: nuevaDireccion })
      .then(response => {
          console.log('Dirección actualizada correctamente:', response.data);
          return response.data;
      })
      .catch(error => {
          console.error('Error al actualizar la dirección:', error);
          throw error;
      });
}; */

export const getProducto = (id) => {
  return cerveceriaAPI.get(`/productos/${id}`);
};

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
    const response = await axios.post(
      "http://localhost:3000/webpay_plus/create",
      { amount }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating transaction:", error);
    throw error;
  }
};
