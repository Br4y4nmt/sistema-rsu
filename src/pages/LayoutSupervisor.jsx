import HeaderSupervisor from './HeaderSupervisor';
import SidebarSupervisor from './SidebarSupervisor';
import { useState } from 'react';

const LayoutSupervisor = ({ children }) => {
  const [mostrarSidebar, setMostrarSidebar] = useState(true);

  return (
    <div className="min-h-screen w-full flex bg-gray-100 overflow-x-hidden">
      <SidebarSupervisor
        mostrarSidebar={mostrarSidebar}
        onClose={() => setMostrarSidebar(false)}
      />
      <div className="flex-1 flex flex-col">
        <HeaderSupervisor
          onToggleSidebar={() => setMostrarSidebar(true)}
          mostrarSidebar={mostrarSidebar}
        />
        <main className="flex-1 overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
};

export default LayoutSupervisor;
