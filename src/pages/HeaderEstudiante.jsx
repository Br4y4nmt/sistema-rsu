import { useEffect, useState, useRef } from 'react';
import { getUsuarioAutenticado } from '../services/authService';
import { useNavigate } from 'react-router-dom';

const HeaderEstudiante = ({ onToggleSidebar, mostrarSidebar }) => {
  const [usuario, setUsuario] = useState(null);
  const [foto, setFoto] = useState(null);
  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsuario = async () => {
      const user = await getUsuarioAutenticado();
      setUsuario(user);
      setFoto(localStorage.getItem('usuario_imagen'));
    };

    fetchUsuario();
  }, []);
    useEffect(() => {
    const handleClickOutside = (event) => {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenu(false);
        }
    };
    if (openMenu) {
        document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
        document.removeEventListener('mousedown', handleClickOutside);
    };
    }, [openMenu]);
  return (
    <header className="flex justify-between items-center bg-white dark:bg-gray-900 shadow px-4 py-4 w-full">
     {!mostrarSidebar ? (
        <button
        onClick={onToggleSidebar}
        className="bg-transparent border-none shadow-none p-0 m-0 text-gray-800 hover:text-teal-600 transition"
        aria-label="Abrir menú"
        >
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2" 
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-6 h-6"
        >
            <line x1="4" x2="20" y1="12" y2="12" />
            <line x1="4" x2="20" y1="6" y2="6" />
            <line x1="4" x2="20" y1="18" y2="18" />
        </svg>
        </button>
        ) : (
        <div className="w-6" />
        )}
        <div className="relative" ref={menuRef}>
       {foto ? (
       <button
        className="w-11 h-11 rounded-full overflow-hidden border-2 border-teal-500 bg-white focus:outline-none focus:ring-0 ring-0 outline-none"
        onClick={() => setOpenMenu((prev) => !prev)}
        aria-label="Abrir menú de perfil"
        style={{ padding: 0 }}
        >
        <img
            src={foto}
            alt="Perfil"
            className="w-full h-full object-cover object-center rounded-full"
            style={{ aspectRatio: '1/1' }}
            tabIndex={-1} // <-- Esto evita el focus en la imagen
        />
        </button>
        ) : (
        <div className="w-11 h-11 bg-gray-200 rounded-full animate-pulse" />
        )}
        {openMenu && (
        <div className="absolute right-0 mt-2 w-36 bg-white rounded-lg shadow-lg py-1 z-50 border border-gray-100">
         <button
              className="block w-full text-left px-3 py-1.5 hover:bg-[#011B4B] hover:text-white hover:rounded-md text-gray-800 font-semibold bg-white transition-colors focus:outline-none focus:ring-0 text-sm"
              onClick={() => {
                setOpenMenu(false);
                navigate('/perfil-alumno');
              }}
            >
              Perfil
        </button>
        <button
        className="block w-full text-left px-3 py-1.5 hover:bg-[#011B4B] hover:text-white hover:rounded-md text-gray-800 font-semibold bg-white transition-colors focus:outline-none focus:ring-0 text-sm"
        onClick={() => {
            localStorage.clear();
            setOpenMenu(false);
            navigate('/login');
        }}
        >
        Cerrar sesión
        </button>
        </div>
        )}
        </div>


    </header>
  );
};

export default HeaderEstudiante;
