import { useEffect, useState, useRef } from 'react';
import Swal from 'sweetalert2';
import generarCertificado from '../utils/generarCertificado';

const ExamenEstudiante = () => {
  const [preguntas, setPreguntas] = useState([]);
  const [respuestas, setRespuestas] = useState({});
  const [cargando, setCargando] = useState(true);
  const [resultadoExistente, setResultadoExistente] = useState(null);
  const [tiempoRestante, setTiempoRestante] = useState(20 * 60); 
  const [envioPermitido, setEnvioPermitido] = useState(true);
  const [certificadoSubido, setCertificadoSubido] = useState(false);
  const intervalRef = useRef(null);
  const [certificadoUrl, setCertificadoUrl] = useState(null);
  const [notaFinal, setNotaFinal] = useState(null);
  const alertaMostradaRef = useRef(false);

useEffect(() => {
  const obtenerCertificado = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${import.meta.env.VITE_API_URL}/certificados/mis-certificados`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();
    if (res.ok && data.length > 0) {
      const baseUrl = import.meta.env.VITE_API_URL.replace('/api', '');
      setCertificadoUrl(`${baseUrl}/${data[0].url_certificado}`);
    }
  };

  obtenerCertificado();
}, []);


  const obtenerNotaFinal = async () => {
    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/estudiantes/mi-nota`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();

      if (res.ok) {
        setNotaFinal(data.nota);
      } else {
        console.error('Error al obtener nota:', data.message);
      }
    } catch (error) {
      console.error('❌ Error al obtener la nota final:', error);
    }
  };
  useEffect(() => {
  const token = localStorage.getItem('token');

  const verificarExamen = async () => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/examen/examen/verificar-respondido`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();

    if (data.yaRespondio) {
      setResultadoExistente(data.resultado);
      obtenerNotaFinal();
      return;
    }

    const tiempoTotal = 20 * 60; // 20 minutos en segundos

    if (data.inicio_examen) {
      const inicio = new Date(data.inicio_examen).getTime();
      const ahora = new Date().getTime();
      const tiempoTranscurrido = Math.floor((ahora - inicio) / 1000);
      const restante = tiempoTotal - tiempoTranscurrido;

      if (restante <= 0) {
        setTiempoRestante(0);
        setEnvioPermitido(false);
        Swal.fire({
          icon: 'error',
          title: '⏰ Tiempo finalizado',
          text: 'El tiempo límite ha expirado. Ya no puedes enviar el examen.',
          confirmButtonText: 'Aceptar',
          customClass: {
            confirmButton: 'swal2-confirmar-visible'
          }
        });
        return;
      }

      setTiempoRestante(restante);

      // ⏳ Iniciar contador
      intervalRef.current = setInterval(() => {
        setTiempoRestante(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
            setEnvioPermitido(false);

            if (!alertaMostradaRef.current) {
              alertaMostradaRef.current = true;
              Swal.fire({
                icon: 'error',
                title: '⏰ Tiempo finalizado',
                text: 'El tiempo límite ha expirado. Ya no puedes enviar el examen.',
                confirmButtonText: 'Aceptar',
                customClass: {
                  confirmButton: 'swal2-confirmar-visible'
                }
              });
            }

            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // ✅ Obtener preguntas y restaurar respuestas
      const resPreguntas = await fetch(`${import.meta.env.VITE_API_URL}/examen/examen/preguntas`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const preguntasData = await resPreguntas.json();
      if (resPreguntas.ok) {
        setPreguntas(preguntasData);

        // 🔁 Restaurar respuestas guardadas
        const respuestasGuardadas = JSON.parse(localStorage.getItem('respuestasExamen'));
        if (respuestasGuardadas) {
          setRespuestas(respuestasGuardadas);
        }
      }

      return;
    }

    // 🟢 Primer ingreso: mostrar alerta y esperar confirmación
    const result = await Swal.fire({
      icon: 'warning',
      title: 'Tiempo limitado',
      html: `
        <b>Tienes 20 minutos</b> para completar el examen.<br>
        <b>Solo 2 intentos son permitidos.</b><br>
        ¡Buena suerte!
      `,
      confirmButtonText: 'Comenzar Examen',
      allowOutsideClick: false,
      allowEscapeKey: false,
      customClass: {
        popup: 'text-lg',
        confirmButton: 'swal2-confirmar-examen'
      }
    });

    if (result.isConfirmed) {
      // Inicia el examen solo si el usuario confirmó
      const resPreguntas = await fetch(`${import.meta.env.VITE_API_URL}/examen/examen/preguntas`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const preguntasData = await resPreguntas.json();

      if (resPreguntas.ok) {
        setPreguntas(preguntasData);
        setTiempoRestante(20 * 60);

        const respuestasGuardadas = JSON.parse(localStorage.getItem('respuestasExamen'));
        if (respuestasGuardadas) {
          setRespuestas(respuestasGuardadas);
        }

        intervalRef.current = setInterval(() => {
          setTiempoRestante(prev => {
            if (prev <= 1) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
              setEnvioPermitido(false);

              if (!alertaMostradaRef.current) {
                alertaMostradaRef.current = true;
                Swal.fire({
                  icon: 'error',
                  title: '⏰ Tiempo finalizado',
                  text: 'El tiempo límite ha expirado. Ya no puedes enviar el examen.',
                  confirmButtonText: 'Aceptar',
                  customClass: {
                    confirmButton: 'swal2-confirmar-visible'
                  }
                });
              }

              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    }

  } catch (error) {
    console.error('❌ Error al verificar acceso:', error.message);
  } finally {
    setCargando(false);
  }
};


  verificarExamen();
  return () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };
}, []);



const handleRespuesta = (idPregunta, idAlternativa) => {
  setRespuestas(prev => {
    const nuevas = {
      ...prev,
      [idPregunta]: idAlternativa
    };
    localStorage.setItem('respuestasExamen', JSON.stringify(nuevas)); 
    return nuevas;
  });
};

const enviarExamen = async () => {
  if (!envioPermitido) {
    Swal.fire({
      toast: true,
      position: 'bottom-end',
      icon: 'error',
      title: 'El tiempo ha expirado. Ya no puedes enviar el examen.',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      background: '#fff',
      color: '#333',
      iconColor: '#F27474'
    });
    return;
  }

  if (Object.keys(respuestas).length !== preguntas.length) {
    Swal.fire({
      toast: true,
      position: 'bottom-end',
      icon: 'error',
      title: 'Debes responder todas las preguntas antes de enviar.',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      background: '#fff',
      color: '#333',
      iconColor: '#F27474'
    });
    return;
  }

  const token = localStorage.getItem('token');

  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/examen/corregir`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ respuestas })
    });

    const data = await res.json();

    if (res.ok) {
      const { puntaje, total, porcentaje } = data;

      // ✅ Limpiar temporizador y respuestas almacenadas
      localStorage.removeItem('tiempoRestante');
      localStorage.removeItem('respuestasExamen');

      // ✅ Mostrar resultados
      Swal.fire({
        icon: 'success',
        title: 'Examen corregido',
        html: `<b>Puntaje:</b> ${puntaje}/${total} <br/><b>Porcentaje:</b> ${porcentaje}%`,
        confirmButtonText: 'Aceptar',
        customClass: {
          confirmButton: 'swal2-confirmar-visible'
        }
      }).then(() => {
        // ✅ Mostrar resumen de resultados
        setResultadoExistente({
          puntaje,
          total,
          porcentaje
        });
        obtenerNotaFinal();
      });

    } else {
      alert(`❌ Error: ${data.message}`);
    }
  } catch (error) {
    console.error('❌ Error al enviar examen:', error);
    alert('❌ Error al enviar examen. Inténtalo más tarde.');
  }
};

useEffect(() => {
  const verificarYGenerarCertificado = async () => {
    const token = localStorage.getItem('token');

    try {
      // Verificar existencia del certificado primero
      const res = await fetch(`${import.meta.env.VITE_API_URL}/certificados/mis-certificados`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();

      if (res.ok && data.length > 0) {
        setCertificadoSubido(true); // Ya existe
        return; // 👈 Salimos antes de intentar generar
      }

      // Generar solo si no existe y la nota es mayor a 10
      if (notaFinal > 10) {
        const nombre = localStorage.getItem('usuario_nombre') || '';
        const fecha = new Date().toLocaleDateString('es-PE');
        const pdfBlob = await generarCertificado({ nombre: String(nombre), nota: notaFinal, fecha });

        const formData = new FormData();
        formData.append('certificado', new File([pdfBlob], 'certificado.pdf'));

        const uploadRes = await fetch(`${import.meta.env.VITE_API_URL}/certificados/subir`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: formData
        });

        const uploadData = await uploadRes.json();

        if (uploadRes.ok) {
        console.log('✅ Certificado subido:', uploadData.certificado);
        setCertificadoSubido(true);

        const baseUrl = import.meta.env.VITE_API_URL.replace('/api', '');
        setCertificadoUrl(`${baseUrl}/${uploadData.certificado.url_certificado}`);
      } else {
        console.error('❌ Error al subir certificado:', uploadData.message);
      }
      }
    } catch (error) {
      console.error('❌ Error en verificación/generación de certificado:', error);
    }
  };

  if (notaFinal !== null && !certificadoSubido) {
    verificarYGenerarCertificado();
  }
}, [notaFinal, certificadoSubido]);




  if (cargando) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="text-center text-[#2EBAA1] text-lg animate-pulse" style={{ fontFamily: 'Segoe UI' }}>
          Cargando examen...
        </div>
      </div>
    );
  }
 if (resultadoExistente) {
 return (
<div className="max-w-2xl mx-auto mt-10 bg-white shadow-2xl rounded-3xl p-10 text-center border border-gray-100">
    <div className="flex justify-center items-center mb-6">
      <div className="bg-green-100 rounded-full p-4">
        <svg
          className="h-12 w-12 text-green-600"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
    </div>

    <h2 className="text-3xl font-extrabold text-gray-800 mb-2 tracking-tight">
      Examen Completado
    </h2>
    <p className="text-gray-600 text-base mb-6">
      Ya has rendido el examen de Responsabilidad Social Universitaria.
    </p>
    {notaFinal !== null && (
          <p className="text-xl font-semibold text-[#2EBAA1] mt-2 mb-4">
            Tu nota acumulada es: <span className="text-[#011B4B]">{notaFinal}</span>
          </p>
        )}
    <div className="bg-gray-50 rounded-xl p-6 shadow-inner text-gray-800 text-lg font-medium">
      <p className="mb-2">
        <span className="font-semibold text-gray-700">Puntaje:</span>{' '}
        {resultadoExistente.puntaje}/{resultadoExistente.total}
      </p>
      <p>
        <span className="font-semibold text-gray-700">Porcentaje:</span>{' '}
        {resultadoExistente.porcentaje}%
      </p>
    </div>
    {notaFinal > 10 && (
  <div className="bg-white rounded-2xl shadow-md border border-gray-200 mt-10 p-6 max-w-2xl mx-auto">
    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
      <svg
        className="h-6 w-6 text-green-500"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
      Certificado de Aprobación
    </h3>
    <div className="space-y-4">
      <div className="flex items-center justify-between bg-gray-50 border rounded-lg px-4 py-3">
        <div className="flex items-center gap-3">
          <svg
                      viewBox="0 0 512 512"
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6"
                    >
                      <path style={{ fill: "#E2E5E7" }} d="M128,0c-17.6,0-32,14.4-32,32v448c0,17.6,14.4,32,32,32h320c17.6,0,32-14.4,32-32V128L352,0H128z" />
                      <path style={{ fill: "#B0B7BD" }} d="M384,128h96L352,0v96C352,113.6,366.4,128,384,128z" />
                      <polygon style={{ fill: "#CAD1D8" }} points="480,224 384,128 480,128" />
                      <path style={{ fill: "#F15642" }} d="M416,416c0,8.8-7.2,16-16,16H48c-8.8,0-16-7.2-16-16V256c0-8.8,7.2-16,16-16h352c8.8,0,16,7.2,16,16V416z" />
                      <g>
                        <path style={{ fill: "#FFFFFF" }} d="M101.744,303.152c0-4.224,3.328-8.832,8.688-8.832h29.552c16.64,0,31.616,11.136,31.616,32.48
                            c0,20.224-14.976,31.488-31.616,31.488h-21.36v16.896c0,5.632-3.584,8.816-8.192,8.816c-4.224,0-8.688-3.184-8.688-8.816V303.152z
                            M118.624,310.432v31.872h21.36c8.576,0,15.36-7.568,15.36-15.504c0-8.944-6.784-16.368-15.36-16.368H118.624z" />
                        <path style={{ fill: "#FFFFFF" }} d="M196.656,384c-4.224,0-8.832-2.304-8.832-7.92v-72.672c0-4.592,4.608-7.936,8.832-7.936h29.296
                            c58.464,0,57.184,88.528,1.152,88.528H196.656z M204.72,311.088V368.4h21.232c34.544,0,36.08-57.312,0-57.312H204.72z" />
                        <path style={{ fill: "#FFFFFF" }} d="M303.872,312.112v20.336h32.624c4.608,0,9.216,4.608,9.216,9.072c0,4.224-4.608,7.68-9.216,7.68
                            h-32.624v26.864c0,4.48-3.184,7.92-7.664,7.92c-5.632,0-9.072-3.44-9.072-7.92v-72.672c0-4.592,3.456-7.936,9.072-7.936h44.912
                            c5.632,0,8.96,3.344,8.96,7.936c0,4.096-3.328,8.704-8.96,8.704h-37.248V312.112z" />
                      </g>
                      <path style={{ fill: "#CAD1D8" }} d="M400,432H96v16h304c8.8,0,16-7.2,16-16v-16C416,424.8,408.8,432,400,432z" />
          </svg>
          <span className="text-gray-700 text-sm font-medium">
            CERTIFICADO GENERADO
          </span>
        </div>
        <div className="flex gap-2 items-center">
          {certificadoUrl && (
              <a
                href={certificadoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sm text-gray-700 border px-2 py-1 rounded hover:bg-gray-100"
              >
                <svg
                  fill="#374151"
                  width="16px"
                  height="16px"
                  viewBox="0 0 32 32"
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-1"
                >
                  <path d="M0 16q0.064 0.128 0.16 0.352t0.48 0.928 0.832 1.344 1.248 1.536 1.664 1.696 2.144 1.568 2.624 1.344 3.136 0.896 3.712 0.352 3.712-0.352 3.168-0.928 2.592-1.312 2.144-1.6 1.664-1.632 1.248-1.6 0.832-1.312 0.48-0.928l0.16-0.352q-0.032-0.128-0.16-0.352t-0.48-0.896-0.832-1.344-1.248-1.568-1.664-1.664-2.144-1.568-2.624-1.344-3.136-0.896-3.712-0.352-3.712 0.352-3.168 0.896-2.592 1.344-2.144 1.568-1.664 1.664-1.248 1.568-0.832 1.344-0.48 0.928zM10.016 16q0-2.464 1.728-4.224t4.256-1.76 4.256 1.76 1.76 4.224-1.76 4.256-4.256 1.76-4.256-1.76-1.728-4.256zM12 16q0 1.664 1.184 2.848t2.816 1.152 2.816-1.152 1.184-2.848-1.184-2.816-2.816-1.184-2.816 1.184l2.816 2.816h-4z" />
                </svg>
                Ver
              </a>
            )}
        </div>
      </div>
    </div>
  </div>
)}
  </div>

);

  }
  return (
    <div className="max-w-4xl mx-auto mt-10 p-10 bg-white shadow-2xl rounded-3xl border border-gray-200"
      style={{ fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif' }}
    >
      <h2 className="text-4xl font-bold text-center text-[#011B4B] mb-8 tracking-tight">
        Examen Final <span className="block text-lg font-normal text-gray-500 mt-1">Responsabilidad Social Universitaria</span>
      </h2>
     <div className="text-right text-sm font-medium text-gray-600 mb-4">
      Tiempo restante:{' '}
      <span className="text-red-500">
        {Math.floor(tiempoRestante / 60)}:{('0' + (tiempoRestante % 60)).slice(-2)} min
      </span>
    </div>
      <div className="divide-y divide-gray-200">
        {preguntas.map((pregunta, index) => (
          <div key={pregunta.id_pregunta} className="py-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {index + 1}. {pregunta.titulo}
            </h3>
            <div className="grid gap-3">
              {pregunta.alternativas.map((alt) => (
                <label
                  key={alt.id_alternativa}
                  className={`flex items-start gap-3 p-3 rounded-lg border ${
                    respuestas[pregunta.id_pregunta] === alt.id_alternativa
                      ? 'bg-[#E6F8F5] border-[#2EBAA1]'
                      : 'border-gray-300 hover:border-[#2EBAA1]'
                  } cursor-pointer transition-all`}
                >
                  <input
                    type="radio"
                    name={`pregunta-${pregunta.id_pregunta}`}
                    value={alt.id_alternativa}
                    onChange={() => handleRespuesta(pregunta.id_pregunta, alt.id_alternativa)}
                    checked={respuestas[pregunta.id_pregunta] === alt.id_alternativa}
                    className="accent-[#2EBAA1] mt-1"
                  />
                  <span className="text-gray-700">{alt.texto}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-12">
        <button
          onClick={enviarExamen}
          className="bg-[#2EBAA1] hover:bg-[#26A78D] text-white font-semibold text-base px-8 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
        >
          Enviar Examen
        </button>
      </div>
    </div>
  );
};

export default ExamenEstudiante;
