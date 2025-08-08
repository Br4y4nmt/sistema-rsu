import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from 'recharts';

const datosMensuales = [
  { mes: 'Ene', actividades: 12 },
  { mes: 'Feb', actividades: 18 },
  { mes: 'Mar', actividades: 24 },
  { mes: 'Abr', actividades: 10 },
  { mes: 'May', actividades: 32 },
  { mes: 'Jun', actividades: 20 },
];

const progresoEstudiantes = [
  { ciclo: 'VII', total: 10 },
  { ciclo: 'VIII', total: 30 },
  { ciclo: 'IX', total: 25 },
  { ciclo: 'X', total: 15 },
];

const cumplimiento = [
  { name: 'Cumplido', value: 75 },
  { name: 'Pendiente', value: 25 },
];

const colores = ['#0cbba7', '#facc15'];

const EstadisticasSupervisor = () => {
  const [cantidadEstudiantes, setCantidadEstudiantes] = useState(0);
  const [cantidadActividades, setCantidadActividades] = useState(0);
  const [totalResiduos, setTotalResiduos] = useState(0);
  const [mostrarModalResiduos, setMostrarModalResiduos] = useState(false);
  const [programasAcademicos, setProgramasAcademicos] = useState([]);
  const [residuosPorPrograma, setResiduosPorPrograma] = useState(null);


 useEffect(() => {
  const fetchProgramas = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/programas`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProgramasAcademicos(response.data);
    } catch (error) {
      console.error('❌ Error al obtener programas académicos:', error);
    }
  };

  if (mostrarModalResiduos) {
    fetchProgramas();
  }
}, [mostrarModalResiduos]);

    useEffect(() => {
    const fetchResiduos = async () => {
        try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/actividades/residuos/total`, {
            headers: {
            Authorization: `Bearer ${token}`,
            },
        });
        setTotalResiduos(response.data.total_kilos);
        } catch (error) {
        console.error('❌ Error al obtener total de residuos:', error);
        setTotalResiduos(0);
        }
    };

    fetchResiduos();
    }, []);
    useEffect(() => {
    const fetchActividades = async () => {
        try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/actividades`, {
            headers: {
            Authorization: `Bearer ${token}`,
            },
        });
        setCantidadActividades(response.data.length);
        } catch (error) {
        console.error('❌ Error al obtener actividades:', error);
        setCantidadActividades(0);
        }
    };

    fetchActividades();
    }, []);
  useEffect(() => {
    const fetchEstudiantes = async () => {
      try {
        const token = localStorage.getItem('token'); // Asegúrate de que el token esté bien guardado
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/estudiantes`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCantidadEstudiantes(response.data.length);
      } catch (error) {
        console.error('❌ Error al obtener estudiantes:', error);
        setCantidadEstudiantes(0);
      }
    };

    fetchEstudiantes();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard de Estadísticas</h1>

      {/* Tarjetas resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-5">
          <h3 className="text-gray-600 text-sm mb-1">Estudiantes Activos</h3>
          <p className="text-3xl font-bold text-[#011B4B]">{cantidadEstudiantes}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-5">
          <h3 className="text-gray-600 text-sm mb-1">Actividades Registradas</h3>
          <p className="text-3xl font-bold text-[#011B4B]">{cantidadActividades}</p>

        </div>
        <div
            onClick={() => setMostrarModalResiduos(true)}
            className="bg-white rounded-lg shadow p-5 cursor-pointer hover:bg-gray-50 transition"
            >
            <h3 className="text-gray-600 text-sm mb-1">Total de residuos ingresado</h3>
            <p className="text-3xl font-bold text-[#011B4B]">{totalResiduos} kg</p>
            </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Gráfico de barras */}
        <div className="bg-white rounded-xl shadow p-4 h-96">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Actividades por Mes</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={datosMensuales}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="actividades" fill="#0cbba7" barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico de línea */}
        <div className="bg-white rounded-xl shadow p-4 h-96">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Estudiantes por Ciclo</h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={progresoEstudiantes}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="ciclo" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="total" stroke="#48A6A7" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Gráfico circular */}
      <div className="mt-8 bg-white rounded-xl shadow p-6 max-w-md mx-auto">
        <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center">Estado de Cumplimiento</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={cumplimiento}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
              label
            >
              {cumplimiento.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colores[index % colores.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
     {mostrarModalResiduos && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl p-6 shadow-xl w-full max-w-md relative">
      <button
        onClick={() => {
          setMostrarModalResiduos(false);
          setResiduosPorPrograma(null); // limpiar filtro al cerrar
        }}
        className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-xl font-bold"
      >
        ×
      </button>

      <h2 className="text-2xl font-semibold text-[#011B4B] mb-4">Detalle de Residuos</h2>

      {/* Select de programa académico */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Filtrar por programa académico:</label>
        <select
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0cbba7]"
          defaultValue=""
          onChange={async (e) => {
            const idPrograma = e.target.value;
            try {
              const token = localStorage.getItem('token');
              const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/actividades/residuos/por-programa/${idPrograma}`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
              setResiduosPorPrograma(response.data.total_kilos);
            } catch (error) {
              console.error('❌ Error al obtener residuos por programa:', error);
              setResiduosPorPrograma(null);
            }
          }}
        >
          <option value="" disabled>Seleccione un programa</option>
          {programasAcademicos.map((programa) => (
            <option key={programa.id_programa} value={programa.id_programa}>
              {programa.nombre_programa}
            </option>
          ))}
        </select>
      </div>

      {/* Total dinámico */}
      <div className="mt-6 text-gray-700 text-base">
        <h3 className="text-lg font-semibold mb-2 text-[#011B4B]">TOTAL INGRESADO</h3>
        {residuosPorPrograma === null ? (
          <p>Se ha registrado un total de <strong>{totalResiduos} kilos</strong> de residuos ingresados por todos los estudiantes.</p>
        ) : (
          <p>Se ha registrado un total de <strong>{residuosPorPrograma} kilos</strong> para el programa académico seleccionado.</p>
        )}
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default EstadisticasSupervisor;
