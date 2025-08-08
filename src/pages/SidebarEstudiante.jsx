import { useEffect, useState } from 'react';
import { getUsuarioAutenticado } from '../services/authService';
import { Link, useLocation } from 'react-router-dom';


const SidebarEstudiante = ({ mostrarSidebar, onClose }) => {
  const [usuario, setUsuario] = useState(null);
  const [foto, setFoto] = useState(null);
  const [mostrarSubmenu, setMostrarSubmenu] = useState(true);
  const [mostrarSubmenuModulo, setMostrarSubmenuModulo] = useState(false);
  const [estadoActividad, setEstadoActividad] = useState(null);
  const location = useLocation();

 useEffect(() => {
  const fetchUsuario = async () => {
    const user = await getUsuarioAutenticado();
    setUsuario(user);
    setFoto(localStorage.getItem('usuario_imagen'));
  };

  const fetchEstadoActividad = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/actividades/estado/verificar`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setEstadoActividad(data.estado); 
      } else {
        console.error('❌ Error al obtener estado de actividad');
      }
    } catch (error) {
      console.error('❌ Error al conectar con el servidor', error);
    }
  };

  fetchUsuario();
  fetchEstadoActividad(); // 👈 llamado adicional
}, []);


  const getNombreDividido = (nombre) => {
    const partes = nombre.toUpperCase().split(' ');
    const mitad = Math.ceil(partes.length / 2);
    const linea1 = partes.slice(0, mitad).join(' ');
    const linea2 = partes.slice(mitad).join(' ');
    return [linea1, linea2];
  };

  const nombre = usuario?.nombre || localStorage.getItem('usuario_nombre') || '';
  const [linea1, linea2] = getNombreDividido(nombre);

  const esPantallaGrande = window.innerWidth >= 768;

  if (!mostrarSidebar) return null;

  return (
    <aside className="w-[258px] min-h-screen bg-white shadow-lg flex flex-col items-center py-6 relative transition-all duration-300">
      {/* Botón para ocultar */}
      <div className="absolute right-[-20px] top-6">
        <button
          onClick={onClose}
          className="relative w-8 h-8 rounded-full bg-[#dbe3ed] hover:bg-[#cfdbe9] shadow"
          aria-label="Colapsar menú"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="absolute top-1/2 left-1/2 w-6 h-6 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            viewBox="0 0 24 24"
            fill="none"
            stroke="black"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m12 19-7-7 7-7" />
            <path d="M19 12H5" />
          </svg>
        </button>
      </div>

      {/* Foto de perfil */}
      <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-teal-500 mb-2">
        {foto ? (
          <img src={foto} alt="Perfil" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gray-200 animate-pulse" />
        )}
      </div>

      {/* Nombre del usuario */}
      <h2 className="text-center font-semibold text-lg leading-snug text-gray-900 tracking-wide uppercase mt-1 mb-2 px-4">
        {linea1}<br />
        {linea2}
      </h2>
      <p className="text-[#48A6A7] font-semibold text-xl border-b-2 border-yellow-400 mt-1 mb-4">
        Estudiante
      </p>

      {/* Menú de navegación */}
      <nav className="w-full flex-1"> 
        <div className="mb-4">
      <div 
        className={`w-full flex items-center gap-3 mb-2 cursor-pointer h-[52px] rounded-lg px-4 transition-colors duration-200 ${
            mostrarSubmenu ? 'bg-[#F1F5F9]' : ''
        }`}
        onClick={() => setMostrarSubmenu(!mostrarSubmenu)}
        >
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="w-7 h-7 text-[#48A6A7]"
            fill="currentColor"
        >
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
            <g id="SVGRepo_iconCarrier">
            <path d="M12 17c-2.757 0-5-2.243-5-5s2.243-5 5-5 5 2.243 5 5-2.243 5-5 5zm0-8c-1.654 0-3 1.346-3 3s1.346 3 3 3 3-1.346 3-3-1.346-3-3-3z" />
            <path d="M22.59 9.09c-.18-.06-.93-.09-.93-.09-.55 0-1-.45-1-1 0-.28.12-.54.31-.72 0 0 .49-.54.57-.72.4-.75.28-1.71-.35-2.34l-1.41-1.41c-.39-.39-.9-.58-1.41-.58-.32 0-.64.08-.93.23-.18.08-.7.56-.7.56-.18.2-.44.32-.74.32-.55 0-1-.45-1-1V2c0-.21-.03-.41-.09-.59C14.66.59 13.89 0 13 0h-2c-.89 0-1.66.59-1.91 1.41-.06.18-.09.38-.09.59v.34c0 .55-.45 1-1 1-.3 0-.56-.12-.74-.32 0 0-.52-.48-.7-.56-.29-.15-.61-.23-.93-.23-.51 0-1.02.19-1.41.58L2.81 4.22c-.63.63-.75 1.59-.35 2.34.08.18.57.72.57.72.19.18.31.44.31.72 0 .55-.45 1-1 1 0 0-.75.03-.93.09C.59 9.34 0 10.11 0 11v2c0 .89.59 1.66 1.41 1.91.18.06.93.09.93.09.55 0 1 .45 1 1 0 .28-.12.54-.31.72 0 0-.49.54-.57.72-.4.75-.28 1.71.35 2.34l1.41 1.41c.39.39.9.58 1.41.58.32 0 .64-.08.93-.23.18-.08.7-.56.7-.56.18-.2.44-.32.74-.32.55 0 1 .45 1 1V22c0 .21.03.41.09.59.25.82 1.02 1.41 1.91 1.41h2c.89 0 1.66-.59 1.91-1.41.06-.18.09-.38.09-.59v-.34c0-.55.45-1 1-1 .3 0 .56.12.74.32 0 0 .52.48.7.56.29.15.61.23.93.23.51 0 1.02-.19 1.41-.58l1.41-1.41c.63-.63.75-1.59.35-2.34-.08-.18-.57-.72-.57-.72-.19-.18-.31-.44-.31-.72 0-.55.45-1 1-1 0 0 .75-.03.93-.09.82-.25 1.41-1.02 1.41-1.91v-2c0-.89-.59-1.66-1.41-1.91zM22 12.5c0 .27-.21.49-.48.5-1.59.07-2.86 1.39-2.86 3 0 .75.29 1.48.79 2.03.08.09.13.2.13.33 0 .14-.05.25-.13.34l-.73.72c-.09.09-.21.15-.35.15-.13 0-.25-.05-.34-.13-.54-.5-1.27-.78-2.03-.78-1.61 0-2.93 1.28-3.01 2.87-.01.26-.22.47-.49.47h-1c-.27 0-.48-.21-.49-.47-.08-1.59-1.4-2.87-3.01-2.87-.76 0-1.49.28-2.03.78-.09.08-.21.13-.34.13-.14 0-.26-.06-.35-.15l-.73-.72c-.08-.09-.13-.2-.13-.34 0-.13.05-.24.13-.33.5-.55.79-1.28.79-2.03 0-1.61-1.27-2.93-2.86-3-.27-.01-.48-.23-.48-.5v-1c0-.28.22-.5.5-.5 1.58-.08 2.84-1.4 2.84-3 0-.74-.28-1.45-.77-2 0 0-.01-.01-.01-.02-.09-.08-.14-.21-.14-.34 0-.14.06-.27.15-.36l.69-.7h.01c.09-.1.21-.16.36-.16.14 0 .26.06.35.15.55.49 1.27.77 2.02.77 1.6 0 2.91-1.26 3-2.84 0-.28.22-.5.5-.5h1c.28 0 .5.22.5.5.09 1.58 1.4 2.84 3 2.84.75 0 1.47-.28 2.02-.77.09-.09.21-.15.35-.15.15 0 .27.06.36.16h.01l.69.7c.09.09.15.22.15.36 0 .13-.05.26-.14.34 0 .01-.01.02-.01.02-.49.55-.77 1.26-.77 2 0 1.6 1.26 2.92 2.84 3 .28 0 .5.22.5.5v1z" />
            </g>
        </svg>
        <span
            className="text-[16px] font-semibold text-gray-800"
            style={{ fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif' }}
        >
            Ejecución 
        </span>
          <svg
            className={`w-4 h-4 ml-auto transition-transform duration-300 ${mostrarSubmenu ? 'rotate-180' : 'rotate-0'}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
        </div>
        {mostrarSubmenu && (
        <ul className="ml-8 space-y-2">
            <li>
        <Link
            to="/dashboard-estudiante"
            className={`block rounded-lg px-3 py-[7px] text-[14px] font-semibold transition-colors ${
            location.pathname === '/dashboard-estudiante'
                ? 'bg-[#011B4B] text-white'
                : 'text-gray-800'
            }`}
            style={{
            fontFamily: '"Segoe UI", sans-serif',
            color: location.pathname === '/dashboard-estudiante' ? 'white' : '#1f2937', 
            }}
        >
            Actividad
        </Link>
        </li>
            <li>
            {estadoActividad === 'TERMINADO' ? (
            <Link
              to="/examen-estudiante"
              className={`block rounded-lg px-3 py-[7px] text-[14px] font-semibold transition-colors ${
                location.pathname === '/examen-estudiante'
                  ? 'bg-[#011B4B] text-white'
                  : 'text-gray-800'
              }`}
              style={{
                fontFamily: '"Segoe UI", sans-serif',
                color: location.pathname === '/examen-estudiante' ? 'white' : '#1f2937',
              }}
            >
              Examen
            </Link>
          ) : (
            <span
              className="block rounded-lg px-3 py-[7px] text-[14px] font-semibold text-gray-400 cursor-not-allowed"
              title="Completa tu actividad para habilitar el examen"
            >
              Examen
            </span>
          )}
            </li>
        </ul>
        )}
        </div>
<div className="mb-4">
  <div 
    className={`w-full flex items-center gap-3 mb-2 cursor-pointer h-[52px] rounded-lg px-4 transition-colors duration-200 ${
      mostrarSubmenuModulo ? 'bg-[#F1F5F9]' : ''
    }`}
    onClick={() => setMostrarSubmenuModulo(!mostrarSubmenuModulo)}
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#0cbba7" strokewidth="1" strokelinecap="round" stroke-linejoin="round" class="lucide lucide-component-icon lucide-component"><path d="M15.536 11.293a1 1 0 0 0 0 1.414l2.376 2.377a1 1 0 0 0 1.414 0l2.377-2.377a1 1 0 0 0 0-1.414l-2.377-2.377a1 1 0 0 0-1.414 0z"/><path d="M2.297 11.293a1 1 0 0 0 0 1.414l2.377 2.377a1 1 0 0 0 1.414 0l2.377-2.377a1 1 0 0 0 0-1.414L6.088 8.916a1 1 0 0 0-1.414 0z"/><path d="M8.916 17.912a1 1 0 0 0 0 1.415l2.377 2.376a1 1 0 0 0 1.414 0l2.377-2.376a1 1 0 0 0 0-1.415l-2.377-2.376a1 1 0 0 0-1.414 0z"/><path d="M8.916 4.674a1 1 0 0 0 0 1.414l2.377 2.376a1 1 0 0 0 1.414 0l2.377-2.376a1 1 0 0 0 0-1.414l-2.377-2.377a1 1 0 0 0-1.414 0z"/></svg>
    <span className="text-[16px] font-semibold text-gray-800">
      Módulo
    </span>
    <svg
      className={`w-4 h-4 ml-auto transition-transform duration-300 ${
        mostrarSubmenuModulo ? 'rotate-180' : 'rotate-0'
      }`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  </div>
 {mostrarSubmenuModulo && (
  <ul className="ml-8 space-y-2">
     <li>
        <Link
            to="/modulo-estudiante"
            className={`block rounded-lg px-3 py-[7px] text-[14px] font-semibold transition-colors ${
            location.pathname === '/modulo-estudiante'
                ? 'bg-[#011B4B] text-white'
                : 'text-gray-800'
            }`}
            style={{
            fontFamily: '"Segoe UI", sans-serif',
            color: location.pathname === '/modulo-estudiante' ? 'white' : '#1f2937',
            }}
        >
            Ver Modulos
        </Link>
        </li>

  </ul>
)}
</div>
      </nav>
    </aside>
  );
};

export default SidebarEstudiante;
