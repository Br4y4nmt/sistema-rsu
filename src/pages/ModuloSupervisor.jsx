import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

const ModuloSupervisor = () => {

 const [mostrarModal, setMostrarModal] = useState(false);
 const [nombre, setNombre] = useState('');
 const [archivo, setArchivo] = useState(null);
 const [modulos, setModulos] = useState([]);
 const [modoEdicion, setModoEdicion] = useState(false);
 const [moduloSeleccionado, setModuloSeleccionado] = useState(null);

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!nombre.trim() || (!modoEdicion && !archivo)) {
    Swal.fire({
      icon: 'warning',
      title: 'Campos obligatorios',
      text: 'Debes completar el nombre y seleccionar un archivo PDF.',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    });
    return;
  }

  try {
    const token = localStorage.getItem('token');
    const url = modoEdicion
      ? `${import.meta.env.VITE_API_URL}/modulos/${moduloSeleccionado.id_modulo}`
      : `${import.meta.env.VITE_API_URL}/modulos`;
    const method = modoEdicion ? 'PUT' : 'POST';

    const formData = new FormData();
    formData.append('nombre', nombre);
    if (!modoEdicion && archivo) {
    formData.append('archivo', archivo);
    }


    const response = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        // ❌ No pongas 'Content-Type' aquí, fetch lo hace solo con FormData
      },
      body: formData,
    });

    if (response.ok) {
      await obtenerModulos();
      setMostrarModal(false);
      setNombre('');
      setArchivo(null);
      setModoEdicion(false);
      setModuloSeleccionado(null);

      Swal.fire({
        icon: 'success',
        title: modoEdicion ? '¡Módulo actualizado!' : '¡Módulo agregado!',
        text: modoEdicion
          ? 'El módulo fue actualizado correctamente.'
          : 'El módulo fue guardado correctamente.',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
    } else {
      const data = await response.json();
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: data?.msg || 'No se pudo guardar el módulo.',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
    }
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error de red',
      text: 'No se pudo conectar con el servidor.',
      confirmButtonColor: '#011B4B',
    });
    console.error('Error de red:', error);
  }
};




const obtenerModulos = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${import.meta.env.VITE_API_URL}/modulos`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      setModulos(data);
    } else {
      console.error('Error al obtener los módulos');
    }
  } catch (error) {
    console.error('Error de red al obtener los módulos:', error);
  }
};
const handleEliminar = async (id_modulo) => {
  const confirmacion = await Swal.fire({
    title: '¿Estás seguro?',
    text: 'Esta acción no se puede deshacer.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    buttonsStyling: false,
    customClass: {
      confirmButton:
        'bg-[#011B4B] text-white px-5 py-2 rounded-full text-sm font-medium shadow hover:bg-[#1b2c59] transition-all duration-200',
      cancelButton:
        'bg-[#dc2626] text-white px-5 py-2 rounded-full text-sm font-medium shadow hover:bg-[#b91c1c] transition-all duration-200',
    },
  });

  if (confirmacion.isConfirmed) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/modulos/${id_modulo}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        await obtenerModulos();
        Swal.fire({
          icon: 'success',
          title: 'Eliminado',
          text: 'El módulo fue eliminado correctamente.',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo eliminar el módulo.',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });
      }
    } catch (error) {
      console.error('Error al eliminar:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error de red',
        text: 'No se pudo conectar con el servidor.',
        confirmButtonColor: '#011B4B',
      });
    }
  }
};

const abrirModalEditar = (modulo) => {
  setModoEdicion(true);
  setModuloSeleccionado(modulo);
  setNombre(modulo.nombre);
  setArchivo(null); // no precargamos archivo
  setMostrarModal(true);
};


useEffect(() => {
  obtenerModulos();
}, []);

  return (
    <div className="w-full min-h-screen bg-gray-100 px-6 py-10">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-xl p-6">

        <div className="flex items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-[#011B4B]">Módulos</h1>
       <button
        onClick={() => setMostrarModal(true)}
        className="bg-[#011B4B] text-white px-3 py-1.5 text-sm rounded-md hover:bg-[#1b2c59] transition"
        >
        Agregar
        </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-transparent text-gray-900 text-left">
                <th
                className="px-4 py-3 text-sm text-gray-900 font-medium"
                style={{ fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif' }}
                >
                Nombre
                </th>
                <th
                className="px-4 py-3 text-sm text-gray-900 font-medium"
                style={{ fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif' }}
                >
                Documento
                </th>
                <th
                className="px-4 py-3 text-sm text-gray-900 font-medium"
                style={{ fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif' }}
                >
                Estado
                </th>
                 <th
                className="px-4 py-3 text-sm text-gray-900 font-medium"
                style={{ fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif' }}
                >
                Opciones
                </th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-800">
             {modulos.map((modulo) => (
            <tr key={modulo.id_modulo} className="border-b bg-gray-50">
                <td className="px-4 py-3">{modulo.nombre}</td>
               <td className="px-4 py-3">
                {modulo.archivo ? (
                       <a
                  href={`${import.meta.env.VITE_API_URL}/uploads/${modulo.archivo}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#e0ecf7] text-[#011B4B] text-sm font-medium rounded-md shadow-sm hover:bg-[#d3e3f2] transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Ver PDF
                </a>
                ) : (
                    'Sin archivo'
                )}
                </td>
                <td className="px-4 py-3">
                <span className="px-3 py-1 rounded-full bg-[#e0ecf7] text-[#011B4B] text-sm font-semibold">
                    {modulo.estado || 'Activo'}
                </span>
                </td>
                <td className="px-4 py-3 flex gap-2">
               <button
                onClick={() => abrirModalEditar(modulo)}
                className="bg-[#0ea5e9] hover:bg-[#0284c7] text-white p-2 rounded-md transition"
                >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z" />
                </svg>
                </button>
                <button
                onClick={() => handleEliminar(modulo.id_modulo)}
                className="bg-[#ef4444] hover:bg-[#dc2626] text-white p-2 rounded-md transition"
                >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <path d="M3 6h18" />
                    <path d="M8 6v14a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V6" />
                    <path d="M10 11v6" />
                    <path d="M14 11v6" />
                    <path d="M5 6l1-3h12l1 3" />
                </svg>
                </button>
                </td>
            </tr>
            ))}

            </tbody>
          </table>
        </div>
      </div>
      {mostrarModal && (
  <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
    <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
    <h2 className="text-xl font-bold text-[#011B4B] mb-4">
    {modoEdicion ? 'Editar Módulo' : 'Agregar Módulo'}
    </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm text-gray-600 mb-1">Nombre</label>
         <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#011B4B]"
            />
        </div>

        <div className="mb-4">
          <label className="block text-sm text-gray-600 mb-1">Link</label>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setArchivo(e.target.files[0])}
            disabled={modoEdicion} 
            className={`w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#011B4B] ${modoEdicion ? 'bg-gray-100 cursor-not-allowed' : ''}`}
            />
            {modoEdicion && moduloSeleccionado?.archivo && (
        <p className="text-sm text-gray-500 mt-1">
            Archivo actual:{' '}
             <a
                href={`${import.meta.env.VITE_API_URL}/uploads/${moduloSeleccionado.archivo}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
                >
            Ver PDF
            </a>
        </p>
        )}
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button
            type="button"
           onClick={() => {
        setMostrarModal(false);
        setNombre('');
        setArchivo(null);
        setModoEdicion(false);
        setModuloSeleccionado(null);
        }}
            className="px-4 py-2 text-sm text-gray-700 border rounded hover:bg-gray-100"
            >
            Cancelar
            </button>
         <button
        type="submit"
        className="px-4 py-2 text-sm text-white bg-[#011B4B] rounded hover:bg-[#1b2c59]"
        >
        {modoEdicion ? 'Actualizar' : 'Guardar'}
        </button>
        </div>
      </form>
    </div>
  </div>
)}
    </div>
  );
};

export default ModuloSupervisor;
