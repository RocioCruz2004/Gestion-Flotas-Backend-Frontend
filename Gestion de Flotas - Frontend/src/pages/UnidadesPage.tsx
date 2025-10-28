import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { getUnidades, createUnidad, updateUnidad, searchUnidades } from "../services/unidadesService";

export default function UnidadesPage() {
  const [unidades, setUnidades] = useState<any[]>([]);
  const [nuevo, setNuevo] = useState({ placa: "", modelo: "", capacidad: 0, estado: "Activo" });
  const [busqueda, setBusqueda] = useState({ placa: "", modelo: "", minCapacidad: "", maxCapacidad: "", estado: "" });
  const [loading, setLoading] = useState(false);

  const estadosUnidad = [
    { value: "Activo", label: "Activo" },
    { value: "Inactivo", label: "Inactivo" }
  ];

  const cargar = async () => {
    setLoading(true);
    try {
      const data = await getUnidades();
      setUnidades(data);
    } catch {}
    finally { setLoading(false); }
  };

  useEffect(() => { cargar(); }, []);

 const handleBuscar = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const resultados = await searchUnidades({
        placa: busqueda.placa,
        modelo: busqueda.modelo,
        minCapacidad: busqueda.minCapacidad ? parseInt(busqueda.minCapacidad) : undefined,
        maxCapacidad: busqueda.maxCapacidad ? parseInt(busqueda.maxCapacidad) : undefined,
        estado: busqueda.estado
      });
      setUnidades(resultados);
    } catch {}
    finally { setLoading(false); }
  };

  const handleLimpiar = () => {
    setBusqueda({ placa: "", modelo: "", minCapacidad: "", maxCapacidad: "", estado: "" });
    cargar();
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!nuevo.placa || !nuevo.modelo || !nuevo.capacidad) {
      return Swal.fire("Campos requeridos", "Completa todos los campos obligatorios", "warning");
    }
    try {
      await createUnidad(nuevo);
      setNuevo({ placa: "", modelo: "", capacidad: 0, estado: "Activo" });
      cargar();
      Swal.fire("Éxito", "Unidad creada correctamente", "success");
    } catch {}
  };

  const handleUpdate = async (u) => {
    const { value: formValues } = await Swal.fire({
      title: "Editar Unidad",
      html: `
        <div style="text-align: left;">
          <div style="margin-bottom: 1rem;">
            <label style="display: block; font-weight: 600; margin-bottom: 0.5rem;">Placa</label>
            <input id="swal-placa" class="swal2-input" style="width: 100%; margin: 0;" value="${u.placa}" required>
          </div>
          <div style="margin-bottom: 1rem;">
            <label style="display: block; font-weight: 600; margin-bottom: 0.5rem;">Modelo</label>
            <input id="swal-modelo" class="swal2-input" style="width: 100%; margin: 0;" value="${u.modelo}" required>
          </div>
          <div style="margin-bottom: 1rem;">
            <label style="display: block; font-weight: 600; margin-bottom: 0.5rem;">Capacidad</label>
            <input id="swal-capacidad" class="swal2-input" style="width: 100%; margin: 0;" type="number" value="${u.capacidad}" required>
          </div>
          <div style="margin-bottom: 1rem;">
            <label style="display: block; font-weight: 600; margin-bottom: 0.5rem;">Estado</label>
            <select id="swal-estado" class="swal2-input" style="width: 100%; margin: 0;">
              ${estadosUnidad.map(e => `<option value="${e.value}" ${u.estado===e.value?'selected':''}>${e.label}</option>`).join('')}
            </select>
          </div>
        </div>
      `,
      width: '600px',
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Guardar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#88e788",
      preConfirm: () => {
        const placa = document.getElementById("swal-placa").value;
        const modelo = document.getElementById("swal-modelo").value;
        const capacidad = parseInt(document.getElementById("swal-capacidad").value);
        const estado = document.getElementById("swal-estado").value;
        if (!placa || !modelo || !capacidad) {
          Swal.showValidationMessage('Placa, modelo y capacidad son obligatorios');
          return false;
        }
        if (capacidad <= 0) {
          Swal.showValidationMessage('La capacidad debe ser mayor a 0');
          return false;
        }
        return { placa, modelo, capacidad, estado };
      }
    });

    if (formValues) {
      try {
        await updateUnidad(u.unidadId, { ...u, ...formValues });
        Swal.fire("Actualizado", "Unidad modificada correctamente", "success");
        cargar();
      } catch {}
    }
  };

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }

        .hover-lift {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .hover-lift:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(136, 231, 136, 0.3);
        }

        .input-focus {
          transition: all 0.3s ease;
        }

        .input-focus:focus {
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(136, 231, 136, 0.2);
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
          background: rgba(255, 255, 255, 0.3);
          transform: translate(-50%, -50%);
          transition: width 0.6s, height 0.6s;
        }

        .btn-animated:hover::before {
          width: 300px;
          height: 300px;
        }

        .btn-animated:hover {
          transform: scale(1.05);
          box-shadow: 0 10px 25px rgba(136, 231, 136, 0.4);
        }

        .btn-animated:active {
          transform: scale(0.98);
        }

        .table-row {
          transition: all 0.3s ease;
        }

        .table-row:hover {
          background: linear-gradient(90deg, rgba(136, 231, 136, 0.1) 0%, rgba(136, 231, 136, 0.05) 100%);
          transform: scale(1.01);
        }

        .badge-float {
          animation: float 3s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }

        .gradient-text {
          background: linear-gradient(135deg, #ffffffff 0%, #ffffffff 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .card-glow {
          box-shadow: 0 0 40px rgba(136, 231, 136, 0.15);
        }
      `}</style>

      {/* Header with animation */}
      <div style={{...styles.header, animation: 'fadeIn 0.6s ease-out'}}>
        <div style={styles.headerContent}>
          <div style={styles.iconContainer}>
            <svg style={styles.headerIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div>
            <h1 style={styles.title} className="gradient-text">Gestión de Unidades</h1>
            <p style={styles.subtitle}>Administra las unidades de transporte de tu flota</p>
          </div>
        </div>
      </div>

      {/* Search Container */}
      <div style={{...styles.searchContainer, animation: 'slideIn 0.6s ease-out 0.1s backwards'}} className="card-glow hover-lift">
        <div style={styles.searchHeader}>
          <div style={styles.searchTitleContainer}>
            <svg style={styles.searchIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h2 style={styles.searchTitle}>Buscar Unidades</h2>
          </div>
        </div>
        
        <form onSubmit={handleBuscar}>
          <div style={styles.searchGrid}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Placa</label>
              <input 
                type="text" 
                placeholder="Buscar por placa" 
                value={busqueda.placa} 
                onChange={(e)=>setBusqueda({...busqueda, placa:e.target.value})} 
                style={styles.input}
                className="input-focus"
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Modelo</label>
              <input 
                type="text" 
                placeholder="Buscar por modelo" 
                value={busqueda.modelo} 
                onChange={(e)=>setBusqueda({...busqueda, modelo:e.target.value})} 
                style={styles.input}
                className="input-focus"
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Cap. Mínima</label>
              <input 
                type="number" 
                placeholder="Capacidad mínima" 
                value={busqueda.minCapacidad} 
                onChange={(e)=>setBusqueda({...busqueda, minCapacidad:e.target.value})} 
                style={styles.input}
                className="input-focus"
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Cap. Máxima</label>
              <input 
                type="number" 
                placeholder="Capacidad máxima" 
                value={busqueda.maxCapacidad} 
                onChange={(e)=>setBusqueda({...busqueda, maxCapacidad:e.target.value})} 
                style={styles.input}
                className="input-focus"
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Estado</label>
              <select 
                value={busqueda.estado} 
                onChange={(e)=>setBusqueda({...busqueda, estado:e.target.value})} 
                style={styles.select}
                className="input-focus"
              >
                <option value="">Todos</option>
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
              </select>
            </div>
          </div>
          <div style={styles.searchActions}>
            <button type="submit" style={styles.btnPrimary} className="btn-animated">
              <svg style={styles.btnIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Buscar
            </button>
            <button type="button" onClick={handleLimpiar} style={styles.btnOutline} className="btn-animated">
              <svg style={styles.btnIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Limpiar
            </button>
          </div>
        </form>
      </div>

      {/* Results Count */}
      {!loading && (
        <div style={{...styles.resultsCount, animation: 'fadeIn 0.6s ease-out 0.2s backwards'}}>
          <div style={styles.countBadge}>
            <svg style={styles.countIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span>Mostrando <strong style={styles.countNumber}>{unidades.length}</strong> unidad(es)</span>
          </div>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <p style={styles.loadingText}>Cargando unidades...</p>
        </div>
      ) : (
        <div style={{...styles.tableContainer, animation: 'fadeIn 0.6s ease-out 0.3s backwards'}} className="card-glow hover-lift">
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeaderRow}>
                  <th style={styles.th}>Placa</th>
                  <th style={styles.th}>Modelo</th>
                  <th style={styles.th}>Capacidad</th>
                  <th style={styles.th}>Estado</th>
                  <th style={styles.th}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {unidades.length > 0 ? (
                  unidades.map((u, idx) => (
                    <tr key={u.unidadId} className="table-row" style={{...styles.tableRow, animation: `fadeIn 0.4s ease-out ${0.1 * idx}s backwards`}}>
                      <td style={styles.td}>
                        <strong style={styles.placaText}>{u.placa}</strong>
                      </td>
                      <td style={styles.td}>{u.modelo}</td>
                      <td style={styles.td}>
                        <div style={styles.capacidadContainer}>
                          <svg style={styles.capacidadIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          {u.capacidad} pasajeros
                        </div>
                      </td>
                      <td style={styles.td}>
                        <span style={u.estado === 'Activo' ? styles.badgeSuccess : styles.badgeDanger} className="badge-float">
                          {u.estado}
                        </span>
                      </td>
                      <td style={styles.td}>
                        <button onClick={() => handleUpdate(u)} style={styles.btnEdit} className="btn-animated">
                          <svg style={styles.btnIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Editar
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} style={styles.emptyTd}>
                      <div style={styles.emptyState}>
                        <svg style={styles.emptyIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <h3 style={styles.emptyTitle}>No hay unidades registradas</h3>
                        <p style={styles.emptySubtitle}>Comienza registrando tu primera unidad</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Form Container */}
      <div style={{...styles.formContainer, animation: 'fadeIn 0.6s ease-out 0.4s backwards'}} className="card-glow hover-lift">
        <div style={styles.formHeader}>
          <div style={styles.formTitleContainer}>
            <svg style={styles.formIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 style={styles.formTitle}>Registrar Nueva Unidad</h2>
          </div>
        </div>
        <form onSubmit={handleCreate}>
          <div style={styles.formGrid}>
            <div style={styles.formGroup}>
              <label style={styles.labelRequired}>Placa</label>
              <input 
                type="text" 
                placeholder="Ej: ABC123" 
                value={nuevo.placa} 
                onChange={(e)=>setNuevo({...nuevo, placa:e.target.value.toUpperCase()})} 
                style={{...styles.input, fontFamily: 'monospace'}}
                className="input-focus"
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.labelRequired}>Modelo</label>
              <input 
                type="text" 
                placeholder="Ej: Sprinter 2024" 
                value={nuevo.modelo} 
                onChange={(e)=>setNuevo({...nuevo, modelo:e.target.value})} 
                style={styles.input}
                className="input-focus"
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.labelRequired}>Capacidad</label>
              <input 
                type="number" 
                min="1" 
                placeholder="Número de pasajeros" 
                value={nuevo.capacidad} 
                onChange={(e)=>setNuevo({...nuevo, capacidad:parseInt(e.target.value)||0})} 
                style={styles.input}
                className="input-focus"
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Estado</label>
              <select 
                value={nuevo.estado} 
                onChange={(e)=>setNuevo({...nuevo, estado:e.target.value})} 
                style={styles.select}
                className="input-focus"
              >
                {estadosUnidad.map(e=><option key={e.value} value={e.value}>{e.label}</option>)}
              </select>
            </div>
          </div>
          <div style={styles.btnGroup}>
            <button type="submit" style={styles.btnSuccess} className="btn-animated">
              <svg style={styles.btnIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
              Guardar Unidad
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
    padding: '2rem',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  header: {
    background: 'linear-gradient(135deg, #88e788 0%, #4ade80 100%)',
    borderRadius: '24px',
    padding: '2.5rem',
    marginBottom: '2rem',
    boxShadow: '0 20px 60px rgba(136, 231, 136, 0.3)',
    position: 'relative',
    overflow: 'hidden',
  },
  headerContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
    position: 'relative',
    zIndex: 1,
  },
  iconContainer: {
    background: 'rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(10px)',
    borderRadius: '20px',
    padding: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIcon: {
    width: '48px',
    height: '48px',
    color: 'white',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: '800',
    color: '#1a1a1a',
    margin: 0,
    letterSpacing: '-0.02em',
  },
  subtitle: {
    fontSize: '1.1rem',
    color: 'rgba(255, 255, 255, 0.9)',
    margin: '0.5rem 0 0 0',
    fontWeight: '400',
  },
  searchContainer: {
    background: 'white',
    borderRadius: '24px',
    padding: '2rem',
    marginBottom: '2rem',
    border: '1px solid rgba(136, 231, 136, 0.2)',
  },
  searchHeader: {
    marginBottom: '1.5rem',
  },
  searchTitleContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  searchIcon: {
    width: '28px',
    height: '28px',
    color: '#88e788',
  },
  searchTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#1a1a1a',
    margin: 0,
  },
  searchGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1.25rem',
    marginBottom: '1.5rem',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  label: {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#4a5568',
    letterSpacing: '0.025em',
  },
  labelRequired: {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#4a5568',
    letterSpacing: '0.025em',
    position: 'relative',
    paddingLeft: '8px',
    '::before': {
      content: '"*"',
      color: '#ef4444',
      position: 'absolute',
      left: 0,
    }
  },
  input: {
    padding: '0.875rem 1rem',
    borderRadius: '12px',
    border: '2px solid #e5e7eb',
    fontSize: '1rem',
    outline: 'none',
    background: 'white',
  },
  select: {
    padding: '0.875rem 1rem',
    borderRadius: '12px',
    border: '2px solid #e5e7eb',
    fontSize: '1rem',
    outline: 'none',
    background: 'white',
    cursor: 'pointer',
  },
  searchActions: {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap',
  },
  btnPrimary: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.875rem 1.75rem',
    background: 'linear-gradient(135deg, #88e788 0%, #4ade80 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(136, 231, 136, 0.3)',
  },
  btnOutline: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.875rem 1.75rem',
    background: 'white',
    color: '#88e788',
    border: '2px solid #88e788',
    borderRadius: '12px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
  },
  btnIcon: {
    width: '20px',
    height: '20px',
  },
  resultsCount: {
    marginBottom: '1.5rem',
  },
  countBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1.5rem',
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(136, 231, 136, 0.15)',
    border: '1px solid rgba(136, 231, 136, 0.2)',
  },
  countIcon: {
    width: '20px',
    height: '20px',
    color: '#88e788',
  },
  countNumber: {
    color: '#88e788',
    fontSize: '1.1rem',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4rem 2rem',
    background: 'white',
    borderRadius: '24px',
    border: '1px solid rgba(136, 231, 136, 0.2)',
  },
  spinner: {
    width: '60px',
    height: '60px',
    border: '4px solid #e5e7eb',
    borderTop: '4px solid #88e788',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  loadingText: {
    marginTop: '1.5rem',
    fontSize: '1.1rem',
    color: '#6b7280',
    fontWeight: '500',
  },
  tableContainer: {
    background: 'white',
    borderRadius: '24px',
    overflow: 'hidden',
    marginBottom: '2rem',
    border: '1px solid rgba(136, 231, 136, 0.2)',
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  tableHeaderRow: {
    background: 'linear-gradient(135deg, #88e788 0%, #4ade80 100%)',
  },
  th: {
    padding: '1.25rem 1.5rem',
    textAlign: 'left',
    fontSize: '0.875rem',
    fontWeight: '700',
    color: 'white',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  tableRow: {
    borderBottom: '1px solid #f3f4f6',
  },
  td: {
    padding: '1.25rem 1.5rem',
    fontSize: '0.95rem',
    color: '#374151',
  },
  emptyTd: {
    padding: 0,
  },
  placaText: {
    color: '#1a1a1a',
    fontSize: '1.05rem',
    fontFamily: 'monospace',
    background: 'linear-gradient(135deg, #88e788 0%, #4ade80 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  capacidadContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  capacidadIcon: {
    width: '20px',
    height: '20px',
    color: '#88e788',
  },
  badgeSuccess: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '0.5rem 1rem',
    background: 'linear-gradient(135deg, #88e788 0%, #4ade80 100%)',
    color: 'white',
    borderRadius: '9999px',
    fontSize: '0.875rem',
    fontWeight: '600',
    boxShadow: '0 4px 12px rgba(136, 231, 136, 0.3)',
  },
  badgeDanger: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '0.5rem 1rem',
    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    color: 'white',
    borderRadius: '9999px',
    fontSize: '0.875rem',
    fontWeight: '600',
    boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
  },
  btnEdit: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.625rem 1.25rem',
    background: 'linear-gradient(135deg, #88e788 0%, #4ade80 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '0.875rem',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(136, 231, 136, 0.3)',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4rem 2rem',
  },
  emptyIcon: {
    width: '80px',
    height: '80px',
    color: '#d1d5db',
    marginBottom: '1.5rem',
  },
  emptyTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#374151',
    margin: '0 0 0.5rem 0',
  },
  emptySubtitle: {
    fontSize: '1rem',
    color: '#9ca3af',
    margin: 0,
  },
  formContainer: {
    background: 'white',
    borderRadius: '24px',
    padding: '2rem',
    border: '1px solid rgba(136, 231, 136, 0.2)',
  },
  formHeader: {
    marginBottom: '1.5rem',
    paddingBottom: '1rem',
    borderBottom: '2px solid #f3f4f6',
  },
  formTitleContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  formIcon: {
    width: '28px',
    height: '28px',
    color: '#88e788',
  },
  formTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#1a1a1a',
    margin: 0,
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem',
  },
  btnGroup: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'flex-end',
  },
  btnSuccess: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '1rem 2rem',
    background: 'linear-gradient(135deg, #88e788 0%, #4ade80 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '1.05rem',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 8px 20px rgba(136, 231, 136, 0.4)',
  },
}