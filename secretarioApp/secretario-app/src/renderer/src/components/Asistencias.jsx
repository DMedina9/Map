import React from "react";

// Ejemplo de datos de asistencias
const asistencias = [
    { fecha: "2024-06-01", tipo: "Entresemana", cantidad: 15 },
    { fecha: "2024-06-08", tipo: "Fin de Semana", cantidad: 22 },
    { fecha: "2024-06-15", tipo: "Entresemana", cantidad: 18 },
    { fecha: "2024-07-02", tipo: "Fin de Semana", cantidad: 20 },
    { fecha: "2024-07-09", tipo: "Entresemana", cantidad: 17 },
];

// Agrupa asistencias por mes
function agruparPorMes(asistencias) {
    return asistencias.reduce((acc, asistencia) => {
        const fecha = new Date(asistencia.fecha);
        const mes = fecha.toLocaleString("default", { month: "long", year: "numeric" });
        if (!acc[mes]) acc[mes] = [];
        acc[mes].push(asistencia);
        return acc;
    }, {});
}

const Asistencias = () => {
    const asistenciasPorMes = agruparPorMes(asistencias);

    return (
        <div>
            <h2>Registro de Asistencias</h2>
            {Object.entries(asistenciasPorMes).map(([mes, registros]) => (
                <div key={mes} style={{ marginBottom: "2rem" }}>
                    <h3>{mes}</h3>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr>
                                <th style={{ border: "1px solid #ccc", padding: "8px" }}>Fecha</th>
                                <th style={{ border: "1px solid #ccc", padding: "8px" }}>Tipo</th>
                                <th style={{ border: "1px solid #ccc", padding: "8px" }}>Cantidad</th>
                            </tr>
                        </thead>
                        <tbody>
                            {registros.map((asistencia, idx) => (
                                <tr key={idx}>
                                    <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                                        {new Date(asistencia.fecha).toLocaleDateString()}
                                    </td>
                                    <td style={{ border: "1px solid #ccc", padding: "8px" }}>{asistencia.tipo}</td>
                                    <td style={{ border: "1px solid #ccc", padding: "8px" }}>{asistencia.cantidad}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ))}
        </div>
    );
};

export default Asistencias;