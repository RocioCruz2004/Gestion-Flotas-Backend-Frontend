using Domain.Entities;
using Domain.Interfaces;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories
{
    public class AsignacionesRutasRepository : IAsignacionesRutasRepository
    {
        private readonly AppDbContext _context;

        public AsignacionesRutasRepository(AppDbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        public async Task<AsignacionesRutas> CrearAsignacionAsync(AsignacionesRutas asignacion)
        {
            if (asignacion == null) throw new ArgumentNullException(nameof(asignacion));
            
            // Validar que las entidades relacionadas existan
            var unidadConductor = await _context.UnidadesConductores
                .AnyAsync(uc => uc.UnidadConductorId == asignacion.UnidadConductorId);
            if (!unidadConductor)
                throw new KeyNotFoundException($"UnidadConductor con ID {asignacion.UnidadConductorId} no encontrada.");

            var rutaHorario = await _context.RutasHorarios
                .AnyAsync(rh => rh.RutaHorarioId == asignacion.RutaHorarioId);
            if (!rutaHorario)
                throw new KeyNotFoundException($"RutaHorario con ID {asignacion.RutaHorarioId} no encontrada.");

            _context.AsignacionesRutas.Add(asignacion);
            await _context.SaveChangesAsync();
            return asignacion;
        }

        public async Task<IEnumerable<AsignacionesRutas>> ListarAsignacionesAsync()
        {
            return await _context.AsignacionesRutas
                .Include(a => a.UnidadConductor)
                .Include(a => a.RutaHorario)
                .ToListAsync();
        }

        public async Task<AsignacionesRutas> EditarAsignacionAsync(AsignacionesRutas asignacion)
        {
            if (asignacion == null) throw new ArgumentNullException(nameof(asignacion));
            
            var existingAsignacion = await _context.AsignacionesRutas
                .Include(a => a.UnidadConductor)
                .Include(a => a.RutaHorario)
                .FirstOrDefaultAsync(a => a.AsignacionId == asignacion.AsignacionId);

            if (existingAsignacion == null)
                throw new KeyNotFoundException($"Asignación con ID {asignacion.AsignacionId} no encontrada.");

            // Actualizar propiedades escalares
            _context.Entry(existingAsignacion).CurrentValues.SetValues(asignacion);
            
            // Actualizar propiedades de navegación si cambian
            if (asignacion.UnidadConductorId != existingAsignacion.UnidadConductorId)
            {
                var nuevaUnidadConductor = await _context.UnidadesConductores
                    .AnyAsync(uc => uc.UnidadConductorId == asignacion.UnidadConductorId);
                if (!nuevaUnidadConductor)
                    throw new KeyNotFoundException($"Nueva UnidadConductor con ID {asignacion.UnidadConductorId} no encontrada.");
                
                existingAsignacion.UnidadConductorId = asignacion.UnidadConductorId;
            }

            if (asignacion.RutaHorarioId != existingAsignacion.RutaHorarioId)
            {
                var nuevaRutaHorario = await _context.RutasHorarios
                    .AnyAsync(rh => rh.RutaHorarioId == asignacion.RutaHorarioId);
                if (!nuevaRutaHorario)
                    throw new KeyNotFoundException($"Nueva RutaHorario con ID {asignacion.RutaHorarioId} no encontrada.");
                
                existingAsignacion.RutaHorarioId = asignacion.RutaHorarioId;
            }

            await _context.SaveChangesAsync();
            return asignacion;
        }
    }
}