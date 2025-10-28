import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { getAsignaciones, createAsignacion, updateAsignacion } from "../services/asignacionesService";
import { getUnidadesConductores } from "../services/unidadesConductoresService";
import { getRutas } from "../services/rutasService";
import { getUnidades } from "../services/unidadesService";
import { getConductores } from "../services/conductoresService";

export default function AsignacionesPage() {
  const [asignaciones, setAsignaciones] = useState<any[]>([]);
  const [unidadesConductores, setUnidadesConductores] = useState<any[]>([]);
  const [unidades, setUnidades] = useState<any[]>([]);
  const [conductores, setConductores] = useState<any[]>([]);
  const [rutas, setRutas] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [filtros, setFiltros] = useState({
    unidadConductorId: "",
    rutaHorarioId: "",
    estado: ""
  });

  const [nueva, setNueva] = useState({
    unidadConductorId: "",
    rutaHorarioId: "",
    fechaAsignacion: new Date().toISOString().split('T')[0],
    estado: "Activo"
  });

  const cargarDatos = async (filters?: any) => {
    setLoading(true);
    try {
      const [asignacionesData, unidadesConductoresData, unidadesData, conductoresData, rutasData] = await Promise.all([
        getAsignaciones(),
        getUnidadesConductores(),
        getUnidades(),
        getConductores(),
        getRutas()
      ]);
      
      let asignacionesFiltradas = asignacionesData;
      if (filters && Object.keys(filters).some(k => filters[k] !== undefined && String(filters[k]).trim() !== '')) {
        const { unidadConductorId, rutaHorarioId, estado } = filters;
        asignacionesFiltradas = (asignacionesData || []).filter((a: any) => {
          let ok = true;
          if (unidadConductorId && String(unidadConductorId).trim() !== '') {
            ok = ok && String(a.unidadConductorId) === String(unidadConductorId);
          }
          if (rutaHorarioId && String(rutaHorarioId).trim() !== '') {
            ok = ok && String(a.rutaHorarioId) === String(rutaHorarioId);
          }
          if (estado && String(estado).trim() !== '') {
            ok = ok && String((a.estado || 'Activo')).toLowerCase() === String(estado).toLowerCase();
          }
          return ok;
        });
      }
      
      setAsignaciones(asignacionesFiltradas);
      setUnidadesConductores(unidadesConductoresData);
      setUnidades(unidadesData);
      setConductores(conductoresData);
      setRutas(rutasData);
      
    } catch (error) {
      console.error("Error cargando datos:", error);
      Swal.fire("Error", "No se pudieron cargar los datos", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleBuscar = () => {
    cargarDatos(filtros);
  };

  const handleLimpiarFiltros = () => {
    setFiltros({
      unidadConductorId: "",
      rutaHorarioId: "",
      estado: ""
    });
    cargarDatos();
  };

  const obtenerNombreUnidad = (unidadId: string) => {
    const unidad = unidades.find(u => u.unidadId === unidadId);
    return unidad ? `${unidad.placa} - ${unidad.modelo}` : `Unidad ID: ${unidadId}`;
  };

  const obtenerNombreConductor = (conductorId: string) => {
    const conductor = conductores.find(c => c.conductorId === conductorId);
    return conductor ? conductor.nombre : `Conductor ID: ${conductorId}`;
  };

  const obtenerInfoUnidadConductor = (unidadConductorId: string) => {
    const asignacionUC = unidadesConductores.find(uc => uc.unidadConductorId === unidadConductorId);
    
    if (!asignacionUC) {
      return `Asignación ID: ${unidadConductorId}`;
    }
    
    if (asignacionUC.unidad && asignacionUC.conductor) {
      const unidad = asignacionUC.unidad;
      const conductor = asignacionUC.conductor;
      return `${unidad.placa} - ${unidad.modelo} / ${conductor.nombre}`;
    }
    
    if (asignacionUC.unidadId && asignacionUC.conductorId) {
      const unidadNombre = obtenerNombreUnidad(asignacionUC.unidadId);
      const conductorNombre = obtenerNombreConductor(asignacionUC.conductorId);
      return `${unidadNombre} / ${conductorNombre}`;
    }
    
    return `Asignación ID: ${unidadConductorId}`;
  };

  const obtenerInfoRuta = (rutaHorarioId: string) => {
    const ruta = rutas.find(r => r.rutaHorarioId === rutaHorarioId);
    if (!ruta) return `Ruta ID: ${rutaHorarioId}`;
    
    const origen = ruta.origin || ruta.origen || "Origen no definido";
    const destino = ruta.destino || "Destino no definido";
    
    return `${ruta.nombre} (${origen} → ${destino})`;
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nueva.unidadConductorId || !nueva.rutaHorarioId)
      return Swal.fire("Campos requeridos", "Selecciona una asignación y una ruta", "warning");

    try {
      const datosParaBackend = {
        unidadConductorId: nueva.unidadConductorId,
        rutaHorarioId: nueva.rutaHorarioId,
        fechaAsignacion: nueva.fechaAsignacion ? `${nueva.fechaAsignacion}T00:00:00.000Z` : new Date().toISOString(),
        estado: nueva.estado || "Activo"
      };
      
      await createAsignacion(datosParaBackend);
      Swal.fire("Éxito", "Asignación creada correctamente", "success");
      setNueva({
        unidadConductorId: "",
        rutaHorarioId: "",
        fechaAsignacion: new Date().toISOString().split('T')[0],
        estado: "Activo"
      });
      cargarDatos(filtros);
    } catch (error) {
      console.error("Error al crear asignación:", error);
      Swal.fire("Error", "No se pudo crear la asignación", "error");
    }
  };

  const handleUpdate = async (asignacion: any) => {
    const { value: formValues } = await Swal.fire({
      title: "Editar Asignación",
      html: `
        <div style="text-align: left;">
          <div style="margin-bottom: 1rem;">
            <label style="display: block; font-weight: 600; margin-bottom: 0.5rem;">Fecha de Asignación</label>
            <input id="swal-fecha" class="swal2-input" style="width: 100%; margin: 0;" type="date" value="${asignacion.fechaAsignacion ? asignacion.fechaAsignacion.split('T')[0] : ''}">
          </div>
          <div style="margin-bottom: 1rem;">
            <label style="display: block; font-weight: 600; margin-bottom: 0.5rem;">Estado</label>
            <select id="swal-estado" class="swal2-input" style="width: 100%; margin: 0;">
              <option value="Activo" ${asignacion.estado === "Activo" ? "selected" : ""}>Activo</option>
              <option value="Inactivo" ${asignacion.estado === "Inactivo" ? "selected" : ""}>Inactivo</option>
            </select>
          </div>
        </div>
      `,
      width: '600px',
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Guardar",
      cancelButtonText: "Cancelar",
      preConfirm: () => {
        return {
          fechaAsignacion: (document.getElementById("swal-fecha") as HTMLInputElement).value,
          estado: (document.getElementById("swal-estado") as HTMLSelectElement).value,
        };
      },
    });

    if (formValues) {
      try {
        await updateAsignacion(asignacion.asignacionId, {
          ...asignacion,
          ...formValues,
          fechaAsignacion: `${formValues.fechaAsignacion}T00:00:00.000Z`
        });
        Swal.fire("Actualizado", "Asignación modificada correctamente", "success");
        cargarDatos(filtros);
      } catch (error) {
        console.error("Error al actualizar:", error);
        Swal.fire("Error", "No se pudo actualizar la asignación", "error");
      }
    }
  };

  const obtenerOpcionUnidadConductor = (uc: any) => {
    return obtenerInfoUnidadConductor(uc.unidadConductorId);
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
      <div style={{ ...styles.header, animation: 'fadeIn 0.6s ease-out' }} className="card-glow hover-lift">
        <div style={styles.headerContent}>
          <div style={styles.iconContainer}>
            <svg style={styles.headerIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </div>
          <div>
            <h1 style={styles.title} className="gradient-text">Gestión de Asignaciones de Rutas</h1>
            <p style={styles.subtitle}>Administra las asignaciones de rutas a unidades y conductores</p>
          </div>
        </div>
      </div>

      {/* Search Container */}
      <div style={{ ...styles.searchContainer, animation: 'slideIn 0.6s ease-out 0.1s backwards' }} className="card-glow hover-lift">
        <div style={styles.searchHeader}>
          <div style={styles.searchTitleContainer}>
            <svg style={styles.searchIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h2 style={styles.searchTitle}>Buscar Asignaciones</h2>
          </div>
        </div>
        <div style={styles.searchGrid}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Unidad-Conductor</label>
            <select
              value={filtros.unidadConductorId}
              onChange={(e) => setFiltros({...filtros, unidadConductorId: e.target.value})}
              style={styles.select}
              className="input-focus"
            >
              <option value="">Todas las asignaciones</option>
              {unidadesConductores.map((uc) => (
                <option key={uc.unidadConductorId} value={uc.unidadConductorId}>
                  {obtenerOpcionUnidadConductor(uc)}
                </option>
              ))}
            </select>
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Ruta</label>
            <select
              value={filtros.rutaHorarioId}
              onChange={(e) => setFiltros({...filtros, rutaHorarioId: e.target.value})}
              style={styles.select}
              className="input-focus"
            >
              <option value="">Todas las rutas</option>
              {rutas.map((ruta) => (
                <option key={ruta.rutaHorarioId} value={ruta.rutaHorarioId}>
                  {ruta.nombre}
                </option>
              ))}
            </select>
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Estado</label>
            <select
              value={filtros.estado}
              onChange={(e) => setFiltros({...filtros, estado: e.target.value})}
              style={styles.select}
              className="input-focus"
            >
              <option value="">Todos los estados</option>
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
            </select>
          </div>
        </div>
        <div style={styles.searchActions}>
          <button onClick={handleBuscar} style={styles.btnPrimary} className="btn-animated">
            <svg style={styles.btnIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Buscar
          </button>
          <button onClick={handleLimpiarFiltros} style={styles.btnOutline} className="btn-animated">
            <svg style={styles.btnIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Limpiar Filtros
          </button>
        </div>
      </div>

      {/* Results Count */}
      {!loading && (
        <div style={{ ...styles.resultsCount, animation: 'fadeIn 0.6s ease-out 0.2s backwards' }}>
          <div style={styles.countBadge}>
            <svg style={styles.countIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span>Mostrando <strong style={styles.countNumber}>{asignaciones.length}</strong> asignación(es)
              {(filtros.unidadConductorId || filtros.rutaHorarioId || filtros.estado) && 
               " con filtros aplicados"}
            </span>
          </div>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <p style={styles.loadingText}>Cargando asignaciones...</p>
        </div>
      ) : (
        <div style={{ ...styles.tableContainer, animation: 'fadeIn 0.6s ease-out 0.3s backwards' }} className="card-glow hover-lift">
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeaderRow}>
                  <th style={styles.th}>Unidad - Conductor</th>
                  <th style={styles.th}>Ruta</th>
                  <th style={styles.th}>Fecha de Asignación</th>
                  <th style={styles.th}>Estado</th>
                  <th style={styles.th}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {asignaciones.length > 0 ? (
                  asignaciones.map((a, idx) => (
                    <tr key={a.asignacionId} className="table-row" style={{ ...styles.tableRow, animation: `fadeIn 0.4s ease-out ${0.1 * idx}s backwards` }}>
                      <td style={styles.td}>{obtenerInfoUnidadConductor(a.unidadConductorId)}</td>
                      <td style={styles.td}>{obtenerInfoRuta(a.rutaHorarioId)}</td>
                      <td style={styles.td}>
                        {a.fechaAsignacion ? new Date(a.fechaAsignacion).toLocaleDateString() : "No especificada"}
                      </td>
                      <td style={styles.td}>
                        <span style={a.estado === 'Activo' ? styles.badgeSuccess : styles.badgeDanger} className="badge-float">
                          {a.estado || "Activo"}
                        </span>
                      </td>
                      <td style={styles.td}>
                        <button onClick={() => handleUpdate(a)} style={styles.btnEdit} className="btn-animated">
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
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                        </svg>
                        <h3 style={styles.emptyTitle}>No hay asignaciones registradas</h3>
                        <p style={styles.emptySubtitle}>
                          {(filtros.unidadConductorId || filtros.rutaHorarioId || filtros.estado) 
                            ? "Intenta con otros criterios de búsqueda" 
                            : "No hay asignaciones de rutas en el sistema"}
                        </p>
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
      <div style={{ ...styles.formContainer, animation: 'fadeIn 0.6s ease-out 0.4s backwards' }} className="card-glow hover-lift">
        <div style={styles.formHeader}>
          <div style={styles.formTitleContainer}>
            <svg style={styles.formIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 style={styles.formTitle}>Registrar Nueva Asignación de Ruta</h2>
          </div>
          <p style={styles.formSubtitle}>Asigna una unidad-conductor a una ruta específica</p>
        </div>
        <form onSubmit={handleCreate}>
          <div style={styles.formGrid}>
            <div style={styles.formGroup}>
              <label style={styles.labelRequired}>Unidad-Conductor</label>
              <select
                value={nueva.unidadConductorId}
                onChange={(e) => setNueva({ ...nueva, unidadConductorId: e.target.value })}
                style={styles.select}
                className="input-focus"
                required
              >
                <option value="">Seleccionar asignación</option>
                {unidadesConductores
                  .filter(uc => uc.estado === "Activo")
                  .map((uc) => (
                    <option key={uc.unidadConductorId} value={uc.unidadConductorId}>
                      {obtenerOpcionUnidadConductor(uc)}
                    </option>
                  ))
                }
              </select>
              <span style={styles.formHint}>
                {unidadesConductores.filter(uc => uc.estado === "Activo").length} asignaciones activas disponibles
              </span>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.labelRequired}>Ruta</label>
              <select
                value={nueva.rutaHorarioId}
                onChange={(e) => setNueva({ ...nueva, rutaHorarioId: e.target.value })}
                style={styles.select}
                className="input-focus"
                required
              >
                <option value="">Seleccionar ruta</option>
                {rutas
                  .filter(r => r.estado === "Activo")
                  .map((ruta) => (
                    <option key={ruta.rutaHorarioId} value={ruta.rutaHorarioId}>
                      {ruta.nombre} ({ruta.origin || ruta.origen} → {ruta.destino})
                    </option>
                  ))
                }
              </select>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Fecha de Asignación</label>
              <input
                type="date"
                value={nueva.fechaAsignacion}
                onChange={(e) => setNueva({ ...nueva, fechaAsignacion: e.target.value })}
                style={styles.input}
                className="input-focus"
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Estado</label>
              <select
                value={nueva.estado}
                onChange={(e) => setNueva({ ...nueva, estado: e.target.value })}
                style={styles.select}
                className="input-focus"
              >
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
              </select>
            </div>
          </div>
          <div style={styles.btnGroup}>
            <button type="submit" style={styles.btnSuccess} className="btn-animated">
              <svg style={styles.btnIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
              Guardar Asignación
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
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
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
  formSubtitle: {
    fontSize: '0.95rem',
    color: '#6b7280',
    margin: '0.5rem 0 0 0',
    fontWeight: '400',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem',
  },
  formHint: {
    fontSize: '0.75rem',
    color: '#9ca3af',
    marginTop: '0.25rem',
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
};