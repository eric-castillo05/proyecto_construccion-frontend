import { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { jwtDecode } from 'jwt-decode';

function CrearNotificacion() {
    const [nivelRiesgo, setNivelRiesgo] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [rol, setRol] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Obtener el ID del usuario actual desde el almacenamiento local o JWT
        const token = localStorage.getItem('token');
        const decoded = jwtDecode(token);  // Usar jwt-decode para decodificar el token
        const emisorId = decoded.sub;  // Asumimos que el 'sub' es el ID del usuario

        try {
            const response = await axios.post('http://127.0.0.1:5000/notificaciones/crear', {
                nivel_riesgo: nivelRiesgo,
                descripcion: descripcion,
                rol: rol,
                emisor_id: emisorId
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            Swal.fire({
                icon: 'success',
                title: '¡Notificación enviada!',
                text: 'La notificación ha sido creada y enviada a los usuarios con el rol especificado.',
                confirmButtonColor: '#22c55e'
            });

            // Limpiar el formulario
            setNivelRiesgo('');
            setDescripcion('');
            setRol('');
        } catch (error) {
            console.error('Error al crear la notificación:', error);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Hubo un problema al crear la notificación.',
                confirmButtonColor: '#ef4444'
            });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl border-2 border-green-500 shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Crear Notificación</h2>

                {/* Nivel de Riesgo */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Nivel de Riesgo</label>
                    <select
                        required
                        value={nivelRiesgo}
                        onChange={e => setNivelRiesgo(e.target.value)}
                        className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-green-300"
                    >
                        <option value="">Selecciona el nivel de riesgo</option>
                        <option value="Alto">Alto</option>
                        <option value="Medio">Medio</option>
                        <option value="Bajo">Bajo</option>
                    </select>
                </div>

                {/* Descripción */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Descripción</label>
                    <textarea
                        required
                        value={descripcion}
                        onChange={e => setDescripcion(e.target.value)}
                        className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-green-300"
                        placeholder="Describe la notificación"
                    />
                </div>

                {/* Rol de los usuarios */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Rol de los usuarios</label>
                    <select
                        required
                        value={rol}
                        onChange={e => setRol(e.target.value)}
                        className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-green-300"
                    >
                        <option value="">Selecciona el rol</option>
                         <option value="PERSONAL_OBRA">Personal de Obra</option>
                        <option value="SUPERVISOR_SEGURIDAD">Supervisor de Seguridad</option>
                        <option value="ADMIN">Administrador</option>
                        <option value="GERENTE_SEGURIDAD">Gerente de Seguridad</option>
                    </select>
                </div>

                <button
                    type="submit"
                    className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition"
                >
                    Crear Notificación
                </button>
            </form>
        </div>
    );
}

export default CrearNotificacion;
