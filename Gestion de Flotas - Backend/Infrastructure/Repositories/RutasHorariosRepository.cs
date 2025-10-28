using Domain.Entities;
using Domain.Enums;
using Domain.Interfaces;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories
{
    public class RutasHorariosRepository : IRutasHorariosRepository
    {
        private readonly AppDbContext _context;

        public RutasHorariosRepository(AppDbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        public async Task<RutasHorarios> CrearRutaHorarioAsync(RutasHorarios rutaHorario)
        {
            if (rutaHorario == null) throw new ArgumentNullException(nameof(rutaHorario));
            _context.RutasHorarios.Add(rutaHorario);
            await _context.SaveChangesAsync();
            return rutaHorario;
        }

        public async Task<IEnumerable<RutasHorarios>> ListarRutasHorariosAsync()
        {
            return await _context.RutasHorarios
                .ToListAsync();
        }

        public async Task<RutasHorarios?> RutaHorarioPorNombreAsync(string nombre)
        {
            if (string.IsNullOrWhiteSpace(nombre))
                return null;

            return await _context.RutasHorarios
                .FirstOrDefaultAsync(r => r.Nombre.ToLowerInvariant() == nombre.ToLowerInvariant());
        }

        public async Task<RutasHorarios> EditarRutaHorarioAsync(RutasHorarios rutaHorario)
        {
            if (rutaHorario == null) throw new ArgumentNullException(nameof(rutaHorario));

            var existingRuta = await _context.RutasHorarios.FindAsync(rutaHorario.RutaHorarioId);
            if (existingRuta == null)
                throw new KeyNotFoundException($"Ruta con ID {rutaHorario.RutaHorarioId} no encontrada.");

            _context.Entry(existingRuta).CurrentValues.SetValues(rutaHorario);
            await _context.SaveChangesAsync();
            return rutaHorario;
        }

        public async Task<IEnumerable<RutasHorarios>> BuscarRutasHorariosAsync(
            string? nombre = null,
            string? origen = null,
            string? destino = null,
            string? dias = null,
            RutasHorariosEnums? estado = null)
        {
            var query = _context.RutasHorarios.AsQueryable();

            if (!string.IsNullOrWhiteSpace(nombre))
                query = query.Where(r => EF.Functions.Like(r.Nombre, $"%{nombre}%"));

            if (!string.IsNullOrWhiteSpace(origen))
                query = query.Where(r => EF.Functions.Like(r.Origen!, $"%{origen}%"));

            if (!string.IsNullOrWhiteSpace(destino))
                query = query.Where(r => EF.Functions.Like(r.Destino!, $"%{destino}%"));

            if (!string.IsNullOrWhiteSpace(dias))
                query = query.Where(r => EF.Functions.Like(r.Dias!, $"%{dias}%"));

            if (estado.HasValue)
                query = query.Where(r => r.Estado == estado.Value);

            return await query.ToListAsync();
        }
    }
}
