import React, { useEffect, useState } from 'react';
import { Dialog } from '@headlessui/react';
import { PlusIcon } from '@heroicons/react/24/solid';
import Swal from 'sweetalert2';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css'; 

const ActividadSupervisor = () => {
  const [actividades, setActividades] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [actividadSeleccionada, setActividadSeleccionada] = useState(null);
  const [cantidadNueva, setCantidadNueva] = useState('');
  const [evidencia, setEvidencia] = useState(null);
  const [modalVerEvidencias, setModalVerEvidencias] = useState(false);
  const [evidenciasActividad, setEvidenciasActividad] = useState([]);
  const [modalEditarCantidad, setModalEditarCantidad] = useState(false);
  const [cantidadTotalEditada, setCantidadTotalEditada] = useState('');


  const verEvidencias = async (id_actividad) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/evidencias/actividad/${id_actividad}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setEvidenciasActividad(data);
        setModalVerEvidencias(true);
      } else {
        console.error('Error al obtener evidencias');
      }
    } catch (error) {
      console.error('Error de red al obtener evidencias:', error);
    }
  };

  const obtenerActividades = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/actividades`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setActividades(data);
      } else {
        console.error('Error al obtener actividades');
      }
    } catch (error) {
      console.error('Error de red al obtener actividades:', error);
    }
  };

  useEffect(() => {
    obtenerActividades();
  }, []);

 const abrirModal = async (actividad) => {
  setActividadSeleccionada(actividad);
  setCantidadNueva('');
  setEvidencia(null);

  // Cargar evidencias de la actividad seleccionada
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${import.meta.env.VITE_API_URL}/evidencias/actividad/${actividad.id_actividad}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      setEvidenciasActividad(data); // Aquí es donde realmente alimentamos el array
      setModalAbierto(true);        // Recién después mostramos el modal
    } else {
      console.error('Error al obtener evidencias');
    }
  } catch (error) {
    console.error('Error de red al obtener evidencias:', error);
  }
};


  const cerrarModal = () => {
    setModalAbierto(false);
    setActividadSeleccionada(null);
  };

  const abrirModalEditarCantidad = (actividad) => {
    setActividadSeleccionada(actividad);
    setCantidadTotalEditada(actividad.cantidad_total || '');
    setModalEditarCantidad(true);
  };
const guardarCantidadTotal = async () => {
  if (!cantidadTotalEditada.trim()) {
    Swal.fire({
      icon: 'warning',
      title: 'Campo obligatorio',
      text: 'Ingresa una cantidad válida.',
    });
    return;
  }

  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${import.meta.env.VITE_API_URL}/actividades/cantidad/${actividadSeleccionada.id_actividad}`, {

      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ cantidad_total: cantidadTotalEditada }),
    });

    if (response.ok) {
      Swal.fire({
        icon: 'success',
        title: 'Cantidad actualizada',
        timer: 1800,
        showConfirmButton: false,
      });
      setModalEditarCantidad(false);
      obtenerActividades();
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo actualizar la cantidad.',
      });
    }
  } catch (error) {
    console.error('Error:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error de red',
      text: 'No se pudo conectar al servidor.',
    });
  }
};
const handleSubmit = async () => {
  if (!cantidadNueva || !evidencia) {
    Swal.fire({
      icon: 'warning',
      title: 'Campos incompletos',
      text: 'Por favor ingresa la cantidad y selecciona una imagen.',
    });
    return;
  }

  const cantidadNuevaNum = parseInt(cantidadNueva);
  const cantidadTotalNum = parseInt(actividadSeleccionada.cantidad_total.replace(/\D/g, ''));


  // Validar que la nueva cantidad sea un número válido
  if (isNaN(cantidadNuevaNum)) {
    Swal.fire({
      icon: 'error',
      title: 'Cantidad inválida',
      text: 'Ingresa un número válido para la cantidad.',
    });
    return;
  }

  // Sumar evidencias anteriores
  const totalActualIngresado = evidenciasActividad.reduce((acc, ev) => {
    const cantidad = parseInt(ev.cantidad_ingresada.replace(/\D/g, ''));
    return acc + (isNaN(cantidad) ? 0 : cantidad);
  }, 0);

  const nuevaCantidadAcumulada = totalActualIngresado + cantidadNuevaNum;

  if (nuevaCantidadAcumulada > cantidadTotalNum) {
    Swal.fire({
    icon: 'error',
    title: 'Cantidad excedida',
    text: `La suma total (${nuevaCantidadAcumulada} KILOS) supera la cantidad total permitida (${cantidadTotalNum} KILOS).`,
    confirmButtonText: 'OK',
    customClass: {
      confirmButton: 'swal2-confirm-button'
    }
  });

    return;
  }

  // Crear y enviar FormData
  const formData = new FormData();
  formData.append('id_actividad', actividadSeleccionada.id_actividad);
  formData.append('cantidad_ingresada', `${cantidadNueva} KILOS`);
  formData.append('evidencia', evidencia);

  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${import.meta.env.VITE_API_URL}/evidencias`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (response.ok) {
      Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: 'Peso y evidencia registrada correctamente.',
        timer: 2000,
        showConfirmButton: false,
      });

      cerrarModal();
      obtenerActividades(); // Refrescar la tabla
    } else {
      const error = await response.json();
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'No se pudo registrar la evidencia.',
      });
    }
  } catch (error) {
    console.error('Error al enviar datos:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error de red',
      text: 'Hubo un problema al conectar con el servidor.',
    });
  }
};

  return (
    <div className="w-full min-h-screen bg-gray-100 px-6 py-10">
      <div className="max-w-screen-2xl mx-auto bg-white shadow-lg rounded-xl p-6">
        <div className="flex items-center gap-4 mb-6">
          <h1 className="text-2xl font-bold text-[#011B4B]">Actividades de Estudiantes</h1>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-transparent text-gray-900 text-left">
                <th className="px-4 py-3 text-sm font-medium">N°</th>
                <th className="px-4 py-3 text-sm font-medium">Nombre</th>
                <th className="px-4 py-3 text-sm font-medium">Correo</th>
                <th className="px-4 py-3 text-sm font-medium">Celular</th>
                <th className="px-4 py-3 text-sm font-medium">Programa Académico</th>
                <th className="px-4 py-3 text-sm font-medium">Tipo</th>
                <th className="px-4 py-3 text-sm font-medium">Cantidad Total</th>
                <th className="px-4 py-3 text-sm font-medium">Cantidad Ingresada</th>
                <th className="px-4 py-3 text-sm font-medium">Evidenciar</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-800">
              {actividades.map((actividad, index) => (
                <tr
                  key={actividad.id_actividad}
                  className={`border-b ${actividad.cantidad_total === actividad.cantidad_ingresada ? 'bg-green-50' : 'bg-gray-50'}`}
                >
                  <td className="px-4 py-3">{index + 1}</td>
                  <td className="px-4 py-3">{actividad.nombre}</td>
                  <td className="px-4 py-3">{actividad.correo}</td>
                  <td className="px-4 py-3">{actividad.celular}</td>
                  <td className="px-4 py-3">{actividad.programa_academico}</td>
                 <td className="px-4 py-3">
                  {actividad.tipo ? (
                    <span className="text-gray-800 font-normal">{actividad.tipo}</span>
                  ) : (
                    <span className="italic text-gray-400 font-normal text-xs" style={{ fontFamily: 'Segoe UI, sans-serif' }}>
                      NO SELECCIONADO
                    </span>
                  )}
                </td>
                  <td className="px-4 py-3 flex items-center gap-2">
                    {actividad.cantidad_total}
                    <button
                      onClick={() => abrirModalEditarCantidad(actividad)}
                      className="text-blue-600 hover:text-blue-800"
                      title="Editar cantidad total"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M12 20h9" />
                        <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4z" />
                      </svg>
                    </button>
                  </td>
                  <td className="px-4 py-3">{actividad.cantidad_ingresada}</td>
                  <td className="px-4 py-3">
                  <div className="flex gap-2 items-center">
                  <Tippy
                    content={
                      actividad.cantidad_total === actividad.cantidad_ingresada
                        ? 'Ya se completó con el peso'
                        : 'Registrar evidencia'
                    }
                  >
                    <span>
                      <button
                        onClick={() => abrirModal(actividad)}
                        className="text-blue-600 hover:text-blue-800 disabled:text-gray-400"
                        disabled={actividad.cantidad_total === actividad.cantidad_ingresada}
                      >
                        <PlusIcon className="h-5 w-5" />
                      </button>
                    </span>
                  </Tippy>
                    <button onClick={() => verEvidencias(actividad.id_actividad)} className="text-gray-600 hover:text-gray-900">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                  </div>
                </td>
                </tr>
              ))}
              {actividades.length === 0 && (
                <tr>
                  <td colSpan="8" className="text-center py-4 text-gray-500">
                    No hay estudiantes registrados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

<Dialog open={modalEditarCantidad} onClose={() => setModalEditarCantidad(false)} className="fixed z-50 inset-0 overflow-y-auto">
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" aria-hidden="true"></div>

  <div className="flex items-center justify-center min-h-screen px-4">
    <Dialog.Panel className="relative z-10 w-full max-w-sm bg-white rounded-2xl shadow-xl p-6 sm:p-8">
      <Dialog.Title className="text-xl font-semibold text-gray-800 mb-6">
        Editar Cantidad Total
      </Dialog.Title>

      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-1">Selecciona una cantidad</label>
        <select
          value={cantidadTotalEditada}
          onChange={(e) => setCantidadTotalEditada(e.target.value)}
          className="w-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-md px-3 py-2 text-sm shadow-sm outline-none bg-white"
        >
          <option value="" disabled>-- Selecciona --</option>
          <option value="5 KILOS">5 KILOS</option>
          <option value="10 KILOS">10 KILOS</option>
          <option value="15 KILOS">15 KILOS</option>
          <option value="20 KILOS">20 KILOS</option>
        </select>
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <button
          onClick={() => setModalEditarCantidad(false)}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md transition"
        >
          Cancelar
        </button>
        <button
          onClick={guardarCantidadTotal}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition shadow"
        >
          Guardar
        </button>
      </div>
    </Dialog.Panel>
  </div>
</Dialog>

 <Dialog open={modalVerEvidencias} onClose={() => setModalVerEvidencias(false)} className="fixed z-50 inset-0 overflow-y-auto">
  <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm transition-opacity duration-300" aria-hidden="true"></div>

  <div className="flex items-center justify-center min-h-screen px-4">
    <Dialog.Panel className="bg-white w-full max-w-3xl p-8 rounded-2xl shadow-2xl relative z-10 transition-transform transform">
      <Dialog.Title className="text-2xl font-semibold text-[#011B4B] mb-6 border-b pb-2"> Evidencias Registradas</Dialog.Title>

      {evidenciasActividad.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-h-[60vh] overflow-y-auto pr-2">
          {evidenciasActividad.map((evidencia) => (
            <div key={evidencia.id} className="flex gap-4 bg-gray-50 border border-gray-200 rounded-xl shadow-sm p-4">
              <img
                src={`http://localhost:3000/uploads/${evidencia.evidencia_url}`}
                alt="Evidencia"
                className="h-24 w-24 object-cover rounded-lg border"
              />
              <div className="flex flex-col justify-center">
                <p className="text-base font-medium text-gray-800">{evidencia.cantidad_ingresada}</p>
                <p className="text-sm text-gray-500">📅 {new Date(evidencia.fecha_entrega).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center py-10">No se encontraron evidencias para esta actividad.</p>
      )}

      <div className="mt-8 flex justify-end">
        <button
          onClick={() => setModalVerEvidencias(false)}
          className="bg-[#011B4B] hover:bg-[#02286f] text-white px-6 py-2 rounded-lg transition-colors duration-200"
        >
          Cerrar
        </button>
      </div>
    </Dialog.Panel>
  </div>
</Dialog>


   <Dialog open={modalAbierto} onClose={cerrarModal} className="fixed z-50 inset-0 overflow-y-auto">
  {/* Fondo desenfocado y oscuro */}
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" aria-hidden="true"></div>

  {/* Contenedor del modal centrado */}
  <div className="flex items-center justify-center min-h-screen px-4">
    <Dialog.Panel className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-xl p-6 sm:p-8">
      
      {/* Título */}
      <Dialog.Title className="text-xl font-semibold text-gray-800 mb-6">
        Registrar Evidencia
      </Dialog.Title>

      {/* Campo: Cantidad */}
      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad (en kilos)</label>
        <input
          type="text"
          inputMode="numeric"
          value={cantidadNueva}
          onChange={(e) => {
            const valor = e.target.value.replace(/\D/g, '');
            setCantidadNueva(valor);
          }}
          className="w-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-md px-3 py-2 text-sm shadow-sm outline-none"
          placeholder="Ej: 5"
        />
        <p className="text-xs text-gray-400 mt-1">Solo números. Se enviará como "X KILOS"</p>
      </div>

      {/* Campo: Evidencia */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">Evidencia (imagen)</label>
        <input
          type="file"
          accept="image/*"
          capture="environment"
          onChange={(e) => setEvidencia(e.target.files[0])}
          className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
      </div>

      {/* Botones */}
      <div className="flex justify-end gap-2">
        <button
          onClick={cerrarModal}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-4 py-2 rounded-md transition"
        >
          Cancelar
        </button>
        <button
          onClick={handleSubmit}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-md transition shadow"
        >
          Registrar
        </button>
      </div>
    </Dialog.Panel>
  </div>
</Dialog>


    </div>
  );
};

export default ActividadSupervisor;
