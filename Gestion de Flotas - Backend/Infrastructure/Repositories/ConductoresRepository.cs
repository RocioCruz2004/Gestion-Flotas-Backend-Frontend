using Domain.Entities;
using Domain.Enums;
using Domain.Interfaces;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories
{
    public class ConductoresRepository : IConductoresRepository
    {
        private readonly AppDbContext _context;

        public ConductoresRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Conductores> CrearConductorAsync(Conductores conductor)
        {
            _context.Conductores.Add(conductor);
            await _context.SaveChangesAsync();
            return conductor;
        }

        public async Task<IEnumerable<Conductores>> ListarConductoresAsync()
        {
            return await _context.Conductores.ToListAsync();
        }

        public async Task<Conductores?> ConductorPorIdAsync(Guid id)
        {
            return await _context.Conductores.FirstOrDefaultAsync(c => c.ConductorId == id);
        }

        public async Task<Conductores> EditarConductorAsync(Conductores conductor)
        {
            var conductorExistente = await _context.Conductores.FindAsync(conductor.ConductorId);

            if (conductorExistente == null)
                throw new KeyNotFoundException($"No se encontró el conductor con ID {conductor.ConductorId}");

            _context.Entry(conductorExistente).CurrentValues.SetValues(conductor);
            await _context.SaveChangesAsync();
            return conductor;
        }

        public async Task<IEnumerable<Conductores>> BuscarConductoresAsync(string? nombre, string? cedula, string? licencia, ConductoresEnums? estado)
        {
            var query = _context.Conductores.AsQueryable();

            if (!string.IsNullOrWhiteSpace(nombre))
                query = query.Where(c => c.Nombre.Contains(nombre));

            if (!string.IsNullOrWhiteSpace(cedula))
                query = query.Where(c => c.Cedula != null && c.Cedula.Contains(cedula));

            if (!string.IsNullOrWhiteSpace(licencia))
                query = query.Where(c => c.Licencia != null && c.Licencia.Contains(licencia));

            if (estado.HasValue)
                query = query.Where(c => c.Estado == estado.Value);

            return await query.ToListAsync();
        }
    }
}
