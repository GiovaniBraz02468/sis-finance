import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import "./App.css";
import NavBar from "./components/layout/NavBar";
import Login from "./components/paginas/Login";
import Dashboard from "./components/paginas/Dashboard";
import Movimentos from "./components/paginas/Movimentos";
import Cofres from "./components/paginas/Cofres";
import Patrimonio from "./components/paginas/Patrimonio";
import { AuthProvider, useAuth } from "./components/services/AuthContext";

function AppContent() {
  const location = useLocation(); // Obtém a URL atual
  const { user } = useAuth(); // Obtém o usuário autenticado

  return (
    <div>
      {/* Exibe a NavBar apenas se NÃO estiver na página de Login */}
      {location.pathname !== "/" && <NavBar />}

      <div className="container mt-4">
        <Routes>
          <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Login />} />
          <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/" />} />
          <Route path="/movimentos" element={user ? <Movimentos /> : <Navigate to="/" />} />
          <Route path="/cofres" element={user ? <Cofres /> : <Navigate to="/" />} />
          <Route path="/patrimonio" element={user ? <Patrimonio /> : <Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
