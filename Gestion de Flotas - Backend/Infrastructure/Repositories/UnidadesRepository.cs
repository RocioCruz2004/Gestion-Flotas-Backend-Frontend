using Domain.Entities;
using Domain.Enums;
using Domain.Interfaces;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories
{
    public class UnidadesRepository : IUnidadesRepository
    {
        private readonly AppDbContext _context;

        public UnidadesRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Unidades> CrearUsuarioAsync(Unidades unidad)
        {
            _context.Unidades.Add(unidad);
            await _context.SaveChangesAsync();
            return unidad;
        }

        public async Task<IEnumerable<Unidades>> ListarUsuariosAsync()
        {
            return await _context.Unidades.ToListAsync();
        }

        public async Task<Unidades> UsuarioPorIdAsync(Guid id)
        {
            var unidad = await _context.Unidades.FirstOrDefaultAsync(u => u.UnidadId == id);
            if (unidad == null)
                throw new KeyNotFoundException($"No se encontró la unidad con ID {id}");

            return unidad;
        }

        public async Task<Unidades> EditarUsuarioAsync(Unidades unidad)
        {
            var unidadExistente = await _context.Unidades.FindAsync(unidad.UnidadId);
            if (unidadExistente == null)
                throw new KeyNotFoundException($"No se encontró la unidad con ID {unidad.UnidadId}");

            _context.Entry(unidadExistente).CurrentValues.SetValues(unidad);
            await _context.SaveChangesAsync();
            return unidad;
        }

        // 🔹 Nuevo método con LINQ flexible
        public async Task<IEnumerable<Unidades>> BuscarUnidadesAsync(
            string? placa,
            string? modelo,
            int? minCapacidad,
            int? maxCapacidad,
            UnidadesEnums? estado)
        {
            var query = _context.Unidades.AsQueryable();

            if (!string.IsNullOrWhiteSpace(placa))
                query = query.Where(u => u.Placa.Contains(placa));

            if (!string.IsNullOrWhiteSpace(modelo))
                query = query.Where(u => u.Modelo != null && u.Modelo.Contains(modelo));

            if (minCapacidad.HasValue)
                query = query.Where(u => u.Capacidad >= minCapacidad.Value);

            if (maxCapacidad.HasValue)
                query = query.Where(u => u.Capacidad <= maxCapacidad.Value);

            if (estado.HasValue)
                query = query.Where(u => u.Estado == estado.Value);

            return await query.ToListAsync();
        }
    }
}
