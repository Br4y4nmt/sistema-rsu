import { useEffect, useState } from 'react';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';


const DashboardEstudiante = () => {
  const [nombre, setNombre] = useState('');
  const [tipoSeleccionado, setTipoSeleccionado] = useState('');
  const token = localStorage.getItem('token'); 
  const [tipoYaSeleccionado, setTipoYaSeleccionado] = useState(false);
  const [actividad, setActividad] = useState(null);


  const obtenerClaseEstado = (estado) => {
  switch (estado) {
    case 'NO INICIADO':
      return 'bg-red-400 text-white';
    case 'EN PROCESO':
      return 'bg-yellow-400 text-white';
    case 'TERMINADO':
      return 'bg-green-500 text-white';
    default:
      return 'bg-gray-300 text-black';
  }
};
const irAlExamen = async () => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/examen/verificar-acceso`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await res.json();

    if (res.ok) {
      // ✅ Acceso permitido
      window.location.href = '/examen-estudiante'; 
    } else {
      // ❌ Acceso denegado
      Swal.fire({
        icon: 'warning',
        title: 'Acceso denegado',
        text: data.message || 'No tienes permiso para acceder al examen todavía.',
      });
    }
  } catch (error) {
    console.error('❌ Error al validar acceso al examen:', error.message);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Ocurrió un error al intentar acceder al examen.',
    });
  }
};
useEffect(() => {
  const token = localStorage.getItem('token');
  if (!token) return;

  const obtenerDatosActividad = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/actividades/actividad/detalles`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await res.json();
      if (res.ok) {
        setActividad(data);
      } else {
        console.error('❌ Error al obtener actividad:', data.message);
      }
    } catch (error) {
      console.error('❌ Error al obtener datos:', error.message);
    }
  };

  obtenerDatosActividad();
}, []);

 useEffect(() => {
  const token = localStorage.getItem('token');
  if (!token) return;

  const verificarTipo = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/actividades/actividad`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await res.json();

      if (res.ok && data.tipo) {
        setTipoYaSeleccionado(true); 
      } else {
        setTipoYaSeleccionado(false); 
      }
    } catch (error) {
      console.error('❌ Error al verificar tipo:', error.message);
    }
  };

  verificarTipo();
}, []);


  useEffect(() => {
    const nombreGuardado = localStorage.getItem('usuario_nombre');
    const idActividadGuardado = localStorage.getItem('actividad_id');
    if (nombreGuardado) setNombre(nombreGuardado);
    if (idActividadGuardado) setIdActividad(idActividadGuardado);
  }, []);

const confirmarTipoResiduo = async () => {
  const tipoMap = {
    organicos: 'RESIDUOS ORGÁNICOS',
    inorganicos: 'RESIDUOS INORGÁNICOS'
  };

  const tipoMapped = tipoMap[tipoSeleccionado];
  if (!tipoMapped) {
    Swal.fire({
      icon: 'warning',
      title: 'Oops...',
      text: 'Por favor seleccione una opción válida',
      confirmButtonText: 'Aceptar',
      customClass: {
        confirmButton: 'swal2-confirm-button'
      }
    });
    return;
  }

  const token = localStorage.getItem('token');

  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/actividades/actividad/tipo`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ tipo: tipoMapped })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Error al actualizar');

    Swal.fire({
      icon: 'success',
      title: 'Éxito',
      text: 'Tipo de residuo confirmado exitosamente.',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true
    }).then(() => {
      setTipoYaSeleccionado(true);
    });

  } catch (error) {
    console.error('❌ Error al confirmar tipo:', error.message);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Hubo un error al confirmar el tipo.',
    });
  }
};

const manejarCambioTipo = (e) => {
  setTipoSeleccionado(e.target.value);
};


return (
  <div className="w-full min-h-screen bg-gray-100 px-6 py-10 overflow-x-auto">
<div className="w-full max-w-screen-xl mx-auto px-4">     
<h2 className="text-4xl font-bold text-[#011B4B] text-center mb-6">
  Responsabilidad Social Universitaria
</h2>

  {tipoYaSeleccionado ? (
    <div className="w-full bg-white shadow-lg rounded-xl p-6 min-h-[300px] flex flex-col lg:flex-row items-center justify-center gap-8">
      <div className="flex justify-center lg:justify-start w-full">
        <div className="hidden lg:flex justify-start w-full">
        <img
          src="/images/img.png"
          alt="Responsabilidad Social"
          className="w-[200px] xl:w-[250px] 2xl:w-[300px] h-auto object-contain flex-shrink-0"
        />
      </div>
      </div>
                <div
        className="flex-1 flex flex-col justify-start mt-6 sm:mt-4 md:mt-2 lg:mt-0"
        style={{ fontFamily: 'Inter, sans-serif' }}
      >
            <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-md min-h-[260px] transition duration-300 hover:shadow-lg">
              <div className="flex items-center gap-3 mb-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="#7acecc"
                  className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12.75 3.03v.568c0 .334.148.65.405.864l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 0 1-1.161.886l-.143.048a1.107 1.107 0 0 0-.57 1.664c.369.555.169 1.307-.427 1.605L9 13.125l.423 1.059a.956.956 0 0 1-1.652.928l-.679-.906a1.125 1.125 0 0 0-1.906.172L4.5 15.75l-.612.153M12.75 3.031a9 9 0 0 0-8.862 12.872M12.75 3.031a9 9 0 0 1 6.69 14.036m0 0-.177-.529A2.25 2.25 0 0 0 17.128 15H16.5l-.324-.324a1.453 1.453 0 0 0-2.328.377l-.036.073a1.586 1.586 0 0 1-.982.816l-.99.282c-.55.157-.894.702-.8 1.267l.073.438c.08.474.49.821.97.821.846 0 1.598.542 1.865 1.345l.215.643m5.276-3.67a9.012 9.012 0 0 1-5.276 3.67m0 0a9 9 0 0 1-10.275-4.835M15.75 9c0 .896-.393 1.7-1.016 2.25"
                />
                </svg>
                <h1 className="text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl font-semibold text-gray-700">
                  EJECUCIÓN DE ACTIVIDAD
                </h1>
              </div>
              {actividad && (
          <div
              className="w-full overflow-x-auto md:overflow-visible mt-6"
              style={{ fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif' }}
            >
<table className="min-w-[900px] md:min-w-full table-auto border border-gray-300 rounded-xl overflow-hidden">
    <thead className="bg-[#2EBAA1] text-white text-sm text-center">
      <tr>
        <th className="px-4 py-2">Tipo</th>
        <th className="px-4 py-2">Cantidad Total</th>
        <th className="px-4 py-2">Cantidad Ingresada</th>
        <th className="px-4 py-2">Fecha Ingreso</th>
        <th className="px-4 py-2">Fecha Modificación</th>
        <th className="px-4 py-2">Estado</th>
      </tr>
    </thead>
    <tbody className="text-sm text-gray-700 text-center">
      <tr>
        <td className="px-4 py-2">{actividad.tipo || '---'}</td>
        <td className="px-4 py-2">{actividad.cantidad_total || '---'}</td>
        <td className="px-4 py-2">{actividad.cantidad_ingresada || '---'}</td>
        <td className="px-4 py-2">{actividad.fecha_ingreso?.split('T')[0] || '---'}</td>
        <td className="px-4 py-2">{actividad.fecha_modificacion?.split('T')[0] || '---'}</td>
        <td className="px-4 py-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap inline-block text-white ${obtenerClaseEstado(actividad.estado)}`}
            style={{ fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif' }}
          >
            {actividad.estado || '---'}
          </span>
        </td>
      </tr>
    </tbody>
  </table>
          {actividad.estado === 'TERMINADO' && (
          <div className="mt-4 text-center">
            <button
              onClick={irAlExamen}
              className="bg-[#2EBAA1] hover:bg-[#26A78D] text-white font-semibold px-6 py-2 rounded-lg transition-all duration-300"
              style={{ fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif' }}
            >
              Ir al examen
            </button>
          </div>
        )}
        </div>
        )}
            </div>
          </div>
        </div>
      ) : (
        // ❌ CASE 1: selección de tipo de actividad
        <div className="w-full bg-white shadow-lg rounded-xl p-8 min-h-[300px] flex flex-col md:flex-row items-center gap-6">
          <img
            src="/images/img.png"
            alt="Responsabilidad Social"
            className="w-52 sm:w-64 md:w-72 lg:w-80 xl:w-[440px] h-auto object-contain"
          />
         <div
className="flex-1 flex flex-col justify-start mt-[-18px] sm:mt-[-20px] md:mt-0 lg:mt-[-20px] xl:mt-[-40px]"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-md min-h-[260px] transition duration-300 hover:shadow-lg">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 mb-3 text-center sm:text-left">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="#7acecc"
  className="hidden md:block w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 flex-shrink-0"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12.75 3.03v.568c0 .334.148.65.405.864l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 0 1-1.161.886l-.143.048a1.107 1.107 0 0 0-.57 1.664c.369.555.169 1.307-.427 1.605L9 13.125l.423 1.059a.956.956 0 0 1-1.652.928l-.679-.906a1.125 1.125 0 0 0-1.906.172L4.5 15.75l-.612.153M12.75 3.031a9 9 0 0 0-8.862 12.872M12.75 3.031a9 9 0 0 1 6.69 14.036m0 0-.177-.529A2.25 2.25 0 0 0 17.128 15H16.5l-.324-.324a1.453 1.453 0 0 0-2.328.377l-.036.073a1.586 1.586 0 0 1-.982.816l-.99.282c-.55.157-.894.702-.8 1.267l.073.438c.08.474.49.821.97.821.846 0 1.598.542 1.865 1.345l.215.643m5.276-3.67a9.012 9.012 0 0 1-5.276 3.67m0 0a9 9 0 0 1-10.275-4.835M15.75 9c0 .896-.393 1.7-1.016 2.25"
    />
  </svg>

  <h1
    className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-semibold text-gray-700 leading-tight max-w-[300px] sm:max-w-full text-pretty sm:text-balance"
  >
    YA PUEDE REALIZAR SU ACTIVIDAD DE RESPONSABILIDAD SOCIAL
  </h1>
</div>
              <div className="flex items-center gap-2 mt-6 mb-1">
                <p className="text-sm sm:text-base md:text-lg text-gray-700 m-0">
                  Selección de tipo de actividad
                </p>
                <Tippy
                  content="Seleccione el tipo de residuos que gestionará como parte de su actividad de responsabilidad social universitaria."
                  className="tooltip-white"
                >
                  <div className="w-5 h-5 rounded-full flex items-center justify-center bg-white cursor-pointer">
                    <svg
                      className="w-4 h-4 text-gray-600"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 17.75C12.4142 17.75 12.75 17.4142 12.75 17V11C12.75 10.5858 12.4142 10.25 12 10.25C11.5858 10.25 11.25 10.5858 11.25 11V17C11.25 17.4142 11.5858 17.75 12 17.75Z"
                        fill="currentColor"
                      />
                      <path
                        d="M12 7C12.5523 7 13 7.44772 13 8C13 8.55228 12.5523 9 12 9C11.4477 9 11 8.55228 11 8C11 7.44772 11.4477 7 12 7Z"
                        fill="currentColor"
                      />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M1.25 12C1.25 6.06294 6.06294 1.25 12 1.25C17.9371 1.25 22.75 6.06294 22.75 12C22.75 17.9371 17.9371 22.75 12 22.75C6.06294 22.75 1.25 17.9371 1.25 12ZM12 2.75C6.89137 2.75 2.75 6.89137 2.75 12C2.75 17.1086 6.89137 21.25 12 21.25C17.1086 21.25 21.25 17.1086 21.25 12C21.25 6.89137 17.1086 2.75 12 2.75Z"
                        fill="currentColor"
                      />
                    </svg>
                  </div>
                </Tippy>
              </div>

              <div className="relative mt-0 w-full md:w-3/4">
                <select
                value={tipoSeleccionado}
                onChange={manejarCambioTipo}
className="w-full md:w-[380px] lg:w-[420px] bg-white border border-gray-300 text-gray-700 text-[10px] sm:text-xs md:text-sm rounded-xl px-4 py-2 shadow focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition"
                >
                  <option value="">SELECCIONE UNA OPCIÓN</option>
                  <option value="organicos">RESIDUOS ORGÁNICOS</option>
                  <option value="inorganicos">RESIDUOS INORGÁNICOS</option>
                </select>
              </div>

              <div className="flex justify-center mt-6">
                <button
                  onClick={confirmarTipoResiduo}
                  className="px-6 py-2 rounded-md text-white text-sm font-medium transition-all duration-300 transform hover:-translate-y-1"
                  style={{
                    backgroundColor: '#2EBAA1',
                    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif'
                  }}
                  onMouseEnter={(e) => (e.target.style.backgroundColor = '#26A78D')}
                  onMouseLeave={(e) => (e.target.style.backgroundColor = '#2EBAA1')}
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
);

};

export default DashboardEstudiante;
