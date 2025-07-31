import { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

const Login = () => {
  const navigate = useNavigate();

  const handleCredentialResponse = async (response) => {
  try {
    const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/google`, {
      token: response.credential,
    });

  const { token, user } = res.data;

  localStorage.setItem('token', token);
  localStorage.setItem('usuario_nombre', user.nombre);
  localStorage.setItem('usuario_email', user.email);
  localStorage.setItem('usuario_rol', user.rol);
  localStorage.setItem('usuario_imagen', user.imagen); 
    
  const userRol = user.rol;

    if (userRol === 'estudiante') {
      navigate('/dashboard-estudiante');
    } else if (userRol === 'admin-udh') {
      navigate('/admin');
    } else if (userRol === 'supervisor') {
      navigate('/modulo-supervisor');
    } else {
      navigate('/dashboard');
    }
  } catch (error) {
    // Mostrar toast si el usuario no existe (error 404)
    if (error.response?.status === 404) {
      Swal.fire({
        toast: true,
        position: 'bottom-end',
        icon: 'error',
        title: 'No se encontró una cuenta con ese correo',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer);
          toast.addEventListener('mouseleave', Swal.resumeTimer);
        },
      });
    } else {
      // Otro tipo de error (token inválido, red, backend)
      Swal.fire({
        icon: 'error',
        title: 'Error al iniciar sesión',
        text: 'Ocurrió un problema con el inicio de sesión.',
        confirmButtonText: 'OK',
      });
    }
  }
};


  useEffect(() => {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
      });

      window.google.accounts.id.renderButton(
        document.getElementById('googleButton'),
        { theme: 'outline', size: 'large' }
      );
    }
  }, []);

 return (
  <div className="min-h-screen flex flex-col md:flex-row items-start md:items-center justify-start md:justify-center bg-white dark:bg-gray-900 px-0 md:px-4 py-0 md:py-6">

    {/* Imagen para pantallas grandes (lado izquierdo) */}
    <div className="hidden md:block md:w-1/2 h-[calc(100vh+3rem)] -mt-12 -ml-8 overflow-hidden sm:rounded-br-[735px]">
      <img
        src="/images/logo.jpg"
        alt="Campus"
        className="h-full w-full object-cover"
      />
    </div>

    {/* Imagen para móviles (parte superior) */}
<div className="block md:hidden w-full px-0 mb-4 mt-[-1rem]">
      <img
        src="/images/logo.jpg"
        alt="Campus"
        className="w-full h-48 object-cover rounded-b-[80px] shadow-md"
      />
    </div>

    {/* Formulario de login */}
<div className="w-full md:w-1/2 flex items-start justify-center px-4 md:px-0 mt-20 md:mt-0">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl px-6 py-8 sm:p-10 max-w-md w-full text-center relative">

        {/* Esquinas decorativas */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-teal-500 rounded-tl-sm translate-x-2 translate-y-2"></div>
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-teal-500 rounded-br-sm -translate-x-2 -translate-y-2"></div>

        <h2 className="text-2xl font-normal text-gray-800 dark:text-white mb-2">Iniciar sesión</h2>

        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          ¿Aún no tienes una cuenta?
          <a
            href="/register"
            className="block bg-teal-500 text-white text-sm font-medium py-2 px-4 rounded-xl hover:bg-teal-600 hover:text-white transition mt-4 mb-4 mx-auto w-2/3"
          >
            REGÍSTRATE AQUÍ
          </a>
        </p>

        <p className="text-xs text-gray-500 italic mb-4">
          Tu correo debe terminar en <span className="font-bold">@udh.edu.pe</span>
        </p>

        <div id="googleButton" className="flex justify-center"></div>
      </div>
    </div>
  </div>
);

};

export default Login;
