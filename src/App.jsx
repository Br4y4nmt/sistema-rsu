import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Register'; 
import Login from './pages/Login';
import PrivateRoute from './components/PrivateRoute';
import Dashboard from './pages/Dashboard';
import DashboardEstudiante from './pages/DashboardEstudiante';
import AdminView from './pages/AdminView';
import PerfilAlumno from './pages/PerfilAlumno';
import VerModulos from './pages/VerModulos';
import ExamenEstudiante from './pages/ExamenEstudiante';
import ModuloSupervisor from './pages/ModuloSupervisor';
import EstudiantesSupervisor from './pages/EstudiantesSupervisor';
import ExamenSupervisor from './pages/ExamenSupervisor';
import ActividadSupervisor from './pages/ActividadSupervisor';
import LayoutEstudiante from './pages/LayoutEstudiante'; 
import LayoutSupervisor from './pages/LayoutSupervisor'; 
import EstadisticasSupervisor from './pages/EstadisticasSupervisor'; 
function App() {
  return (
    <Router>
      <Routes>
        {/* 🔁 Redirección desde "/" hacia "/login" */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Rutas públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Rutas privadas sin layout */}
        <Route path="/admin" element={<AdminView />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        {/* Rutas supervisor */}
        <Route
          path="/examen-supervisor"
          element={
            <PrivateRoute rolPermitido={2}>
              <LayoutSupervisor>
                <ExamenSupervisor />
              </LayoutSupervisor>
            </PrivateRoute>
          }
        />
        <Route
          path="/estudiantes-supervisor"
          element={
            <PrivateRoute rolPermitido={2}>
              <LayoutSupervisor>
                <EstudiantesSupervisor />
              </LayoutSupervisor>
            </PrivateRoute>
          }
        />
         <Route
          path="/examen-supervisor"
          element={
            <PrivateRoute rolPermitido={2}>
              <LayoutSupervisor>
                <ExamenSupervisor />
              </LayoutSupervisor>
            </PrivateRoute>
          }
        />
        <Route
          path="/estadisticas-supervisor"
          element={
            <PrivateRoute rolPermitido={2}>
              <LayoutSupervisor>
                <EstadisticasSupervisor />
              </LayoutSupervisor>
            </PrivateRoute>
          }
        />
        <Route
          path="/actividad-supervisor"
          element={
            <PrivateRoute rolPermitido={2}>
              <LayoutSupervisor>
                <ActividadSupervisor />
              </LayoutSupervisor>
            </PrivateRoute>
          }
        />
        <Route
          path="/modulo-supervisor"
          element={
            <PrivateRoute rolPermitido={2}>
              <LayoutSupervisor>
                <ModuloSupervisor />
              </LayoutSupervisor>
            </PrivateRoute>
          }
        />

        {/* Rutas estudiante */}
        <Route
          path="/dashboard-estudiante"
          element={
            <PrivateRoute rolPermitido={3}>
              <LayoutEstudiante>
                <DashboardEstudiante />
              </LayoutEstudiante>
            </PrivateRoute>
          }
        />
        <Route
          path="/examen-estudiante"
          element={
            <PrivateRoute rolPermitido={3}>
              <LayoutEstudiante>
                <ExamenEstudiante />
              </LayoutEstudiante>
            </PrivateRoute>
          }
        />
        <Route
          path="/perfil-alumno"
          element={
            <PrivateRoute rolPermitido={3}>
              <LayoutEstudiante>
                <PerfilAlumno />
              </LayoutEstudiante>
            </PrivateRoute>
          }
        />
        <Route
          path="/modulo-estudiante"
          element={
            <PrivateRoute rolPermitido={3}>
              <LayoutEstudiante>
                <VerModulos />
              </LayoutEstudiante>
            </PrivateRoute>
          }
        />
      </Routes>  
    </Router>
  );
}

export default App;
