import React from "react";
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

const reportesPorMes = [
    { mes: "Enero 2024", id: "2024-01" },
    { mes: "Febrero 2024", id: "2024-02" },
    { mes: "Marzo 2024", id: "2024-03" },
    { mes: "Abril 2024", id: "2024-04" },
    { mes: "Mayo 2024", id: "2024-05" },
    { mes: "Junio 2024", id: "2024-06" },
    // Agrega más meses según sea necesario
];

const Reportes = () => {
    return (
        <div>
            <h2>Reportes por Mes</h2>
            <ul>
                {reportesPorMes.map((reporte) => (
                    <li key={reporte.id}>
                        {reporte.mes}{" "}
                        <Link to={`/reporte/${reporte.id}`}>Ver reporte</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Reportes;