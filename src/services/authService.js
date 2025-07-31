import axios from 'axios';

export const getUsuarioAutenticado = async () => {
  const token = localStorage.getItem('token');

  if (!token) return null;

  try {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return res.data;
  } catch (error) {
    console.error('❌ Error al obtener el usuario autenticado:', error);
    return null;
  }
};
