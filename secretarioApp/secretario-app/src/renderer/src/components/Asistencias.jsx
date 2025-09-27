import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Link, Route, Routes, useNavigate } from "react-router-dom";

// Simulación de acceso a la base de datos sqlite3
// Reemplaza esto por tu lógica real de acceso a la base de datos
const fetchAsistencias = async () => {
    // Ejemplo de datos simulados
    return [
        {
            id: 1,
            fecha: "2024-06-01",
            tipo: "Entresemana",
            cantidad: 15,
        },
        {
            id: 2,
            fecha: "2024-06-02",
            tipo: "Fin de semana",
            cantidad: 25,
        },
    ];
};

function AsistenciasList() {
    const [asistencias, setAsistencias] = useState([]);

    useEffect(() => {
        const cargarDatos = async () => {
            const datos = await fetchAsistencias();
            setAsistencias(datos);
        };
        cargarDatos();
    }, []);

    return (
        <div className="max-w-2xl mx-auto p-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Asistencias</h1>
                <Link
                    to="/asistencias/nueva"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Agregar asistencia
                </Link>
            </div>
            <table className="w-full border rounded shadow">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="py-2 px-4 border">Fecha</th>
                        <th className="py-2 px-4 border">Tipo</th>
                        <th className="py-2 px-4 border">Cantidad</th>
                        <th className="py-2 px-4 border">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {asistencias.map((asistencia) => (
                        <tr key={asistencia.id} className="hover:bg-gray-50">
                            <td className="py-2 px-4 border">{asistencia.fecha}</td>
                            <td className="py-2 px-4 border">{asistencia.tipo}</td>
                            <td className="py-2 px-4 border">{asistencia.cantidad}</td>
                            <td className="py-2 px-4 border">
                                <Link
                                    to={`/asistencias/editar/${asistencia.id}`}
                                    className="text-blue-500 hover:underline"
                                >
                                    Editar
                                </Link>
                            </td>
                        </tr>
                    ))}
                    {asistencias.length === 0 && (
                        <tr>
                            <td colSpan={4} className="py-4 text-center text-gray-500">
                                No hay asistencias registradas.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

// Componentes de ejemplo para agregar y editar (puedes implementar la lógica real)
function NuevaAsistencia() {
    const navigate = useNavigate();
    return (
        <div className="max-w-md mx-auto p-4">
            <h2 className="text-xl font-bold mb-4">Agregar Asistencia</h2>
            {/* Formulario de ejemplo */}
            <button
                className="bg-gray-500 text-white px-4 py-2 rounded"
                onClick={() => navigate("/asistencias")}
            >
                Volver
            </button>
        </div>
    );
}

function EditarAsistencia() {
    const navigate = useNavigate();
    return (
        <div className="max-w-md mx-auto p-4">
            <h2 className="text-xl font-bold mb-4">Editar Asistencia</h2>
            {/* Formulario de ejemplo */}
            <button
                className="bg-gray-500 text-white px-4 py-2 rounded"
                onClick={() => navigate("/asistencias")}
            >
                Volver
            </button>
        </div>
    );
}

export default function Asistencias() {
    return (
        <>
            <Routes>
                <Route path="/asistencias" element={<AsistenciasList />} />
                <Route path="/asistencias/nueva" element={<NuevaAsistencia />} />
                <Route path="/asistencias/editar/:id" element={<EditarAsistencia />} />
                {/* Redirección por defecto */}
                <Route path="*" element={<AsistenciasList />} />
            </Routes>
        </>
    );
}