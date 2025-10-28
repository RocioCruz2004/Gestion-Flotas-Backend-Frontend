import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { getUsuarios, createUsuario, updateUsuario, searchUsuarios } from "../services/usuariosService";
import { getRoles } from "../services/rolesService";

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [nuevo, setNuevo] = useState({ nombre: "", email: "", contrasena: "", rolId: "" });
  const [loading, setLoading] = useState(false);
  
  const [filtros, setFiltros] = useState({
    nombre: "",
    email: "",
    rolId: "",
    estado: ""
  });

 const cargarUsuarios = async (filters) => {
    setLoading(true);
    try {
      const data = await getUsuarios(filters && Object.keys(filters).some(k => filters[k]) ? filters : undefined);
      
      let usuariosFiltrados = data;
      if (filters && Object.keys(filters).some(k => filters[k] !== undefined && String(filters[k]).trim() !== '')) {
        const { nombre, email, rolId, estado } = filters;
        usuariosFiltrados = (data || []).filter((u) => {
          let ok = true;
          if (nombre && String(nombre).trim() !== '') {
            ok = ok && String(u.nombre || '').toLowerCase().includes(String(nombre).toLowerCase());
          }
          if (email && String(email).trim() !== '') {
            ok = ok && String(u.email || '').toLowerCase().includes(String(email).toLowerCase());
          }
          if (rolId && String(rolId).trim() !== '') {
            const uRol = u.rolId ?? u.id ?? u.roleId ?? '';
            ok = ok && String(uRol) === String(rolId);
          }
          if (estado && String(estado).trim() !== '') {
            ok = ok && String((u.estado || 'Activo')).toLowerCase() === String(estado).toLowerCase();
          }
          return ok;
        });
      }
      setUsuarios(usuariosFiltrados);
    } catch (error) {
      console.error("Error cargando usuarios:", error);
      Swal.fire("Error", "No se pudo obtener la lista de usuarios", "error");
    } finally {
      setLoading(false);
    }
  };

  const cargarRoles = async () => {
    try {
      const data = await getRoles();
      setRoles(data);
    } catch (error) {
      console.error("Error cargando roles:", error);
      Swal.fire("Error", "No se pudieron cargar los roles", "error");
    }
  };

  useEffect(() => {
    cargarUsuarios();
    cargarRoles();
  }, []);

  const handleBuscar = async () => {
    try {
      const hayFiltros = Object.values(filtros).some(v => v !== undefined && String(v).trim() !== '');
      if (!hayFiltros) {
        return cargarUsuarios();
      }
      const resultados = await searchUsuarios(filtros);
      setUsuarios(resultados || []);
    } catch (error) {
      console.error('Error en búsqueda de usuarios:', error);
      try {
        const data = await getUsuarios();
        const { nombre, email, rolId, estado } = filtros;
        const usuariosFiltrados = (data || []).filter((u) => {
          let ok = true;
          if (nombre && String(nombre).trim() !== '') {
            ok = ok && String(u.nombre || '').toLowerCase().includes(String(nombre).toLowerCase());
          }
          if (email && String(email).trim() !== '') {
            ok = ok && String(u.email || '').toLowerCase().includes(String(email).toLowerCase());
          }
          if (rolId && String(rolId).trim() !== '') {
            const uRol = u.rolId ?? u.id ?? u.roleId ?? '';
            ok = ok && String(uRol) === String(rolId);
          }
          if (estado && String(estado).trim() !== '') {
            ok = ok && String((u.estado || 'Activo')).toLowerCase() === String(estado).toLowerCase();
          }
          return ok;
        });
        setUsuarios(usuariosFiltrados);
      } catch (e) {
        console.error('Error en fallback de búsqueda:', e);
      }
    }
  };

  const handleLimpiarFiltros = () => {
    setFiltros({
      nombre: "",
      email: "",
      rolId: "",
      estado: ""
    });
    cargarUsuarios();
  };

  const obtenerNombreRol = (rolId) => {
    if (!rolId) return "Sin rol";
    const rol = roles.find(r => 
      r.rolId === rolId || 
      r.rolId === parseInt(rolId) || 
      r.id === rolId ||
      r.id === parseInt(rolId)
    );
    return rol ? rol.nombre : `Rol ID: ${rolId}`;
  };

  const obtenerEstado = (estado) => {
    return estado || "Activo";
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!nuevo.nombre || !nuevo.email || !nuevo.contrasena || !nuevo.rolId) {
      return Swal.fire("Campos incompletos", "Debes llenar todos los campos", "warning");
    }

    try {
      await createUsuario(nuevo);
      setNuevo({ nombre: "", email: "", contrasena: "", rolId: "" });
      cargarUsuarios(filtros);
      Swal.fire("Éxito", "Usuario creado correctamente", "success");
    } catch (error) {
      console.error("Error creando usuario:", error);
      Swal.fire("Error", "No se pudo registrar el usuario", "error");
    }
  };

  const handleUpdate = async (u) => {
    const usuarioId = u.usuarioId || u.id;
    
    if (!usuarioId) {
      console.error("No se pudo obtener el ID del usuario:", u);
      return Swal.fire("Error", "No se pudo identificar el usuario", "error");
    }

    const { value: formValues } = await Swal.fire({
      title: "Editar Usuario",
      html: `
        <div style="text-align: left;">
          <div style="margin-bottom: 1rem;">
            <label style="display: block; font-weight: 600; margin-bottom: 0.5rem;">Nombre</label>
            <input id="swal-nombre" class="swal2-input" style="width: 100%; margin: 0;" placeholder="Nombre" value="${u.nombre || ''}" required>
          </div>
          <div style="margin-bottom: 1rem;">
            <label style="display: block; font-weight: 600; margin-bottom: 0.5rem;">Correo electrónico</label>
            <input id="swal-email" class="swal2-input" style="width: 100%; margin: 0;" placeholder="Correo electrónico" type="email" value="${u.email || ''}" required>
          </div>
          <div style="margin-bottom: 1rem;">
            <label style="display: block; font-weight: 600; margin-bottom: 0.5rem;">Nueva contraseña (opcional)</label>
            <input id="swal-contrasena" class="swal2-input" style="width: 100%; margin: 0;" placeholder="Dejar vacío para mantener actual" type="password">
          </div>
          <div style="margin-bottom: 1rem;">
            <label style="display: block; font-weight: 600; margin-bottom: 0.5rem;">Rol</label>
            <select id="swal-rolId" class="swal2-input" style="width: 100%; margin: 0;">
              <option value="">Seleccionar rol</option>
              ${roles.map(rol => 
                `<option value="${rol.rolId || rol.id}" ${(u.rolId === rol.rolId || u.rolId === rol.id) ? 'selected' : ''}>${rol.nombre}</option>`
              ).join('')}
            </select>
          </div>
          <div style="margin-bottom: 1rem;">
            <label style="display: block; font-weight: 600; margin-bottom: 0.5rem;">Estado</label>
            <select id="swal-estado" class="swal2-input" style="width: 100%; margin: 0;">
              <option value="Activo" ${(u.estado === 'Activo' || !u.estado) ? 'selected' : ''}>Activo</option>
              <option value="Inactivo" ${u.estado === 'Inactivo' ? 'selected' : ''}>Inactivo</option>
            </select>
          </div>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Guardar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#88e788",
      width: '600px',
      preConfirm: () => {
        const nombre = document.getElementById('swal-nombre').value;
        const email = document.getElementById('swal-email').value;
        const contrasena = document.getElementById('swal-contrasena').value;
        const rolId = document.getElementById('swal-rolId').value;
        const estado = document.getElementById('swal-estado').value;

        if (!nombre || !email || !rolId || !estado) {
          Swal.showValidationMessage('Todos los campos son obligatorios');
          return false;
        }

        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          Swal.showValidationMessage('Ingresa un correo electrónico válido');
          return false;
        }

        return {
          nombre,
          email,
          contrasena: contrasena || undefined,
          rolId,
          estado
        };
      }
    });

    if (formValues) {
      try {
        const datosActualizacion = {
          nombre: formValues.nombre,
          email: formValues.email,
          rolId: formValues.rolId,
          estado: formValues.estado
        };

        if (formValues.contrasena && formValues.contrasena.trim() !== '') {
          datosActualizacion.contrasena = formValues.contrasena;
        }

        await updateUsuario(usuarioId, datosActualizacion);
        cargarUsuarios(filtros);
      } catch (error) {
        console.error("Error en handleUpdate:", error);
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

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }

        .gradient-text {
          background: linear-gradient(135deg, #ffffff 0%, #ffffff 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .card-glow {
          box-shadow: 0 0 40px rgba(136, 231, 136, 0.15);
        }
      `}</style>

      {/* Header */}
      <div style={{...styles.header, animation: 'fadeIn 0.6s ease-out'}}>
        <div style={styles.headerContent}>
          <div style={styles.iconContainer}>
            <svg style={styles.headerIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13.5 3.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          </div>
          <div>
            <h1 style={styles.title} className="gradient-text">Gestión de Usuarios</h1>
            <p style={styles.subtitle}>Administra los usuarios y sus permisos</p>
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
            <h2 style={styles.searchTitle}>Buscar Usuarios</h2>
          </div>
        </div>
        
        <div style={styles.searchGrid}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Nombre</label>
            <input
              type="text"
              placeholder="Buscar por nombre"
              value={filtros.nombre}
              onChange={(e) => setFiltros({...filtros, nombre: e.target.value})}
              style={styles.input}
              className="input-focus"
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              placeholder="Buscar por email"
              value={filtros.email}
              onChange={(e) => setFiltros({...filtros, email: e.target.value})}
              style={styles.input}
              className="input-focus"
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Rol</label>
            <select
              value={filtros.rolId}
              onChange={(e) => setFiltros({...filtros, rolId: e.target.value})}
              style={styles.select}
              className="input-focus"
            >
              <option value="">Todos los roles</option>
              {roles.map((rol) => (
                <option key={rol.rolId || rol.id} value={rol.rolId || rol.id}>
                  {rol.nombre}
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
        <div style={{...styles.resultsCount, animation: 'fadeIn 0.6s ease-out 0.2s backwards'}}>
          <div style={styles.countBadge}>
            <svg style={styles.countIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span>Mostrando <strong style={styles.countNumber}>{usuarios.length}</strong> usuario(s)
            {(filtros.nombre || filtros.email || filtros.rolId || filtros.estado) && " con filtros aplicados"}</span>
          </div>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <p style={styles.loadingText}>Cargando usuarios...</p>
        </div>
      ) : (
        <div style={{...styles.tableContainer, animation: 'fadeIn 0.6s ease-out 0.3s backwards'}} className="card-glow hover-lift">
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeaderRow}>
                  <th style={styles.th}>Nombre</th>
                  <th style={styles.th}>Correo</th>
                  <th style={styles.th}>Rol</th>
                  <th style={styles.th}>Estado</th>
                  <th style={styles.th}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.length > 0 ? (
                  usuarios.map((u, idx) => (
                    <tr key={u.usuarioId || u.id} className="table-row" style={{...styles.tableRow, animation: `fadeIn 0.4s ease-out ${0.1 * idx}s backwards`}}>
                      <td style={styles.td}>
                        <div style={styles.userNameContainer}>
                          <div style={styles.avatar}>
                            {u.nombre?.charAt(0)?.toUpperCase() || 'U'}
                          </div>
                          <strong style={styles.userName}>{u.nombre}</strong>
                        </div>
                      </td>
                      <td style={styles.td}>
                        <div style={styles.emailContainer}>
                          <svg style={styles.emailIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          {u.email}
                        </div>
                      </td>
                      <td style={styles.td}>
                        <div style={styles.roleContainer}>
                          <svg style={styles.roleIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                          {obtenerNombreRol(u.rolId)}
                        </div>
                      </td>
                      <td style={styles.td}>
                        <span style={(u.estado === 'Activo' || !u.estado) ? styles.badgeSuccess : styles.badgeDanger}>
                          {obtenerEstado(u.estado)}
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
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                        </svg>
                        <h3 style={styles.emptyTitle}>No se encontraron usuarios</h3>
                        <p style={styles.emptySubtitle}>
                          {(filtros.nombre || filtros.email || filtros.rolId || filtros.estado) 
                            ? "Intenta con otros criterios de búsqueda" 
                            : "No hay usuarios registrados en el sistema"}
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
      <div style={{...styles.formContainer, animation: 'fadeIn 0.6s ease-out 0.4s backwards'}} className="card-glow hover-lift">
        <div style={styles.formHeader}>
          <div style={styles.formTitleContainer}>
            <svg style={styles.formIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            <div>
              <h2 style={styles.formTitle}>Registrar Nuevo Usuario</h2>
              <p style={styles.formSubtitle}>Completa todos los campos para agregar un usuario</p>
            </div>
          </div>
        </div>
        <div onSubmit={handleCreate}>
          <div style={styles.formGrid}>
            <div style={styles.formGroup}>
              <label style={styles.labelRequired}>Nombre *</label>
              <input
                type="text"
                placeholder="Nombre completo"
                value={nuevo.nombre}
                onChange={(e) => setNuevo({ ...nuevo, nombre: e.target.value })}
                style={styles.input}
                className="input-focus"
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.labelRequired}>Correo *</label>
              <input
                type="email"
                placeholder="correo@ejemplo.com"
                value={nuevo.email}
                onChange={(e) => setNuevo({ ...nuevo, email: e.target.value })}
                style={styles.input}
                className="input-focus"
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.labelRequired}>Contraseña *</label>
              <input
                type="password"
                placeholder="Contraseña segura"
                value={nuevo.contrasena}
                onChange={(e) => setNuevo({ ...nuevo, contrasena: e.target.value })}
                style={styles.input}
                className="input-focus"
                required
              />
              <span style={styles.formHint}>Mínimo 8 caracteres</span>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.labelRequired}>Rol *</label>
              <select
                value={nuevo.rolId}
                onChange={(e) => setNuevo({ ...nuevo, rolId: e.target.value })}
                style={styles.select}
                className="input-focus"
                required
              >
                <option value="">Seleccionar rol</option>
                {roles.map((rol) => (
                  <option key={rol.rolId || rol.id} value={rol.rolId || rol.id}>
                    {rol.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div style={styles.btnGroup}>
            <button onClick={handleCreate} style={styles.btnSuccess} className="btn-animated">
              <svg style={styles.btnIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              Guardar Usuario
            </button>
          </div>
        </div>
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
    color: 'white',
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
  userNameContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #88e788 0%, #4ade80 100%)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1rem',
    fontWeight: '700',
    boxShadow: '0 4px 12px rgba(136, 231, 136, 0.3)',
  },
  userName: {
    color: '#1a1a1a',
    fontSize: '1.05rem',
  },
  emailContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: '#6b7280',
  },
  emailIcon: {
    width: '18px',
    height: '18px',
    color: '#88e788',
  },
  roleContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  roleIcon: {
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
    flexShrink: 0,
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
    margin: '0.25rem 0 0 0',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem',
  },
  formHint: {
    fontSize: '0.8rem',
    color: '#9ca3af',
    fontStyle: 'italic',
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