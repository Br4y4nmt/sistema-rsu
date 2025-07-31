import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

const PerfilAlumno = () => {
  const [estudiante, setEstudiante] = useState(null);
  const [celular, setCelular] = useState("");
  const [celularOriginal, setCelularOriginal] = useState("");

  useEffect(() => {
  const fetchPerfilEstudiante = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/estudiantes/perfil`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setEstudiante(response.data);
      setCelular(response.data.celular || "");
      setCelularOriginal(response.data.celular || "");
    } catch (error) {}
  };
  fetchPerfilEstudiante();
}, []);

const [mensajeSinCambio, setMensajeSinCambio] = useState("");

const handleGuardarCambios = async () => {
  setMensajeSinCambio("");
  const token = localStorage.getItem("token");

  if (!token) {
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'error',
      title: 'Token no encontrado.',
      showConfirmButton: false,
      timer: 2500,
      timerProgressBar: true,
    });
    return;
  }
  if (celular.length !== 9) {
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'warning',
      title: 'El número de celular debe tener exactamente 9 dígitos.',
      showConfirmButton: false,
      timer: 2500,
      timerProgressBar: true,
    });
    return;
  }
  if (celular === celularOriginal) {
    setMensajeSinCambio("No se realizó ningún cambio en el número de celular.");
    return;
  }
  try {
    await axios.put(
      `${import.meta.env.VITE_API_URL}/estudiantes/actualizar-celular`,
      { celular },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: 'Número de celular actualizado correctamente.',
      showConfirmButton: false,
      timer: 2500,
      timerProgressBar: true,
    });
    setCelularOriginal(celular);
  } catch (error) {
    console.error("❌ Error al actualizar celular:", error);
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'error',
      title: '❌ Ocurrió un error al guardar los cambios.',
      showConfirmButton: false,
      timer: 2500,
      timerProgressBar: true,
    });
  }
};
    if (!estudiante) {
    return (
        <p className="text-gray-600 px-6 py-10">
        Cargando datos del estudiante...
        </p>
    );
    }
  const partesNombre = estudiante.nombre_estudiante?.trim().split(" ") || [];
  const apellidoMaterno = partesNombre.pop() || "";
  const apellidoPaterno = partesNombre.pop() || "";
  const nombres = partesNombre.join(" ");

return (
 <main className="flex-grow w-full py-10 px-6 overflow-x-hidden">
 <div className="w-full max-w-6xl mx-auto px-4">
    <div
      className="bg-white rounded-xl shadow-lg w-full px-4 py-8"
    >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Campo label="Nombres" valor={nombres} />
          <Campo label="Apellido Paterno" valor={apellidoPaterno} />
          <Campo label="Apellido Materno" valor={apellidoMaterno} />
          <Campo label="DNI" valor={estudiante.dni} />
          <Campo label="Facultad" valor={estudiante.facultad?.nombre_facultad || ""} />
          <Campo label="Programa Académico" valor={estudiante.programa?.nombre_programa || ""} />
          <Campo label="Código" valor={estudiante.codigo} />
          <Campo label="Correo Institucional" valor={estudiante.email} />
          <Campo label="Sede" valor={estudiante.sede || "—"} />

          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Número Celular <span className="text-red-500">*</span>
            </label>
        <input
            type="text"
            value={celular}
            onChange={e => {
                const valor = e.target.value.replace(/\D/g, '').slice(0, 9);
                setCelular(valor);
            }}
            className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-gray-700 font-normal"
            />
            <span className="text-xs text-gray-500">
              Puedes modificar este campo
            </span>
            {celular.length > 0 && celular.length < 9 && (
            <span className="text-xs text-red-500 block mt-1">
                El número debe tener exactamente 9 dígitos.
            </span>
            )}
            {mensajeSinCambio && (
            <span className="flex items-center gap-2 text-xs mt-2 px-3 py-2 rounded-md bg-orange-50 border border-orange-300 text-orange-700 font-semibold shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" />
                </svg>
                {mensajeSinCambio}
            </span>
            )}
          </div>
        </div>
<div className="mt-6 flex flex-col md:flex-row items-center justify-center md:justify-between gap-6 text-center">
    <div
        className="border border-[#F87171] rounded-xl px-4 py-2 bg-white w-fit animate-bounce"
        style={{
        fontStyle: "italic",
        fontSize: "15px",
        fontWeight: 400,
        fontFamily: "system-ui, sans-serif",
        color: "#EF4444",
        }}
    >
        <span>
        <strong style={{ fontWeight: 700, fontStyle: "italic", color: "#B91C1C" }}>
            ¡Importante!
        </strong>{" "}
        <span style={{ fontStyle: "italic", color: "#bc2b2b" }}>
            Mantén tu número celular actualizado para recibir notificaciones.
        </span>
        </span>
    </div>
        <button
        type="button"
        className="w-60 py-2 rounded-md font-semibold text-white transition-colors"
        style={{ backgroundColor: "#39B49E" }}
        onClick={handleGuardarCambios}
        onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor = "#011B4B")
        }
        onMouseOut={(e) =>
            (e.currentTarget.style.backgroundColor = "#39B49E")
        }
        >
        Guardar Cambios
        </button>
        </div>
      </div>
      </div>
    </main>
  );
};

    const Campo = ({ label, valor }) => (
    <div>
        <label className="block text-gray-700 font-semibold mb-1">{label}</label>
        <input
            type="text"
            value={valor}
            disabled
            className="w-full bg-[#F1F5F9] rounded-md px-3 py-2 text-gray-500 font-normal"
            />
    </div>
    );


export default PerfilAlumno;