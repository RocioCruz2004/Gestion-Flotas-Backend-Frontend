using Domain.Entities;
using Domain.Interfaces;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories
{
    public class IncidenciasRepository : IIncidenciasRepository
    {
        private readonly AppDbContext _context;

        public IncidenciasRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Incidencias>> ListarTodosAsync()
        {
            return await _context.Incidencias
                .Include(i => i.AsignacionRuta)
                .ToListAsync();
        }

        public async Task CrearAsync(Incidencias incidencia)
        {
            _context.Incidencias.Add(incidencia);
            await _context.SaveChangesAsync();
        }

        public async Task ActualizarAsync(Incidencias incidencia)
        {
            var incidenciaExistente = await _context.Incidencias
                .FirstOrDefaultAsync(i => i.IncidenciaId == incidencia.IncidenciaId);

            if (incidenciaExistente == null)
                throw new KeyNotFoundException($"No se encontró la incidencia con ID {incidencia.IncidenciaId}");

            _context.Entry(incidenciaExistente).CurrentValues.SetValues(incidencia);
            await _context.SaveChangesAsync();
        }
    }
}
