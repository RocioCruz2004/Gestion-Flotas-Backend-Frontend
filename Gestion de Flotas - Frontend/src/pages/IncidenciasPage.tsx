import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { getIncidencias, createIncidencia, updateIncidencia } from "../services/incidenciasService";
import { getAsignaciones } from "../services/asignacionesService";

export default function IncidenciasPage() {
  const [incidencias, setIncidencias] = useState<any[]>([]);
  const [asignaciones, setAsignaciones] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [filtros, setFiltros] = useState({
    tipo: "",
    gravedad: "",
    estado: "",
    fechaInicio: "",
    fechaFin: ""
  });

  const [nueva, setNueva] = useState({
    asignacionId: "",
    fecha: new Date().toISOString().split("T")[0],
    tipo: "",
    gravedad: "",
    descripcion: "",
    estado: "Activo"
  });

  const tiposIncidencia = [
    { value: "FalloTecnico", label: "Falla Técnica" },
    { value: "Choque", label: "Choque" },
    { value: "FaltaConductor", label: "Falta de Conductor" }
  ];

  const nivelesGravedad = [
    { value: "Alto", label: "Alto" },
    { value: "Medio", label: "Medio" },
    { value: "Bajo", label: "Bajo" }
  ];

  const estadosIncidencia = [
    { value: "Activo", label: "Activo" },
    { value: "Inactivo", label: "Inactivo" }
  ];

  const cargarDatos = async (filters?: any) => {
    setLoading(true);
    try {
      const [incidenciasData, asignacionesData] = await Promise.all([
        getIncidencias(filters),
        getAsignaciones()
      ]);

      let incidenciasFiltradas = incidenciasData;
      if (filters && Object.keys(filters).some(k => filters[k])) {
        const { tipo, gravedad, estado, fechaInicio, fechaFin } = filters;
        incidenciasFiltradas = (incidenciasData || []).filter((i: any) => {
          let ok = true;
          if (tipo) ok = ok && i.tipo?.toLowerCase() === tipo.toLowerCase();
          if (gravedad) ok = ok && i.gravedad?.toLowerCase() === gravedad.toLowerCase();
          if (estado) ok = ok && i.estado?.toLowerCase() === estado.toLowerCase();
          if (fechaInicio) ok = ok && new Date(i.fecha) >= new Date(fechaInicio);
          if (fechaFin) ok = ok && new Date(i.fecha) <= new Date(fechaFin);
          return ok;
        });
      }

      setIncidencias(incidenciasFiltradas);
      setAsignaciones(asignacionesData);
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

  const handleBuscar = (e: React.FormEvent) => {
    e.preventDefault();
    cargarDatos(filtros);
  };

  const handleLimpiarFiltros = () => {
    setFiltros({
      tipo: "",
      gravedad: "",
      estado: "",
      fechaInicio: "",
      fechaFin: ""
    });
    cargarDatos();
  };

  const obtenerInfoAsignacion = (id: string) => {
    const asignacion = asignaciones.find(a => a.asignacionId === id);
    if (!asignacion) return `Asignación ID: ${id}`;
    return `Asignación #${asignacion.asignacionId.substring(0, 8)}...`;
  };

  const formatearFecha = (fecha: string) => {
    if (!fecha) return "No especificada";
    return new Date(fecha).toLocaleDateString();
  };

  const obtenerColorGravedad = (gravedad: string) => {
    switch (gravedad) {
      case "Alto": return "badge-danger";
      case "Medio": return "badge-warning";
      case "Bajo": return "badge-info";
      default: return "badge-secondary";
    }
  };

  const obtenerEtiquetaTipo = (tipo: string) => {
    const tipoObj = tiposIncidencia.find(t => t.value === tipo);
    return tipoObj ? tipoObj.label : tipo;
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nueva.asignacionId || !nueva.tipo || !nueva.gravedad || !nueva.descripcion)
      return Swal.fire("Campos requeridos", "Completa todos los campos obligatorios", "warning");

    try {
      const incidenciaData = {
        asignacionId: nueva.asignacionId,
        fecha: `${nueva.fecha}T00:00:00.000Z`,
        tipo: nueva.tipo,
        gravedad: nueva.gravedad,
        descripcion: nueva.descripcion,
        estado: nueva.estado
      };

      await createIncidencia(incidenciaData);
      Swal.fire("Éxito", "Incidencia registrada correctamente", "success");

      setNueva({
        asignacionId: "",
        fecha: new Date().toISOString().split("T")[0],
        tipo: "",
        gravedad: "",
        descripcion: "",
        estado: "Activo"
      });

      cargarDatos(filtros);
    } catch (error: any) {
      console.error("Error al crear incidencia:", error);
      const message =
        error?.response?.data?.message ||
        "No se pudo registrar la incidencia. Verifica los campos o los enums.";
      Swal.fire("Error", message, "error");
    }
  };

  const handleUpdate = async (incidencia: any) => {
    const { value: formValues } = await Swal.fire({
      title: "Editar Incidencia",
      html: `
        <div style="text-align: left;">
          <div style="margin-bottom: 1rem;">
            <label style="display: block; font-weight: 600; margin-bottom: 0.5rem;">Tipo</label>
            <select id="swal-tipo" class="swal2-input" style="width: 100%; margin: 0;">
              ${tiposIncidencia.map(t =>
                `<option value="${t.value}" ${incidencia.tipo === t.value ? "selected" : ""}>${t.label}</option>`
              ).join("")}
            </select>
          </div>
          <div style="margin-bottom: 1rem;">
            <label style="display: block; font-weight: 600; margin-bottom: 0.5rem;">Gravedad</label>
            <select id="swal-gravedad" class="swal2-input" style="width: 100%; margin: 0;">
              ${nivelesGravedad.map(g =>
                `<option value="${g.value}" ${incidencia.gravedad === g.value ? "selected" : ""}>${g.label}</option>`
              ).join("")}
            </select>
          </div>
          <div style="margin-bottom: 1rem;">
            <label style="display: block; font-weight: 600; margin-bottom: 0.5rem;">Descripción</label>
            <textarea id="swal-descripcion" class="swal2-textarea" rows="3" style="width: 100%; margin: 0;">${incidencia.descripcion || ""}</textarea>
          </div>
          <div style="margin-bottom: 1rem;">
            <label style="display: block; font-weight: 600; margin-bottom: 0.5rem;">Estado</label>
            <select id="swal-estado" class="swal2-input" style="width: 100%; margin: 0;">
              ${estadosIncidencia.map(e =>
                `<option value="${e.value}" ${incidencia.estado === e.value ? "selected" : ""}>${e.label}</option>`
              ).join("")}
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
        const tipo = (document.getElementById("swal-tipo") as HTMLSelectElement).value;
        const gravedad = (document.getElementById("swal-gravedad") as HTMLSelectElement).value;
        const descripcion = (document.getElementById("swal-descripcion") as HTMLTextAreaElement).value;
        const estado = (document.getElementById("swal-estado") as HTMLSelectElement).value;
        if (!descripcion) {
          Swal.showValidationMessage("La descripción es obligatoria");
          return false;
        }
        return { tipo, gravedad, descripcion, estado };
      }
    });

    if (formValues) {
      try {
        await updateIncidencia(incidencia.incidenciaId, { ...incidencia, ...formValues });
        Swal.fire("Actualizado", "Incidencia modificada correctamente", "success");
        cargarDatos(filtros);
      } catch (error) {
        console.error("Error al actualizar incidencia:", error);
        Swal.fire("Error", "No se pudo actualizar la incidencia", "error");
      }
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0-2v2m0 4v2m-6-8h.01M6 15h.01M18 9h.01M18 15h.01M9 21h6a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm-4-8h14a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2z" />
            </svg>
          </div>
          <div>
            <h1 style={styles.title} className="gradient-text">Gestión de Incidencias</h1>
            <p style={styles.subtitle}>Administra las incidencias en tu flota de transporte</p>
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
            <h2 style={styles.searchTitle}>Buscar Incidencias</h2>
          </div>
        </div>
        
        <form onSubmit={handleBuscar}>
          <div style={styles.searchGrid}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Tipo</label>
              <select 
                value={filtros.tipo} 
                onChange={(e)=>setFiltros({...filtros, tipo:e.target.value})} 
                style={styles.select}
                className="input-focus"
              >
                <option value="">Todos</option>
                {tiposIncidencia.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Gravedad</label>
              <select 
                value={filtros.gravedad} 
                onChange={(e)=>setFiltros({...filtros, gravedad:e.target.value})} 
                style={styles.select}
                className="input-focus"
              >
                <option value="">Todas</option>
                {nivelesGravedad.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
              </select>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Estado</label>
              <select 
                value={filtros.estado} 
                onChange={(e)=>setFiltros({...filtros, estado:e.target.value})} 
                style={styles.select}
                className="input-focus"
              >
                <option value="">Todos</option>
                {estadosIncidencia.map(e => <option key={e.value} value={e.value}>{e.label}</option>)}
              </select>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Fecha Inicio</label>
              <input 
                type="date" 
                value={filtros.fechaInicio} 
                onChange={(e)=>setFiltros({...filtros, fechaInicio:e.target.value})} 
                style={styles.input}
                className="input-focus"
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Fecha Fin</label>
              <input 
                type="date" 
                value={filtros.fechaFin} 
                onChange={(e)=>setFiltros({...filtros, fechaFin:e.target.value})} 
                style={styles.input}
                className="input-focus"
              />
            </div>
          </div>
          <div style={styles.searchActions}>
            <button type="submit" style={styles.btnPrimary} className="btn-animated">
              <svg style={styles.btnIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Buscar
            </button>
            <button type="button" onClick={handleLimpiarFiltros} style={styles.btnOutline} className="btn-animated">
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
            <span>Mostrando <strong style={styles.countNumber}>{incidencias.length}</strong> incidencia(s)</span>
          </div>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <p style={styles.loadingText}>Cargando incidencias...</p>
        </div>
      ) : (
        <div style={{...styles.tableContainer, animation: 'fadeIn 0.6s ease-out 0.3s backwards'}} className="card-glow hover-lift">
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeaderRow}>
                  <th style={styles.th}>Asignación</th>
                  <th style={styles.th}>Fecha</th>
                  <th style={styles.th}>Tipo</th>
                  <th style={styles.th}>Gravedad</th>
                  <th style={styles.th}>Descripción</th>
                  <th style={styles.th}>Estado</th>
                  <th style={styles.th}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {incidencias.length > 0 ? (
                  incidencias.map((i, idx) => (
                    <tr key={i.incidenciaId} className="table-row" style={{...styles.tableRow, animation: `fadeIn 0.4s ease-out ${0.1 * idx}s backwards`}}>
                      <td style={styles.td}>
                        <strong style={styles.placaText}>{obtenerInfoAsignacion(i.asignacionId)}</strong>
                      </td>
                      <td style={styles.td}>{formatearFecha(i.fecha)}</td>
                      <td style={styles.td}>{obtenerEtiquetaTipo(i.tipo)}</td>
                      <td style={styles.td}>
                        <span style={getBadgeStyle(obtenerColorGravedad(i.gravedad))} className="badge-float">
                          {i.gravedad}
                        </span>
                      </td>
                      <td style={{...styles.td, maxWidth: "300px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{i.descripcion}</td>
                      <td style={styles.td}>
                        <span style={i.estado === 'Activo' ? styles.badgeSuccess : styles.badgeDanger} className="badge-float">
                          {i.estado}
                        </span>
                      </td>
                      <td style={styles.td}>
                        <button onClick={() => handleUpdate(i)} style={styles.btnEdit} className="btn-animated">
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
                    <td colSpan={7} style={styles.emptyTd}>
                      <div style={styles.emptyState}>
                        <svg style={styles.emptyIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <h3 style={styles.emptyTitle}>No hay incidencias registradas</h3>
                        <p style={styles.emptySubtitle}>Comienza registrando tu primera incidencia</p>
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
            <h2 style={styles.formTitle}>Registrar Nueva Incidencia</h2>
          </div>
        </div>
        <form onSubmit={handleCreate}>
          <div style={styles.formGrid}>
            <div style={styles.formGroup}>
              <label style={styles.labelRequired}>Asignación</label>
              <select 
                value={nueva.asignacionId} 
                onChange={(e)=>setNueva({...nueva, asignacionId:e.target.value})} 
                style={styles.select}
                className="input-focus"
                required
              >
                <option value="">Seleccionar asignación</option>
                {asignaciones
                  .filter(a => a.estado === "Activo")
                  .map((asignacion) => (
                    <option key={asignacion.asignacionId} value={asignacion.asignacionId}>
                      {obtenerInfoAsignacion(asignacion.asignacionId)}
                    </option>
                  ))}
              </select>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.labelRequired}>Fecha</label>
              <input 
                type="date" 
                value={nueva.fecha} 
                onChange={(e)=>setNueva({...nueva, fecha:e.target.value})} 
                style={styles.input}
                className="input-focus"
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.labelRequired}>Tipo</label>
              <select 
                value={nueva.tipo} 
                onChange={(e)=>setNueva({...nueva, tipo:e.target.value})} 
                style={styles.select}
                className="input-focus"
                required
              >
                <option value="">Seleccionar tipo</option>
                {tiposIncidencia.map(tipo => (
                  <option key={tipo.value} value={tipo.value}>{tipo.label}</option>
                ))}
              </select>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.labelRequired}>Gravedad</label>
              <select 
                value={nueva.gravedad} 
                onChange={(e)=>setNueva({...nueva, gravedad:e.target.value})} 
                style={styles.select}
                className="input-focus"
                required
              >
                <option value="">Seleccionar gravedad</option>
                {nivelesGravedad.map(nivel => (
                  <option key={nivel.value} value={nivel.value}>{nivel.label}</option>
                ))}
              </select>
            </div>
            <div style={{...styles.formGroup, gridColumn: "span 2" }}>
              <label style={styles.labelRequired}>Descripción</label>
              <textarea
                placeholder="Describe detalladamente la incidencia..."
                value={nueva.descripcion}
                onChange={(e) => setNueva({ ...nueva, descripcion: e.target.value })}
                style={{...styles.input, height: 'auto', resize: 'vertical'}}
                className="input-focus"
                required
                rows={4}
              />
            </div>
          </div>
          <div style={styles.btnGroup}>
            <button type="submit" style={styles.btnSuccess} className="btn-animated">
              <svg style={styles.btnIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
              Guardar Incidencia
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const getBadgeStyle = (className) => {
  switch (className) {
    case "badge-danger": return styles.badgeDanger;
    case "badge-warning": return styles.badgeWarning;
    case "badge-info": return styles.badgeInfo;
    case "badge-secondary": return styles.badgeSecondary;
    default: return styles.badgeSecondary;
  }
};

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
  badgeWarning: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '0.5rem 1rem',
    background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
    color: 'white',
    borderRadius: '9999px',
    fontSize: '0.875rem',
    fontWeight: '600',
    boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
  },
  badgeInfo: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '0.5rem 1rem',
    background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
    color: 'white',
    borderRadius: '9999px',
    fontSize: '0.875rem',
    fontWeight: '600',
    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
  },
  badgeSecondary: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '0.5rem 1rem',
    background: 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)',
    color: 'white',
    borderRadius: '9999px',
    fontSize: '0.875rem',
    fontWeight: '600',
    boxShadow: '0 4px 12px rgba(107, 114, 128, 0.3)',
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
};