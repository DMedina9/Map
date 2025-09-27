import React from 'react';

const informesData = [
    {
        publicador: 'Juan Pérez',
        mes: 'Junio 2024',
        participo: true,
        horas: 12,
        notas: 'Participó en predicación especial.',
    },
    {
        publicador: 'Ana López',
        mes: 'Junio 2024',
        participo: false,
        horas: 0,
        notas: 'No pudo participar este mes.',
    },
    // Agrega más informes según sea necesario
];

const Informes = () => {
    return (
        <div>
            <h2>Informes por Publicador</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th style={{ border: '1px solid #ccc', padding: '8px' }}>Publicador</th>
                        <th style={{ border: '1px solid #ccc', padding: '8px' }}>Mes</th>
                        <th style={{ border: '1px solid #ccc', padding: '8px' }}>¿Participó?</th>
                        <th style={{ border: '1px solid #ccc', padding: '8px' }}>Horas</th>
                        <th style={{ border: '1px solid #ccc', padding: '8px' }}>Notas</th>
                    </tr>
                </thead>
                <tbody>
                    {informesData.map((informe, idx) => (
                        <tr key={idx}>
                            <td style={{ border: '1px solid #ccc', padding: '8px' }}>{informe.publicador}</td>
                            <td style={{ border: '1px solid #ccc', padding: '8px' }}>{informe.mes}</td>
                            <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                                {informe.participo ? 'Sí' : 'No'}
                            </td>
                            <td style={{ border: '1px solid #ccc', padding: '8px' }}>{informe.horas}</td>
                            <td style={{ border: '1px solid #ccc', padding: '8px' }}>{informe.notas}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Informes;