import { useEffect, useState } from 'react';
import { getUsuarioAutenticado } from '../services/authService';

const Rol3View = () => {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const fetchUsuario = async () => {
      const user = await getUsuarioAutenticado();
      setUsuario(user);
    };

    fetchUsuario();
  }, []);

  return (
    <div>
      <h1>Vista para Estudiante</h1>
      {usuario ? (
        <p>Bienvenido/a, {usuario.nombre}</p>
      ) : (
        <p>Cargando datos del usuario...</p>
      )}
    </div>
  );
};

export default Rol3View;
