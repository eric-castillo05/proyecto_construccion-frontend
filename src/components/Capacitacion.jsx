import { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

export default function Capacitacion() {
    const token = localStorage.getItem('token');

    const [usuarios, setUsuarios] = useState([]);
    const [cursos, setCursos] = useState([]);

    const [formRegistro, setFormRegistro] = useState({
        usuario_email: '',
        curso_id: '',
    });

    const [formPuntaje, setFormPuntaje] = useState({
        usuario_email: '',
        curso_id: '',
        puntaje: '',
    });

    useEffect(() => {
        fetchUsuarios();
        fetchCursos();
    }, []);

    const fetchUsuarios = async () => {
        const res = await axios.get('http://127.0.0.1:5000/auth/get-all');
        setUsuarios(res.data);
    };

    const fetchCursos = async () => {
        try {
            const res = await axios.get('http://127.0.0.1:5000/curso-tomado/all', {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                withCredentials: true
            });
            setCursos(res.data);
        } catch (err) {
            Swal.fire('Error', 'No se pudieron cargar los cursos', 'error');
        }
    };



    const registrarCursoTomado = async () => {
        try {
            await axios.post('http://127.0.0.1:5000/curso-tomado/registrar', formRegistro, {
                headers: { Authorization: `Bearer ${token}` },
            });
            Swal.fire('Éxito', 'Curso registrado correctamente', 'success');
            setFormRegistro({ usuario_email: '', curso_id: '' });
        } catch (err) {
            Swal.fire('Error', err.response?.data?.error || 'Error al registrar curso', 'error');
        }
    };

    const registrarPuntaje = async () => {
        try {
            await axios.post('http://127.0.0.1:5000/curso-tomado/puntaje', formPuntaje, {
                headers: { Authorization: `Bearer ${token}` },
            });
            Swal.fire('Éxito', 'Puntaje registrado correctamente', 'success');
            setFormPuntaje({ usuario_email: '', curso_id: '', puntaje: '' });
        } catch (err) {
            Swal.fire('Error', err.response?.data?.error || 'Error al registrar puntaje', 'error');
        }
    };

    return (
        <div className="p-6 max-w-3xl mx-auto space-y-10">
            {/* Formulario para registrar curso tomado */}
            <div className="bg-white p-6 rounded-md shadow border-t-4 border-blue-600">
                <h2 className="text-xl font-semibold mb-4">Registrar Curso Tomado</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <select
                        value={formRegistro.usuario_email}
                        onChange={(e) => setFormRegistro({ ...formRegistro, usuario_email: e.target.value })}
                        className="border rounded p-2"
                    >
                        <option value="">Selecciona un usuario</option>
                        {usuarios.map(u => (
                            <option key={u.email} value={u.email}>{u.nombre} ({u.email})</option>
                        ))}
                    </select>

                    <select
                        value={formRegistro.curso_id}
                        onChange={(e) => setFormRegistro({ ...formRegistro, curso_id: e.target.value })}
                        className="border rounded p-2"
                    >
                        <option value="">Selecciona un curso</option>
                        {cursos.map(c => (
                            <option key={c.id} value={c.id}>{c.nombre}</option>
                        ))}
                    </select>
                </div>
                <button
                    onClick={registrarCursoTomado}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Registrar Curso
                </button>
            </div>

            {/* Formulario para asignar puntaje */}
            <div className="bg-white p-6 rounded-md shadow border-t-4 border-green-600">
                <h2 className="text-xl font-semibold mb-4">Registrar Puntaje de Curso</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                    <select
                        value={formPuntaje.usuario_email}
                        onChange={(e) => setFormPuntaje({ ...formPuntaje, usuario_email: e.target.value })}
                        className="border rounded p-2"
                    >
                        <option value="">Selecciona un usuario</option>
                        {usuarios.map(u => (
                            <option key={u.email} value={u.email}>{u.nombre} ({u.email})</option>
                        ))}
                    </select>

                    <select
                        value={formPuntaje.curso_id}
                        onChange={(e) => setFormPuntaje({ ...formPuntaje, curso_id: e.target.value })}
                        className="border rounded p-2"
                    >
                        <option value="">Selecciona un curso</option>
                        {cursos.map(c => (
                            <option key={c.id} value={c.id}>{c.nombre}</option>
                        ))}
                    </select>

                    <input
                        type="number"
                        placeholder="Puntaje"
                        className="border rounded p-2"
                        value={formPuntaje.puntaje}
                        onChange={(e) => setFormPuntaje({ ...formPuntaje, puntaje: e.target.value })}
                    />
                </div>
                <button
                    onClick={registrarPuntaje}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                    Registrar Puntaje
                </button>
            </div>
        </div>
    );
}
