import HeaderEstudiante from './HeaderEstudiante';
import SidebarEstudiante from './SidebarEstudiante';
import { useState, useEffect } from 'react';

const LayoutEstudiante = ({ children }) => {
  const [mostrarSidebar, setMostrarSidebar] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMostrarSidebar(true);
      } else {
        setMostrarSidebar(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen w-full flex bg-gray-100 relative">
      {/* Sidebar visible */}
      {mostrarSidebar && (
        <div className={`z-40 ${window.innerWidth >= 768 ? '' : 'fixed inset-0'}`}>
          {window.innerWidth < 768 && (
            <div 
              className="absolute inset-0 bg-black bg-opacity-50"
              onClick={() => setMostrarSidebar(false)}
            />
          )}
          <div className={`${window.innerWidth < 768 ? 'relative z-50 w-[80%] max-w-xs' : ''}`}>
            <SidebarEstudiante 
              mostrarSidebar={true}
              onClose={() => setMostrarSidebar(false)} 
            />
          </div>
        </div>
      )}

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col">
        <HeaderEstudiante 
          onToggleSidebar={() => setMostrarSidebar(true)} 
          mostrarSidebar={mostrarSidebar} 
        />
        <main className="flex-1 overflow-x-auto md:overflow-x-visible">
          {children}
        </main>
      </div>
    </div>
  );
};

export default LayoutEstudiante;
