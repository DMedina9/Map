import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Link } from "react-router-dom";

// Simulación de función para obtener informes desde sqlite3
// Reemplaza esto con tu lógica real de acceso a la base de datos
const fetchInformes = async () => {
    // Ejemplo de datos simulados
    return [
        { id: 1, mes: "Enero 2024", publicador: "Juan Pérez", horas: 10 },
        { id: 2, mes: "Febrero 2024", publicador: "Ana Gómez", horas: 8 },
        // ...más informes
    ];
};

const Informes = () => {
    const [informes, setInformes] = useState([]);

    useEffect(() => {
        const cargarInformes = async () => {
            const datos = await fetchInformes();
            setInformes(datos);
        };
        cargarInformes();
    }, []);

    return (
        <>
            <div className="max-w-2xl mx-auto p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Informes por Mes</h1>
                    <Link
                        to="/informes/nuevo"
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Agregar Informe
                    </Link>
                </div>
                <ul className="bg-white rounded shadow divide-y divide-gray-200">
                    {informes.map((informe) => (
                        <li key={informe.id} className="flex justify-between items-center p-4">
                            <div>
                                <span className="font-semibold">{informe.mes}</span> - {informe.publicador} ({informe.horas} horas)
                            </div>
                            <Link
                                to={`/informes/editar/${informe.id}`}
                                className="text-blue-600 hover:underline"
                            >
                                Editar
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
};

export default Informes;