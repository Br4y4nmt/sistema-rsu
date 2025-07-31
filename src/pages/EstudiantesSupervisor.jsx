import React, { useEffect, useState } from 'react';

const EstudiantesSupervisor = () => {
  const [estudiantes, setEstudiantes] = useState([]);

  const obtenerEstudiantes = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/estudiantes`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setEstudiantes(data);
      } else {
        console.error('❌ Error al obtener estudiantes');
      }
    } catch (error) {
      console.error('❌ Error de red al obtener estudiantes:', error);
    }
  };

  useEffect(() => {
    obtenerEstudiantes();
  }, []);

  return (
    <div className="w-full min-h-screen bg-gray-100 px-6 py-10">
      <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-xl p-6">
        <div className="flex items-center gap-4 mb-6">
          <h1 className="text-2xl font-bold text-[#011B4B]">Estudiantes Registrados</h1>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-transparent text-gray-900 text-left">
                <th className="px-4 py-3 text-sm font-medium">N°</th>
                <th className="px-4 py-3 text-sm font-medium">Nombre</th>
                <th className="px-4 py-3 text-sm font-medium">DNI</th>
                <th className="px-4 py-3 text-sm font-medium">Correo</th>
                <th className="px-4 py-3 text-sm font-medium">Celular</th>
                <th className="px-4 py-3 text-sm font-medium">Programa Académico</th>
                <th className="px-4 py-3 text-sm font-medium">Facultad</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-800">
              {estudiantes.map((est, index) => (
                <tr key={est.id_estudiante} className="border-b bg-gray-50">
                  <td className="px-4 py-3">{index + 1}</td>
                  <td className="px-4 py-3">{est.nombre}</td>
                  <td className="px-4 py-3">{est.dni}</td>
                  <td className="px-4 py-3">{est.correo}</td>
                  <td className="px-4 py-3">{est.celular}</td>
                  <td className="px-4 py-3">{est.programa_academico}</td>
                  <td className="px-4 py-3">{est.facultad}</td>
                </tr>
              ))}
              {estudiantes.length === 0 && (
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
    </div>
  );
};

export default EstudiantesSupervisor;
