import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaEyeSlash } from 'react-icons/fa';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
const Register = () => {
  const [form, setForm] = useState({
    codigo: '',
    dni: '',
    whatsapp: '',
    accepted: false,
  });
  const navigate = useNavigate();
    const Toast = Swal.mixin({
    toast: true,
    position: 'bottom-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
    },
    });

  const [showDNI, setShowDNI] = useState(false);
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!form.accepted) {
    Toast.fire({
      icon: 'info',
      title: 'Acepte los términos y condiciones para registrarse.',
    });
    return;
  }

  if (form.whatsapp.length !== 9 || !/^\d+$/.test(form.whatsapp)) {
    Swal.fire({
      icon: 'warning',
      title: 'WhatsApp inválido',
      text: 'El número de WhatsApp debe tener exactamente 9 dígitos.',
    });
    return;
  }

  try {
    await axios.post(`${import.meta.env.VITE_API_URL}/usuarios`, {
      codigo: form.codigo,
      dni: form.dni,
      whatsapp: form.whatsapp,
    });

    Swal.fire({
      icon: 'success',
      title: 'Registro exitoso',
      text: 'Su registro fue exitoso',
      timer: 2500,
      showConfirmButton: false,
    });

    setForm({ codigo: '', dni: '', whatsapp: '', accepted: false });

    setTimeout(() => {
      navigate('/login');
    }, 2500);

  } catch (error) {
    console.error('❌ Error al registrar:', error);

    const response = error.response?.data;

    if (response?.code === 'ER_DUP_ENTRY') {
      const field = response.field;

      if (field === 'email') {
        Swal.fire({
          icon: 'warning',
          title: 'Correo ya registrado',
          text: 'Este correo institucional ya ha sido utilizado para registrarse.',
        });
        return;
      }

      if (field === 'dni') {
        Swal.fire({
          icon: 'warning',
          title: 'DNI ya registrado',
          text: 'Este número de DNI ya ha sido utilizado en otro registro.',
        });
        return;
      }

      if (field === 'whatsapp') {
        Swal.fire({
          icon: 'warning',
          title: 'WhatsApp ya registrado',
          text: 'Este número de WhatsApp ya ha sido utilizado en otro registro.',
        });
        return;
      }
    }

    Swal.fire({
      icon: 'error',
      title: 'Error al registrar',
      text: response?.message || 'Ocurrió un error inesperado al registrar.',
    });
  }
};


return (
  <div className="min-h-screen flex flex-col md:flex-row items-start md:items-center justify-start md:justify-center bg-white dark:bg-gray-900 px-0 md:px-4 py-0 md:py-6">

    {/* Imagen para pantallas grandes (lado izquierdo) */}
    <div className="hidden md:block md:w-1/2 h-[calc(100vh+3rem)] -mt-12 -ml-8 overflow-hidden sm:rounded-br-[735px]">
    <img
      src="/images/logo.jpg"
      alt="Campus"
      className="h-full w-full object-cover object-top"
    />
  </div>
 
  <div className="block md:hidden w-full px-0 mb-4 mt-[-1rem]">
      <img
        src="/images/logo.jpg"
        alt="Campus"
        className="w-full h-48 object-cover rounded-b-[80px] shadow-md"
      />
    </div>

    {/* Formulario */}
    <div className="w-full md:w-1/2 flex items-center justify-center px-4 md:px-0">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl px-6 py-8 sm:p-10 max-w-md w-full text-center relative">

        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-teal-500 rounded-tl-sm translate-x-2 translate-y-2"></div>
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-teal-500 rounded-br-sm -translate-x-2 -translate-y-2"></div>

        <h2 className="text-2xl font-normal text-gray-800 dark:text-white mb-1">Regístrate</h2>
        <p className="text-base mt-1 mb-5 text-gray-600 font-normal">
          ¿Ya tienes una cuenta?{' '}
          <a
            href="/login"
            className="text-teal-500 font-normal hover:underline hover:text-teal-500"
          >
            Inicia sesión aquí
          </a>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          {/* Código */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Código (10 dígitos)</label>
            <div className="flex rounded-lg border border-gray-300 focus-within:ring-2 focus-within:ring-teal-500 overflow-hidden">
              <input
                type="text"
                name="codigo"
                value={form.codigo}
                onChange={(e) => {
                  const onlyNums = e.target.value.replace(/\D/g, '');
                  if (onlyNums.length <= 10) {
                    setForm((prev) => ({ ...prev, codigo: onlyNums }));
                  }
                }}
                placeholder="Código institucional"
                maxLength={10}
                pattern="\d{10}"
                required
                className="w-full px-3 py-2 focus:outline-none text-gray-600 placeholder-gray-400"
              />
              <span className="px-3 py-2 text-sm text-gray-700 flex items-center bg-white">@udh.edu.pe</span>
            </div>
          </div>

          {/* DNI */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">DNI</label>
            <div className="relative">
              <input
                type={showDNI ? 'text' : 'password'}
                name="dni"
                value={form.dni}
                onChange={(e) => {
                  const onlyNums = e.target.value.replace(/\D/g, '');
                  if (onlyNums.length <= 8) {
                    setForm((prev) => ({ ...prev, dni: onlyNums }));
                  }
                }}
                placeholder="Ingrese número DNI"
                maxLength={8}
                pattern="\d{8}"
                onInvalid={(e) =>
                  e.target.setCustomValidity('El número de DNI debe tener exactamente 8 dígitos numéricos.')
                }
                onInput={(e) => e.target.setCustomValidity('')}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <span
                className="absolute right-3 top-2.5 text-gray-400 cursor-pointer"
                onClick={() => setShowDNI(!showDNI)}
              >
                <FaEyeSlash />
              </span>
            </div>
          </div>

          {/* WhatsApp */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">WhatsApp</label>
            <input
              type="text"
              name="whatsapp"
              value={form.whatsapp}
              onChange={(e) => {
                const onlyNums = e.target.value.replace(/\D/, '');
                if (onlyNums.length <= 9) {
                  setForm((prev) => ({ ...prev, whatsapp: onlyNums }));
                }
              }}
              placeholder="Ingrese número de WhatsApp"
              maxLength={9}
              minLength={9}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Checkbox */}
          <div className="flex items-start text-[15px] font-[600] leading-snug font-sans cursor-pointer">
            <label htmlFor="accepted" className="flex items-start text-gray-600 select-none space-x-2">
              <input
                id="accepted"
                type="checkbox"
                name="accepted"
                checked={form.accepted}
                onChange={handleChange}
                className="mt-1 mr-2"
              />
              <span>
                Acepto las <span className="text-orange-500">condiciones del servicio</span> y las{' '}
                <span className="text-orange-500">políticas de privacidad</span>
              </span>
            </label>
          </div>

          {/* Botón */}
          <button
            type="submit"
            className="block bg-teal-500 text-white text-sm font-medium py-2 px-4 rounded-md hover:bg-[#011B4B] transition w-full"
          >
            REGISTRAR
          </button>
        </form>
      </div>
    </div>
  </div>
);

};

export default Register;
