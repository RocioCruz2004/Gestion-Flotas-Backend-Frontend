import { BrowserRouter as Router, Routes, Route, NavLink, Navigate, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { 
  Home, 
  Users, 
  Shield, 
  UserCheck, 
  Truck, 
  MapPin, 
  Link2, 
  ClipboardList, 
  AlertTriangle,
  LogOut,
  Menu,
  X
} from "lucide-react";
import logo from "./assets/INICIO LOGO.png";

import LoginPage from "./pages/LoginPage";
import UsuariosPage from "./pages/UsuariosPage";
import RolesPage from "./pages/RolesPage";
import ConductoresPage from "./pages/ConductoresPage";
import UnidadesPage from "./pages/UnidadesPage";
import RutasPage from "./pages/RutasPage";
import AsignacionesPage from "./pages/AsignacionesPage";
import IncidenciasPage from "./pages/IncidenciasPage";
import UnidadesConductoresPage from "./pages/UnidadesConductoresPage";
import HomePage from "./pages/Home";
import { isAuthenticated, getCurrentUser, logout } from "./services/authService";

// Componente para proteger rutas
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

// Componente del Layout Principal
function MainLayout() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const user = getCurrentUser();
    setUsuario(user);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const menuItems = [
    { path: "/", icon: Home, label: "Inicio" },
    { path: "/usuarios", icon: Users, label: "Usuarios" },
    { path: "/roles", icon: Shield, label: "Roles" },
    { path: "/conductores", icon: UserCheck, label: "Conductores" },
    { path: "/unidades", icon: Truck, label: "Unidades" },
    { path: "/rutas", icon: MapPin, label: "Rutas" },
    { path: "/unidadesconductores", icon: Link2, label: "Asignaciones U-C" },
    { path: "/asignaciones", icon: ClipboardList, label: "Asignaciones Rutas" },
    { path: "/incidencias", icon: AlertTriangle, label: "Incidencias" },
  ];

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#f9fafb' }}>
      {/* Sidebar */}
      <aside 
        style={{
          width: sidebarOpen ? '288px' : '80px',
          background: 'linear-gradient(180deg, #047857 0%, #065f46 100%)',
          color: 'white',
          transition: 'width 0.3s',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          position: 'relative'
        }}
      >
        {/* Header */}
        <div style={{ 
          padding: '1.5rem', 
          borderBottom: '1px solid rgba(16, 185, 129, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center',
            justifyContent: sidebarOpen ? 'flex-start' : 'center',
            flex: 1
          }}>
            <img 
              src={logo} 
              alt="Logo Transportes Doña Chio" 
              style={{ 
                height: sidebarOpen ? '200px' : '100px',
                width: 'auto',
                objectFit: 'contain',
                transition: 'height 0.3s ease-in-out'
              }}
            />
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              padding: '0.5rem',
              background: 'transparent',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(16, 185, 129, 0.2)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Navigation */}
        <nav style={{ 
          flex: 1, 
          padding: '1.5rem 0.75rem', 
          overflowY: 'auto' 
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  borderRadius: '0.75rem',
                  transition: 'all 0.2s',
                  textDecoration: 'none',
                  background: isActive ? 'white' : 'transparent',
                  color: isActive ? '#047857' : '#d1fae5',
                  fontWeight: '500',
                  fontSize: '0.875rem'
                })}
                onMouseEnter={(e) => {
                  if (!e.currentTarget.classList.contains('active')) {
                    e.currentTarget.style.background = 'rgba(16, 185, 129, 0.2)';
                    e.currentTarget.style.color = 'white';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!e.currentTarget.classList.contains('active')) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#d1fae5';
                  }
                }}
              >
                <item.icon style={{ width: '20px', height: '20px', flexShrink: 0 }} />
                {sidebarOpen && <span>{item.label}</span>}
              </NavLink>
            ))}
          </div>
        </nav>

        {/* User Info & Logout */}
        <div style={{ padding: '1rem', borderTop: '1px solid rgba(16, 185, 129, 0.3)' }}>
          {sidebarOpen ? (
            <>
              <div style={{ 
                background: 'rgba(16, 185, 129, 0.2)', 
                borderRadius: '0.75rem', 
                padding: '1rem',
                marginBottom: '0.75rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ 
                    width: '40px', 
                    height: '40px', 
                    background: 'white', 
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <span style={{ color: '#047857', fontWeight: 'bold', fontSize: '0.875rem' }}>
                      {usuario?.nombre?.charAt(0) || 'A'}
                    </span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ 
                      fontWeight: '600', 
                      fontSize: '0.875rem', 
                      margin: 0,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {usuario?.nombre || "Usuario"}
                    </p>
                    <p style={{ 
                      color: '#a7f3d0', 
                      fontSize: '0.75rem', 
                      margin: 0 
                    }}>
                      {usuario?.rolNombre || "Admin"}
                    </p>
                  </div>
                </div>
              </div>
              <button
                onClick={handleLogout}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1rem',
                  background: '#ef4444',
                  border: 'none',
                  borderRadius: '0.75rem',
                  color: 'white',
                  cursor: 'pointer',
                  fontWeight: '500',
                  fontSize: '0.875rem',
                  transition: 'background 0.2s',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#dc2626'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#ef4444'}
              >
                <LogOut size={16} />
                <span>Cerrar Sesión</span>
              </button>
            </>
          ) : (
            <button
              onClick={handleLogout}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0.75rem',
                background: '#ef4444',
                border: 'none',
                borderRadius: '0.75rem',
                color: 'white',
                cursor: 'pointer',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#dc2626'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#ef4444'}
              title="Cerrar Sesión"
            >
              <LogOut size={20} />
            </button>
          )}
        </div>
      </aside>

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <header>
        </header>

        <main style={{ flex: 1, overflowY: 'auto', padding: '2rem', background: '#f9fafb' }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/usuarios" element={<UsuariosPage />} />
            <Route path="/roles" element={<RolesPage />} />
            <Route path="/conductores" element={<ConductoresPage />} />
            <Route path="/unidades" element={<UnidadesPage />} />
            <Route path="/rutas" element={<RutasPage />} />
            <Route path="/asignaciones" element={<AsignacionesPage />} />
            <Route path="/incidencias" element={<IncidenciasPage />} />
            <Route path="/unidadesconductores" element={<UnidadesConductoresPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta pública de Login */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Rutas protegidas */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}