import React, { useEffect, useState } from 'react';

const EstudiantesSupervisor = () => {
  const [todosEstudiantes, setTodosEstudiantes] = useState([]);
  const [estudiantesFiltrados, setEstudiantesFiltrados] = useState([]);
  const [programasAcademicos, setProgramasAcademicos] = useState([]);
  const [filtroPrograma, setFiltroPrograma] = useState('');

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
        setTodosEstudiantes(data);
        setEstudiantesFiltrados(data); // Mostrar todos al inicio
      } else {
        console.error('❌ Error al obtener estudiantes');
      }
    } catch (error) {
      console.error('❌ Error de red al obtener estudiantes:', error);
    }
  };

  const obtenerProgramas = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/programas`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProgramasAcademicos(data);
      } else {
        console.error('❌ Error al obtener programas académicos');
      }
    } catch (error) {
      console.error('❌ Error de red al obtener programas:', error);
    }
  };

  useEffect(() => {
    obtenerEstudiantes();
    obtenerProgramas();
  }, []);

  useEffect(() => {
    if (filtroPrograma === '') {
      setEstudiantesFiltrados(todosEstudiantes);
    } else {
      const filtrados = todosEstudiantes.filter(
        (est) => est.programa_academico === filtroPrograma
      );
      setEstudiantesFiltrados(filtrados);
    }
  }, [filtroPrograma, todosEstudiantes]);

  return (
    <div className="w-full min-h-screen bg-gray-100 px-6 py-10">
      <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-xl p-6 overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 flex-wrap">
          <h1 className="text-2xl font-bold text-[#011B4B]">Estudiantes Registrados</h1>

          <div className="w-full md:w-72">
            <div className="min-w-[220px] w-full md:w-64">
            <select
              value={filtroPrograma}
              onChange={(e) => setFiltroPrograma(e.target.value)}
              className="w-full border border-teal-500 rounded-lg px-4 py-2 text-sm text-gray-800"
            >
              <option value="">Todos los programas</option>
              {programasAcademicos.map((programa) => (
                <option key={programa.id_programa} value={programa.nombre_programa}>
                  {programa.nombre_programa}
                </option>
              ))}
            </select>
          </div>
          </div>
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
              {estudiantesFiltrados.length > 0 ? (
                estudiantesFiltrados.map((est, index) => (
                  <tr key={est.id_estudiante} className="border-b bg-gray-50">
                    <td className="px-4 py-3">{index + 1}</td>
                    <td className="px-4 py-3">{est.nombre}</td>
                    <td className="px-4 py-3">{est.dni}</td>
                    <td className="px-4 py-3">{est.correo}</td>
                    <td className="px-4 py-3">{est.celular}</td>
                    <td className="px-4 py-3">{est.programa_academico}</td>
                    <td className="px-4 py-3">{est.facultad}</td>
                  </tr>
                ))
              ) : (
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
