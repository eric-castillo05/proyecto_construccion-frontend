// src/App.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const cards = [
    { label: 'Generación de Alertas', icon: '🔔', route: '/notificaciones' },
    { label: 'Administración', icon: '⚙️', route: '/admin-usuarios' },
    { label: 'Capacitación', icon: '🎓', route: '/capacitacion' },
];

function App() {
    const navigate = useNavigate();
    const [notificaciones, setNotificaciones] = useState([]);
    const [error, setError] = useState(false);

    const fetchAlertas = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const decoded = jwtDecode(token);
            const userId = decoded.sub;

            const res = await axios.get(`http://127.0.0.1:5000/notificaciones/mis-notificaciones/${userId}`);
            setNotificaciones(res.data);
            setError(false);
        } catch (err) {
            setError(true);
        }
    };

    useEffect(() => {
        fetchAlertas();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <header className="bg-green-600 text-white flex justify-between items-center px-6 py-4 shadow">
                <h1 className="text-lg font-semibold">Sistema de Gestión de Riesgos en Obras de Construcción</h1>
                <button className="bg-white text-green-600 px-4 py-1 rounded hover:bg-gray-200 transition">Cerrar sesión</button>
            </header>

            {/* Card grid */}
            <main className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-6 max-w-5xl mx-auto">
                {cards.map(({ label, icon, route }) => (
                    <div
                        key={label}
                        onClick={() => navigate(route)}
                        className="cursor-pointer bg-white rounded-md border-t-4 border-green-500 shadow-sm p-6 flex flex-col items-center justify-center space-y-2 hover:shadow-md transition"
                    >
                        <div className="text-3xl">{icon}</div>
                        <h2 className="text-center font-semibold">{label}</h2>
                    </div>
                ))}
            </main>

            {/* Alertas Recientes */}
            <section className="max-w-4xl mx-auto mt-8 bg-white rounded-md p-6 shadow">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold">Alertas Recientes</h3>
                    <button
                        onClick={fetchAlertas}
                        className="bg-green-600 text-white text-sm px-3 py-1 rounded hover:bg-green-700 transition"
                    >
                        Actualizar
                    </button>
                </div>
                {error ? (
                    <p className="text-red-600 text-sm">
                        Error al cargar alertas. Intenta nuevamente.
                    </p>
                ) : notificaciones.length === 0 ? (
                    <p className="text-gray-500 text-sm">No hay alertas recientes.</p>
                ) : (
                    <ul className="space-y-2">
                        {notificaciones.map((n) => (
                            <li key={n.id} className="border p-3 rounded shadow-sm">
                                <p className="text-sm text-gray-600">Nivel: {n.nivel_riesgo}</p>
                                <p className="font-semibold">{n.descripcion}</p>
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </div>
    );
}

export default App;
