import React, { useEffect, useState } from 'react';

const VerModulos = () => {
  const [modulos, setModulos] = useState([]);

  useEffect(() => {
    const obtenerModulos = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${import.meta.env.VITE_API_URL}/modulos`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = await res.json();
        if (res.ok) {
          setModulos(data);
        } else {
          console.error('Error al obtener módulos:', data.message);
        }
      } catch (error) {
        console.error('Error al obtener módulos:', error.message);
      }
    };

    obtenerModulos();
  }, []);

  return (
    <div className="w-full min-h-screen bg-gray-100 px-6 py-10">
      <h2
        className="text-4xl font-bold text-[#011B4B] text-center mb-8"
        style={{ fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif' }}
      >
        Mis módulos
      </h2>

      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-xl p-6">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-300 text-gray-900 text-left">
                <th className="px-4 py-3">MÓDULO</th>
                <th className="px-4 py-3">FECHA INGRESO</th>
                <th className="px-4 py-3">ACCIÓN</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-800">
              {modulos.map((modulo, index) => (
                <tr key={modulo.id_modulo} className="border-b">
                  <td className="px-4 py-4 flex items-start gap-2">
                    <div className="w-5 h-5">
                      {/* Icono PDF */}
                       <svg
                      viewBox="0 0 512 512"
                      xmlns="http://www.w3.org/2000/svg"
                      style={{ width: '100%' }}
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
                    </div>
                    <span className="ml-2">Módulo: {modulo.nombre}</span>
                  </td>
                  <td className="px-4 py-4">{modulo.fecha_ingreso || '30/07/2025'}</td>
                  <td className="px-4 py-4">
                  <a
                  href={`${import.meta.env.VITE_API_URL}/uploads/${modulo.archivo}`}
                  target="_blank"
                  rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm rounded-xl border border-gray-400 hover:bg-gray-300/60 px-2 py-0.5"
                >
                  <svg
                    fill="#374151" // gris oscuro (puedes cambiarlo a otro como '#2EBAA1' o '#000')
                    width="16px"
                    height="16px"
                    viewBox="0 0 32 32"
                    xmlns="http://www.w3.org/2000/svg"
                    className="mr-1"
                  >
                    <path d="M0 16q0.064 0.128 0.16 0.352t0.48 0.928 0.832 1.344 1.248 1.536 1.664 1.696 2.144 1.568 2.624 1.344 3.136 0.896 3.712 0.352 3.712-0.352 3.168-0.928 2.592-1.312 2.144-1.6 1.664-1.632 1.248-1.6 0.832-1.312 0.48-0.928l0.16-0.352q-0.032-0.128-0.16-0.352t-0.48-0.896-0.832-1.344-1.248-1.568-1.664-1.664-2.144-1.568-2.624-1.344-3.136-0.896-3.712-0.352-3.712 0.352-3.168 0.896-2.592 1.344-2.144 1.568-1.664 1.664-1.248 1.568-0.832 1.344-0.48 0.928zM10.016 16q0-2.464 1.728-4.224t4.256-1.76 4.256 1.76 1.76 4.224-1.76 4.256-4.256 1.76-4.256-1.76-1.728-4.256zM12 16q0 1.664 1.184 2.848t2.816 1.152 2.816-1.152 1.184-2.848-1.184-2.816-2.816-1.184-2.816 1.184l2.816 2.816h-4z" />
                  </svg>
                  <span className="text-gray-800">Ver</span>
                </a>
                  </td>
                </tr>
              ))}
              {modulos.length === 0 && (
                <tr>
                  <td colSpan="3" className="text-center py-6 text-gray-500">
                    No hay módulos disponibles.
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

export default VerModulos;
