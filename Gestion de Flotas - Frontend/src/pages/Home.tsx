import { useEffect, useState } from "react";
import { Truck, Users, MapPin, AlertTriangle, TrendingUp, Clock, CheckCircle } from "lucide-react";
import logo from "../assets/INICIO LOGO.png";

export default function Home() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Buenos días";
    if (hour < 18) return "Buenas tardes";
    return "Buenas noches";
  };

  const stats = [
    { label: "Unidades Activas", value: "24", icon: Truck, color: "#10b981", bgColor: "rgba(16, 185, 129, 0.1)" },
    { label: "Conductores", value: "32", icon: Users, color: "#3b82f6", bgColor: "rgba(59, 130, 246, 0.1)" },
    { label: "Rutas Operativas", value: "12", icon: MapPin, color: "#8b5cf6", bgColor: "rgba(139, 92, 246, 0.1)" },
    { label: "Incidencias Hoy", value: "3", icon: AlertTriangle, color: "#f59e0b", bgColor: "rgba(245, 158, 11, 0.1)" },
  ];

  const features = [
    {
      title: "Gestión de Conductores",
      description: "Administra y monitorea el desempeño de tu equipo de conductores",
      icon: Users,
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    },
    {
      title: "Control de Flota",
      description: "Seguimiento en tiempo real del estado y ubicación de tus unidades",
      icon: Truck,
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    },
    {
      title: "Optimización de Rutas",
      description: "Planifica y optimiza las rutas para máxima eficiencia operativa",
      icon: MapPin,
      gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    },
    {
      title: "Alertas y Reportes",
      description: "Sistema inteligente de notificaciones y reportes detallados",
      icon: AlertTriangle,
      gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    },
  ];

  const recentActivities = [
    { action: "Unidad 101 - Ruta asignada", time: "Hace 5 min", status: "success" },
    { action: "Mantenimiento programado - Unidad 205", time: "Hace 15 min", status: "warning" },
    { action: "Nuevo conductor registrado", time: "Hace 1 hora", status: "info" },
  ];

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(16, 185, 129, 0.3); }
          50% { box-shadow: 0 0 40px rgba(16, 185, 129, 0.6); }
        }
        .stat-card {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
        }
        .stat-card:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }
        .feature-card {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
        }
        .feature-card:hover {
          transform: translateY(-12px) scale(1.03);
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2);
        }
        .feature-card:hover .feature-icon {
          transform: scale(1.1) rotate(5deg);
        }
        .feature-icon {
          transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .activity-item {
          transition: all 0.3s ease;
        }
        .activity-item:hover {
          background: #f9fafb;
          transform: translateX(8px);
        }
        .cta-button {
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }
        .cta-button::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.3);
          transform: translate(-50%, -50%);
          transition: width 0.6s, height 0.6s;
        }
        .cta-button:hover::before {
          width: 400px;
          height: 400px;
        }
        .cta-button:hover {
          transform: scale(1.05);
          box-shadow: 0 15px 35px rgba(16, 185, 129, 0.4);
        }
        .logo-container {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>

      {/* Hero Section */}
      <div style={styles.hero}>
        <div style={styles.heroLeft}>
          <h1 style={styles.heroTitle}>
            {getGreeting()}
          </h1>
          <h2 style={styles.heroSubtitle}>
            Sistema de Gestión Inteligente de Flotas
          </h2>
          <p style={styles.heroDescription}>
            Controla, monitorea y optimiza toda tu operación de transporte desde una sola plataforma
          </p>
          <div style={styles.timeDisplay}>
            <Clock size={20} style={{ color: '#10b981' }} />
            <span style={styles.timeText}>
              {currentTime.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
            </span>
            <span style={styles.dateText}>
              {currentTime.toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" })}
            </span>
          </div>
        </div>
        <div style={styles.heroRight}>
          <div style={styles.decorativeCircle1}></div>
          <div style={styles.decorativeCircle2}></div>
        </div>
      </div>

      {/* Stats Section */}
      <div style={styles.statsGrid}>
        {stats.map((stat, index) => (
          <div
            key={index}
            className="stat-card"
            style={{
              ...styles.statCard,
              background: stat.bgColor,
              animation: `scaleIn 0.5s ease-out ${index * 0.1}s both`,
            }}
          >
            <div style={{ ...styles.statIcon, background: stat.color }}>
              <stat.icon size={24} color="white" />
            </div>
            <div style={styles.statContent}>
              <h3 style={styles.statValue}>{stat.value}</h3>
              <p style={{ ...styles.statLabel, color: stat.color }}>{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div style={styles.mainGrid}>
        {/* Features Section */}
        <div style={styles.featuresSection}>
          <h2 style={styles.sectionTitle}>Módulos del Sistema</h2>
          <div style={styles.featuresGrid}>
            {features.map((feature, index) => (
              <div
                key={index}
                className="feature-card"
                style={{
                  ...styles.featureCard,
                  animation: `slideInLeft 0.6s ease-out ${index * 0.15}s both`,
                }}
              >
                <div className="feature-icon" style={{ ...styles.featureIcon, background: feature.gradient }}>
                  <feature.icon size={32} color="white" />
                </div>
                <h3 style={styles.featureTitle}>{feature.title}</h3>
                <p style={styles.featureDescription}>{feature.description}</p>
                <div style={styles.featureArrow}>→</div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Panel */}
        <div style={styles.activityPanel}>
          <div style={styles.activityHeader}>
            <h2 style={styles.sectionTitle}>Actividad Reciente</h2>
            <span style={styles.viewAll}>Ver todas →</span>
          </div>
          <div style={styles.activitiesList}>
            {recentActivities.map((activity, index) => (
              <div
                key={index}
                className="activity-item"
                style={{
                  ...styles.activityItem,
                  animation: `slideInRight 0.5s ease-out ${index * 0.1}s both`,
                }}
              >
                <div style={styles.activityIndicator}>
                  <CheckCircle
                    size={20}
                    color={
                      activity.status === "success"
                        ? "#10b981"
                        : activity.status === "warning"
                        ? "#f59e0b"
                        : "#3b82f6"
                    }
                  />
                </div>
                <div style={styles.activityContent}>
                  <p style={styles.activityAction}>{activity.action}</p>
                  <span style={styles.activityTime}>{activity.time}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div style={styles.quickActions}>
            <h3 style={styles.quickActionsTitle}>Acciones Rápidas</h3>
            <div style={styles.quickActionsGrid}>
              <button style={{ ...styles.quickActionBtn, background: '#10b981' }}>
                + Nueva Unidad
              </button>
              <button style={{ ...styles.quickActionBtn, background: '#3b82f6' }}>
                + Asignar Ruta
              </button>
              <button style={{ ...styles.quickActionBtn, background: '#8b5cf6' }}>
                Ver Reportes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: '#f8fafc',
    padding: '2rem',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  hero: {
    background: 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)',
    borderRadius: '24px',
    padding: '3rem',
    marginBottom: '2rem',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '3rem',
    alignItems: 'center',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.08)',
    border: '1px solid rgba(16, 185, 129, 0.1)',
    position: 'relative',
    overflow: 'hidden',
  },
  heroLeft: {
    zIndex: 1,
  },
  logoContainer: {
    marginBottom: '2rem',
  },
  logo: {
    height: '80px',
    width: 'auto',
    filter: 'drop-shadow(0 4px 12px rgba(16, 185, 129, 0.3))',
  },
  heroTitle: {
    fontSize: '3rem',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #047857 0%, #10b981 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    margin: '0 0 0.5rem 0',
    letterSpacing: '-0.02em',
  },
  heroSubtitle: {
    fontSize: '1.75rem',
    fontWeight: '600',
    color: '#1f2937',
    margin: '0 0 1rem 0',
  },
  heroDescription: {
    fontSize: '1.1rem',
    color: '#6b7280',
    margin: '0 0 2rem 0',
    lineHeight: '1.6',
  },
  timeDisplay: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '1rem',
    background: 'rgba(16, 185, 129, 0.05)',
    borderRadius: '12px',
    marginBottom: '2rem',
    border: '1px solid rgba(16, 185, 129, 0.1)',
  },
  timeText: {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: '#047857',
  },
  dateText: {
    fontSize: '0.95rem',
    color: '#6b7280',
    textTransform: 'capitalize',
  },
  ctaButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '1rem 2rem',
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '1.1rem',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 10px 25px rgba(16, 185, 129, 0.3)',
  },
  heroRight: {
    position: 'relative',
    height: '400px',
  },
  decorativeCircle1: {
    position: 'absolute',
    width: '300px',
    height: '300px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(16, 185, 129, 0.05) 100%)',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    animation: 'float 4s ease-in-out infinite',
  },
  decorativeCircle2: {
    position: 'absolute',
    width: '200px',
    height: '200px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.3) 0%, rgba(16, 185, 129, 0.1) 100%)',
    top: '30%',
    left: '30%',
    animation: 'float 3s ease-in-out infinite',
    animationDelay: '0.5s',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem',
  },
  statCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
    padding: '1.5rem',
    borderRadius: '16px',
    border: '1px solid rgba(0, 0, 0, 0.05)',
  },
  statIcon: {
    width: '56px',
    height: '56px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    fontSize: '2rem',
    fontWeight: '800',
    color: '#1f2937',
    margin: '0 0 0.25rem 0',
  },
  statLabel: {
    fontSize: '0.9rem',
    fontWeight: '600',
    margin: 0,
  },
  mainGrid: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '2rem',
  },
  featuresSection: {
    background: 'white',
    borderRadius: '20px',
    padding: '2rem',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)',
    border: '1px solid rgba(0, 0, 0, 0.05)',
  },
  sectionTitle: {
    fontSize: '1.75rem',
    fontWeight: '700',
    color: '#1f2937',
    margin: '0 0 1.5rem 0',
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '1.5rem',
  },
  featureCard: {
    background: 'white',
    borderRadius: '16px',
    padding: '2rem',
    border: '1px solid #e5e7eb',
    position: 'relative',
  },
  featureIcon: {
    width: '64px',
    height: '64px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1.5rem',
  },
  featureTitle: {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: '#1f2937',
    margin: '0 0 0.75rem 0',
  },
  featureDescription: {
    fontSize: '0.95rem',
    color: '#6b7280',
    margin: 0,
    lineHeight: '1.5',
  },
  featureArrow: {
    position: 'absolute',
    bottom: '1.5rem',
    right: '1.5rem',
    fontSize: '1.5rem',
    color: '#10b981',
    fontWeight: 'bold',
  },
  activityPanel: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
  },
  activityHeader: {
    background: 'white',
    borderRadius: '20px',
    padding: '2rem',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)',
    border: '1px solid rgba(0, 0, 0, 0.05)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  viewAll: {
    fontSize: '0.9rem',
    color: '#10b981',
    fontWeight: '600',
    cursor: 'pointer',
  },
  activitiesList: {
    background: 'white',
    borderRadius: '20px',
    padding: '1.5rem',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)',
    border: '1px solid rgba(0, 0, 0, 0.05)',
  },
  activityItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '1rem',
    padding: '1rem',
    borderRadius: '12px',
    marginBottom: '0.5rem',
  },
  activityIndicator: {
    flexShrink: 0,
  },
  activityContent: {
    flex: 1,
  },
  activityAction: {
    fontSize: '0.95rem',
    fontWeight: '600',
    color: '#1f2937',
    margin: '0 0 0.25rem 0',
  },
  activityTime: {
    fontSize: '0.85rem',
    color: '#9ca3af',
  },
  quickActions: {
    background: 'white',
    borderRadius: '20px',
    padding: '2rem',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)',
    border: '1px solid rgba(0, 0, 0, 0.05)',
  },
  quickActionsTitle: {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: '#1f2937',
    margin: '0 0 1rem 0',
  },
  quickActionsGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  quickActionBtn: {
    padding: '0.875rem 1.5rem',
    border: 'none',
    borderRadius: '12px',
    color: 'white',
    fontSize: '0.95rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  },
};