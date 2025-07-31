// src/components/PrivateRoute.jsx
import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getUsuarioAutenticado } from '../services/authService';

const PrivateRoute = ({ children, rolPermitido }) => {
  const [loading, setLoading] = useState(true);
  const [autorizado, setAutorizado] = useState(false);

  useEffect(() => {
    const validarUsuario = async () => {
      const usuario = await getUsuarioAutenticado();
      if (usuario && usuario.rol_id === rolPermitido) {
        setAutorizado(true);
      }
      setLoading(false);
    };
    validarUsuario();
  }, [rolPermitido]);

  if (loading) return <div>Cargando...</div>;

  return autorizado ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
