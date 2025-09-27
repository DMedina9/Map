import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// Simulación de consulta a sqlite3 (reemplaza con tu lógica real)
const fetchReportesPorMes = async () => {
    // Aquí deberías consultar la base de datos sqlite3
    // Ejemplo de datos simulados:
    return [
        { id: 1, mes: "Enero 2024", resumen: "Reporte de Enero", enlace: "/reportes/1" },
        { id: 2, mes: "Febrero 2024", resumen: "Reporte de Febrero", enlace: "/reportes/2" },
        { id: 3, mes: "Marzo 2024", resumen: "Reporte de Marzo", enlace: "/reportes/3" },
    ];
};

const Reportes = () => {
    const [reportes, setReportes] = useState([]);

    useEffect(() => {
        const cargarReportes = async () => {
            const datos = await fetchReportesPorMes();
            setReportes(datos);
        };
        cargarReportes();
    }, []);

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Reportes por Mes</h1>
            <ul className="space-y-4">
                {reportes.map((reporte) => (
                    <li key={reporte.id} className="bg-white shadow rounded p-4 flex justify-between items-center">
                        <div>
                            <div className="font-semibold">{reporte.mes}</div>
                            <div className="text-gray-600">{reporte.resumen}</div>
                        </div>
                        <Link
                            to={reporte.enlace}
                            className="text-blue-600 hover:underline font-medium"
                        >
                            Ver reporte completo
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Reportes;