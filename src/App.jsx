import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Dashborad from "./pages/dashborad.jsx";
import AdminUsuarios from "./components/AdminUsuarios.jsx";
import Notificaciones from "./components/Notificaciones.jsx";
import Capacitacion from "./components/Capacitacion.jsx";
import Signup from "./pages/Signup.jsx";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path='/dashboard' element={<Dashborad />}/>
                <Route path='/admin-usuarios' element={<AdminUsuarios />}/>
                <Route path='/notificaciones' element={<Notificaciones />}/>
                <Route path='/capacitacion' element={<Capacitacion />}/>


            </Routes>
        </Router>
    );
}

export default App;
