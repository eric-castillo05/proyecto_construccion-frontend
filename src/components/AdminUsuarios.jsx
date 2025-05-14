import { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const roles = ['PERSONAL_OBRA', 'SUPERVISOR_SEGURIDAD', 'ADMIN', 'GERENTE_SEGURIDAD'];

export default function AdminUsuarios() {
    const [usuarios, setUsuarios] = useState([]);
    const [nuevoUsuario, setNuevoUsuario] = useState({
        nombre: '',
        email: '',
        password: '',
        rol: 'PERSONAL_OBRA',
    });
    const [rolEdits, setRolEdits] = useState({}); // Guarda cambios temporales de rol por email

    useEffect(() => {
        fetchUsuarios();
    }, []);

    const fetchUsuarios = async () => {
        try {
            const res = await axios.get('http://127.0.0.1:5000/auth/get-all');
            setUsuarios(res.data);
        } catch {
            Swal.fire('Error', 'No se pudieron cargar los usuarios', 'error');
        }
    };

    const handleNuevoUsuario = async () => {
        const { nombre, email, password, rol } = nuevoUsuario;
        if (!nombre || !email || !password) {
            return Swal.fire('Campos incompletos', 'Todos los campos son obligatorios', 'warning');
        }

        try {
            await axios.post('http://127.0.0.1:5000/auth/signup', { nombre, email, password, rol });
            Swal.fire('Éxito', 'Usuario creado correctamente', 'success');
            setNuevoUsuario({ nombre: '', email: '', password: '', rol: 'PERSONAL_OBRA' });
            fetchUsuarios();
        } catch (err) {
            Swal.fire('Error', err.response?.data?.message || 'Error al crear el usuario', 'error');
        }
    };

    const handleRolChange = (email, nuevoRol) => {
        setRolEdits(prev => ({ ...prev, [email]: nuevoRol }));
    };

    const guardarRol = async (email) => {
        const nuevoRol = rolEdits[email];
        if (!nuevoRol) return;

        try {
            await axios.put('http://127.0.0.1:5000/auth/change-rol', { email, rol: nuevoRol });
            Swal.fire('Éxito', 'Rol actualizado correctamente', 'success');
            setRolEdits(prev => {
                const updated = { ...prev };
                delete updated[email];
                return updated;
            });
            fetchUsuarios();
        } catch (err) {
            Swal.fire('Error', err.response?.data?.message || 'Error al actualizar el rol', 'error');
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-8">
            {/* Crear Usuario */}
            <div className="bg-white p-6 rounded-md shadow border-t-4 border-green-600">
                <h2 className="text-xl font-semibold mb-4">Nuevo Usuario</h2>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-4">
                    <input
                        type="text"
                        placeholder="Nombre"
                        className="border rounded p-2 w-full"
                        value={nuevoUsuario.nombre}
                        onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, nombre: e.target.value })}
                    />
                    <input
                        type="email"
                        placeholder="Correo electrónico"
                        className="border rounded p-2 w-full"
                        value={nuevoUsuario.email}
                        onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, email: e.target.value })}
                    />
                    <input
                        type="password"
                        placeholder="Contraseña"
                        className="border rounded p-2 w-full"
                        value={nuevoUsuario.password}
                        onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, password: e.target.value })}
                    />
                    <select
                        className="border rounded p-2 w-full"
                        value={nuevoUsuario.rol}
                        onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, rol: e.target.value })}
                    >
                        {roles.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                </div>
                <button
                    onClick={handleNuevoUsuario}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                >
                    Crear Usuario
                </button>
            </div>

            {/* Usuarios Existentes */}
            <div className="bg-white p-6 rounded-md shadow border-t-4 border-green-600">
                <h2 className="text-xl font-semibold mb-4">Usuarios Existentes</h2>
                <div className="space-y-4">
                    {usuarios.map(u => (
                        <div key={u.email} className="flex flex-col sm:flex-row sm:items-center justify-between border p-3 rounded space-y-2 sm:space-y-0">
                            <div>
                                <p className="text-sm font-medium">{u.nombre} - {u.email}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <select
                                    value={rolEdits[u.email] || u.rol}  // Usar rol temporal (rolEdits) o rol original
                                    onChange={(e) => handleRolChange(u.email, e.target.value)} // Cambiar el rol temporal
                                    className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-green-300"
                                >
                                    {roles.map(r => (
                                        <option key={r} value={r}>{r}</option>
                                    ))}
                                </select>

                                <button
                                    onClick={() => guardarRol(u.email)}
                                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                                >
                                    Guardar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
