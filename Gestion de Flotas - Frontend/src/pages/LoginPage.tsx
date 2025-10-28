import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { login } from "../services/authService";
import Logo from "../assets/INICIO LOGO.PNG"; // Importamos el logo

export default function LoginPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    contrasena: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.contrasena) {
      Swal.fire({
        icon: "warning",
        title: "Campos incompletos",
        text: "Por favor ingresa tu correo y contraseña",
        confirmButtonColor: "#278900"
      });
      return;
    }

    setLoading(true);

    try {
      const response = await login(formData.email, formData.contrasena);

      if (!response || !response.usuario) {
        throw new Error("Respuesta del servidor inválida");
      }

      localStorage.setItem("token", response.token || "authenticated");
      localStorage.setItem("usuario", JSON.stringify(response.usuario));

      await Swal.fire({
        icon: "success",
        title: "¡Bienvenido!",
        text: `Hola ${response.usuario.nombre || 'Administrador'}`,
        timer: 1500,
        showConfirmButton: false
      });

      navigate("/", { replace: true });
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Error de autenticación",
        text: error.message || "Credenciales inválidas o no tienes permisos de administrador",
        confirmButtonColor: "#278900"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id === "password" ? "contrasena" : id]: value
    }));
  };

  return (
    <div style={styles.container}>
      <div style={styles.background}>
        <div style={styles.shape1}></div>
        <div style={styles.shape2}></div>
        <div style={styles.shape3}></div>
      </div>

      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.logoContainer}>
            <img 
              src={Logo} 
              alt="Transportes Doña Chio" 
              style={styles.logoImage}
            />
          </div>

        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="email">
              Correo Electrónico
            </label>
            <input
              id="email"
              type="email"
              placeholder="admin123@gmail.com"
              value={formData.email}
              onChange={handleChange}
              style={styles.input}
              className="input-focus"
              disabled={loading}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="password">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={formData.contrasena}
              onChange={handleChange}
              style={styles.input}
              className="input-focus"
              disabled={loading}
              required
            />
          </div>

          <button
            type="submit"
            style={loading ? styles.buttonDisabled : styles.button}
            className="btn-animated"
            disabled={loading}
          >
            {loading ? (
              <>
                <div style={styles.spinner}></div>
                Verificando...
              </>
            ) : (
              "Iniciar Sesión"
            )}
          </button>
        </form>

        <div style={styles.footer}>
          <p style={styles.footerText}>
            <svg style={styles.shieldIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Solo usuarios administradores pueden acceder
          </p>
        </div>
      </div>

      <div style={styles.credits}>
        <p>Sistema de Monitoreo de Flota Seguidores de Chio © 2025</p>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .fade-in {
          animation: fadeIn 0.8s ease-out;
        }

        .input-focus {
          transition: all 0.3s ease;
        }

        .input-focus:focus {
          border-color: #278900;
          box-shadow: 0 0 0 3px rgba(39, 137, 0, 0.2);
        }

        .btn-animated {
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .btn-animated::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.3);
          transform: translate(-50%, -50%);
          transition: width 0.6s, height 0.6s;
        }

        .btn-animated:hover::before {
          width: 300px;
          height: 300px;
        }

        .btn-animated:hover:not(:disabled) {
          transform: translateY(-3px);
          box-shadow: 0 12px 25px rgba(39, 137, 0, 0.35);
        }

        .btn-animated:active:not(:disabled) {
          transform: translateY(-1px);
        }
      `}</style>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #134e0dff 0%, #4ad43eff 100%)',
    position: 'relative' as const,
    overflow: 'hidden',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  background: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 1,
  },
  shape1: {
    position: 'absolute' as const,
    width: '320px',
    height: '320px',
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.12)',
    top: '-120px',
    left: '-120px',
  },
  shape2: {
    position: 'absolute' as const,
    width: '240px',
    height: '240px',
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.08)',
    bottom: '-80px',
    right: '-80px',
  },
  shape3: {
    position: 'absolute' as const,
    width: '180px',
    height: '180px',
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.06)',
    top: '50%',
    right: '10%',
    transform: 'translateY(-50%)',
  },
  card: {
    background: 'rgba(163, 202, 156, 0.69)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    borderRadius: '20px',
    padding: '2.5rem',
    width: '100%',
    maxWidth: '420px',
    zIndex: 2,
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: 'none', // Sin sombra
  },
  header: {
    textAlign: 'center' as const,
    marginBottom: '2rem',
  },
  logoContainer: {
    marginBottom: '1.25rem',
    display: 'flex',
    justifyContent: 'center',
  },
  logoImage: {
    width: '195px',
    height: 'auto',
    maxWidth: '100%',
    objectFit: 'contain',
    borderRadius: '12px',
    boxShadow: 'none', // Sin sombra
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: 700,
    color: '#2d3748',
    margin: '0.5rem 0',
  },
  subtitle: {
    color: '#718096',
    fontSize: '0.9rem',
    margin: 0,
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1.5rem',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
  },
  label: {
    fontWeight: 600,
    color: '#4a5568',
    marginBottom: '0.5rem',
    fontSize: '0.9rem',
  },
  input: {
    padding: '0.75rem 1rem',
    border: '2px solid #e2e8f0',
    borderRadius: '10px',
    fontSize: '1rem',
    background: 'white',
    outline: 'none',
    transition: 'all 0.3s ease',
  },
  button: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.75rem',
    padding: '0.75rem 1.5rem',
    background: 'linear-gradient(135deg, #278900ff, #0d5e05ff)',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '1rem',
    fontWeight: 600,
    cursor: 'pointer',
    height: '50px',
    transition: 'all 0.3s ease',
  },
  buttonDisabled: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.75rem',
    padding: '0.75rem 1.5rem',
    background: '#9ca3af',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '1rem',
    fontWeight: 600,
    cursor: 'not-allowed',
    height: '50px',
    opacity: 0.7,
  },
  spinner: {
    width: '16px',
    height: '16px',
    border: '2px solid transparent',
    borderTop: '2px solid white',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  footer: {
    marginTop: '1.5rem',
    textAlign: 'center' as const,
    paddingTop: '1.5rem',
    borderTop: '1px solid #e2e8f0',
  },
  footerText: {
    color: '#718096',
    fontSize: '0.8rem',
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
  },
  shieldIcon: {
    width: '16px',
    height: '16px',
    color: '#278900',
  },
  credits: {
    position: 'absolute' as const,
    bottom: '1rem',
    left: 0,
    width: '100%',
    textAlign: 'center' as const,
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: '0.8rem',
    zIndex: 2,
  },
};