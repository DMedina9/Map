import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

// Componentes de ejemplo (puedes reemplazarlos por tus propios componentes)
import Publicadores from './Publicadores';
import Informes from './Informes';
import Asistencias from './Asistencias';
import Reportes from './Reportes';

const Menu = () => (
    <>
        <nav style={{ marginBottom: '20px' }}>
            <ul style={{ listStyle: 'none', display: 'flex', gap: '1rem', padding: 0 }}>
                <li>
                    <Link to="/publicadores">Publicadores</Link>
                </li>
                <li>
                    <Link to="/informes">Informes</Link>
                </li>
                <li>
                    <Link to="/asistencias">Asistencias</Link>
                </li>
                <li>
                    <Link to="/reportes">Reportes</Link>
                </li>
            </ul>
        </nav>
        <Routes>
            <Route path="/Publicadores" element={<Publicadores />} />
            <Route path="/informes" element={<Informes />} />
            <Route path="/asistencias" element={<Asistencias />} />
            <Route path="/reportes" element={<Reportes />} />
        </Routes>
    </>
);

export default Menu;