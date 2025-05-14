import { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:5000/auth/login', {
                email,
                password
            }, {
                withCredentials: true
            });

            console.log('Login exitoso:', response.data);

            localStorage.setItem('token', response.data.access_token);
            localStorage.setItem('email', response.data.email);

            Swal.fire({
                icon: 'success',
                title: '¡Bienvenido!',
                text: 'Inicio de sesión exitoso',
                confirmButtonColor: '#22c55e'
            }).then(() => {
                window.location.href = '/dashboard';
            });

        } catch (err) {
            console.error('Error al iniciar sesión:', err);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Credenciales incorrectas o error de conexión',
                confirmButtonColor: '#ef4444'
            });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form onSubmit={handleLogin} className="bg-white p-8 rounded-xl border-2 border-green-500 shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Iniciar Sesión</h2>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
                    <input
                        type="email"
                        required
                        className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-green-300"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="correo@ejemplo.com"
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700">Contraseña</label>
                    <input
                        type="password"
                        required
                        className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-green-300"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="••••••••"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition"
                >
                    Iniciar Sesión
                </button>
            </form>
        </div>
    );
}

export default Login;
