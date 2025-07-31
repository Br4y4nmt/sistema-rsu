import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

const ExamenSupervisor = () => {
  const [preguntas, setPreguntas] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [idPreguntaEditando, setIdPreguntaEditando] = useState(null);
  const [nuevaPregunta, setNuevaPregunta] = useState('');
  const [alternativas, setAlternativas] = useState([
    { texto: '', esCorrecta: false },
    { texto: '', esCorrecta: false },
    { texto: '', esCorrecta: false },
    { texto: '', esCorrecta: false },
  ]);

    const eliminarPregunta = async (id) => {
    const token = localStorage.getItem('token');

        const confirmacion = await Swal.fire({
        title: '¿Estás seguro?',
        text: 'Esta acción eliminará la pregunta y sus alternativas',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
        customClass: {
            confirmButton: 'bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 focus:outline-none',
            cancelButton: 'bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 ml-2',
            popup: 'p-6 rounded-xl',
            title: 'text-xl font-bold',
            htmlContainer: 'text-gray-700',
        },
        buttonsStyling: false, // Importante para que no se sobreescriban las clases de bootstrap por defecto
        });

    if (confirmacion.isConfirmed) {
        try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/examen/preguntas/${id}`, {
            method: 'DELETE',
            headers: {
            Authorization: `Bearer ${token}`
            }
        });

        if (response.ok) {
           Swal.fire({
            title: 'Eliminado',
            text: 'La pregunta ha sido eliminada',
            icon: 'success',
            timer: 1000, // 2 segundos
            showConfirmButton: false,
            customClass: {
                popup: 'p-6 rounded-xl',
                title: 'text-xl font-bold',
                htmlContainer: 'text-gray-700',
            },
            timerProgressBar: true, // (opcional) muestra barra de tiempo
            });
            obtenerPreguntas();
        } else {
            Swal.fire('Error', 'No se pudo eliminar la pregunta', 'error');
        }
        } catch (error) {
        console.error('❌ Error al eliminar la pregunta:', error);
        Swal.fire('Error', 'Ocurrió un error al eliminar', 'error');
        }
    }
    };
    const abrirModalEdicion = (pregunta) => {
    setModoEdicion(true);
    setIdPreguntaEditando(pregunta.id_pregunta);
    setNuevaPregunta(pregunta.titulo);
    setAlternativas(
        pregunta.alternativas.map((alt) => ({
        texto: alt.texto,
        esCorrecta: alt.es_correcta === true || alt.esCorrecta === true,
        }))
    );
    setModalAbierto(true);
    };

  const obtenerPreguntas = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/examen/preguntas`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setPreguntas(data);
      } else {
        console.error('❌ Error al obtener preguntas');
      }
    } catch (error) {
      console.error('❌ Error de red al obtener preguntas:', error);
    }
  };

  useEffect(() => {
    obtenerPreguntas();
  }, []);

  const abrirModal = () => {
    setModalAbierto(true);
    setNuevaPregunta('');
    setAlternativas([
      { texto: '', esCorrecta: false },
      { texto: '', esCorrecta: false },
      { texto: '', esCorrecta: false },
      { texto: '', esCorrecta: false },
    ]);
  };

const cerrarModal = () => {
  setModalAbierto(false);
  setModoEdicion(false);
  setIdPreguntaEditando(null);
};


 const handleAlternativaChange = (index, campo, valor) => {
  const nuevas = [...alternativas];

  if (campo === 'esCorrecta') {
    nuevas.forEach((alt, i) => {
      alt.esCorrecta = i === index;
    });
  } else {
    nuevas[index][campo] = valor;
  }

  setAlternativas(nuevas);
};

const guardarPregunta = async () => {
  const token = localStorage.getItem('token');
  const cuerpo = {
    titulo: nuevaPregunta,
    alternativas: alternativas.map((alt) => ({
      texto: alt.texto,
      es_correcta: Boolean(alt.esCorrecta)
    })),
  };

  try {
    const url = modoEdicion
      ? `${import.meta.env.VITE_API_URL}/examen/preguntas/${idPreguntaEditando}`
      : `${import.meta.env.VITE_API_URL}/examen/preguntas`;

    const method = modoEdicion ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(cuerpo),
    });

    if (response.ok) {
      Swal.fire({
        title: modoEdicion ? 'Pregunta actualizada' : 'Pregunta creada',
        icon: 'success',
        confirmButtonText: 'OK',
        customClass: {
          confirmButton: 'bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 focus:outline-none',
        },
      });
      cerrarModal();
      obtenerPreguntas();
    } else {
      Swal.fire({
        title: '❌ Error',
        text: 'No se pudo guardar la pregunta',
        icon: 'error',
        confirmButtonText: 'OK',
        customClass: {
          confirmButton: 'bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 focus:outline-none',
        },
      });
    }
  } catch (error) {
    console.error('❌ Error al guardar la pregunta:', error);
  }
};

  return (
    <div className="w-full min-h-screen bg-gray-100 px-6 py-10">
      <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-[#011B4B]">Preguntas del Examen</h1>
          <button
            onClick={abrirModal}
            className="bg-[#011B4B] text-white px-4 py-2 rounded hover:bg-[#02225e]"
          >
            Agregar
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-transparent text-gray-900 text-left">
                <th className="px-4 py-3 text-sm font-medium">N°</th>
                <th className="px-4 py-3 text-sm font-medium">Pregunta</th>
                <th className="px-4 py-3 text-sm font-medium">Alternativas</th>
                <th className="px-4 py-3 text-sm font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-800">
              {preguntas.map((pregunta, index) => (
                <tr key={pregunta.id} className="border-b bg-gray-50">
                  <td className="px-4 py-3 align-top">{index + 1}</td>
                  <td className="px-4 py-3 align-top">{pregunta.titulo}</td>
                  <td className="px-4 py-3">
                    <ul className="list-disc pl-5 space-y-1">
                      {pregunta.alternativas.map((alt, idx) => (
                        <li key={idx} className={alt.esCorrecta ? 'text-green-600 font-semibold' : ''}>
                          {alt.texto}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="px-4 py-3 align-top">
                    <div className="flex gap-2">
                      <button
                    className="text-blue-600 hover:underline"
                    onClick={() => abrirModalEdicion(pregunta)}
                    >
                    Editar
                    </button>
                      <button
                    className="text-red-600 hover:underline"
                    onClick={() => eliminarPregunta(pregunta.id_pregunta)}
                    >
                    Eliminar
                    </button>
                    </div>
                  </td>
                </tr>
              ))}
              {preguntas.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-gray-500">
                    No hay preguntas registradas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalAbierto && (
  <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl p-8 relative animate-fade-in">
      {/* Encabezado */}
      <h2 className="text-2xl font-bold text-[#011B4B] mb-6 border-b pb-2">
        {modoEdicion ? 'Editar Pregunta' : 'Nueva Pregunta'}
        </h2>
      {/* Campo de pregunta */}
      <label className="block mb-2 text-sm font-medium text-gray-700">Pregunta</label>
      <input
        type="text"
        value={nuevaPregunta}
        onChange={(e) => setNuevaPregunta(e.target.value)}
        placeholder="Escribe la pregunta"
        className="w-full px-4 py-2 mb-6 text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#011B4B] focus:border-transparent transition"
      />

      {/* Alternativas */}
      <div className="space-y-4">
        {alternativas.map((alt, index) => (
          <div key={index} className="flex items-center gap-3">
           <input
                type="radio"
                name="correcta"
                checked={alt.esCorrecta}
                onChange={() => handleAlternativaChange(index, 'esCorrecta')}
                />
            <input
              type="text"
              placeholder={`Alternativa ${index + 1}`}
              value={alt.texto}
              onChange={(e) => handleAlternativaChange(index, 'texto', e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#011B4B] transition"
            />
          </div>
        ))}
      </div>

      {/* Botones */}
      <div className="flex justify-end gap-3 mt-8">
        <button
          onClick={cerrarModal}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition font-medium"
        >
          Cancelar
        </button>
        <button
        onClick={guardarPregunta}
        className="px-4 py-2 bg-[#011B4B] text-white rounded-lg hover:bg-[#02225e] transition font-medium"
        >
        {modoEdicion ? 'Actualizar' : 'Guardar'}
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default ExamenSupervisor;
