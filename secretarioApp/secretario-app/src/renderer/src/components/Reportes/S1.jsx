import React from "react";

export default function S1() {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-8">
        
        {/* Encabezado */}
        <h1 className="text-2xl font-bold text-center text-gray-800">
          PREDICACIÓN Y ASISTENCIA A LAS REUNIONES (S-1)
        </h1>
        <p className="text-center text-gray-600 mt-1">Agosto de 2025</p>
        <p className="text-center text-sm text-gray-500 mb-6">
          Introduzca el informe y haga clic en Enviar.
        </p>

        {/* Formulario estilo tabla */}
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300 rounded-lg text-sm">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="p-2 border border-gray-300 text-left">Concepto</th>
                <th className="p-2 border border-gray-300 text-center">Valor</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-2 border border-gray-300">Publicadores activos</td>
                <td className="p-2 border border-gray-300 text-center">
                  <input
                    type="number"
                    className="w-24 p-1 border rounded text-center"
                    defaultValue={0}
                  />
                </td>
              </tr>
              <tr>
                <td className="p-2 border border-gray-300">Estudios bíblicos</td>
                <td className="p-2 border border-gray-300 text-center">
                  <input
                    type="number"
                    className="w-24 p-1 border rounded text-center"
                    defaultValue={0}
                  />
                </td>
              </tr>
              <tr>
                <td className="p-2 border border-gray-300">Horas Totales</td>
                <td className="p-2 border border-gray-300 text-center">
                  <input
                    type="number"
                    className="w-24 p-1 border rounded text-center"
                    defaultValue={0}
                  />
                </td>
              </tr>
              <tr>
                <td className="p-2 border border-gray-300">Asistencia media a reuniones</td>
                <td className="p-2 border border-gray-300 text-center">
                  <input
                    type="number"
                    className="w-24 p-1 border rounded text-center"
                    defaultValue={0}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Botón */}
        <div className="mt-6 flex justify-center">
          <button className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-xl shadow hover:bg-blue-700 transition">
            Enviar Informe
          </button>
        </div>
      </div>
    </div>
  );
}
