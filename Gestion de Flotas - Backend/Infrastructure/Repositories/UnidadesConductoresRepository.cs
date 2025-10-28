using Domain.Entities;
using Domain.Enums;
using Domain.Interfaces;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories
{
    public class UnidadesConductoresRepository : IUnidadesConductoresRepository
    {
        private readonly AppDbContext _context;

        public UnidadesConductoresRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task CrearUnidadConductorAsync(UnidadesConductores unidadesConductores)
        {
            _context.UnidadesConductores.Add(unidadesConductores);
            await _context.SaveChangesAsync();
        }

        public async Task ActualizarUnidadConductorAsync(UnidadesConductores unidadesConductores)
        {
            var registroExistente = await _context.UnidadesConductores
                .FirstOrDefaultAsync(uc => uc.UnidadConductorId == unidadesConductores.UnidadConductorId);

            if (registroExistente == null)
                throw new KeyNotFoundException($"No se encontró el registro con ID {unidadesConductores.UnidadConductorId}");

            _context.Entry(registroExistente).CurrentValues.SetValues(unidadesConductores);
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<UnidadesConductores>> ListarUnidadesConductoresAsync()
        {
            return await _context.UnidadesConductores
                .Include(uc => uc.Unidad)
                .Include(uc => uc.Conductor)
                .ToListAsync();
        }

        public async Task<bool> ExisteActivoAsync(Guid unidadId, Guid conductorId)
        {
            return await _context.UnidadesConductores
                .AnyAsync(uc =>
                    (uc.UnidadId == unidadId || uc.ConductorId == conductorId) &&
                    uc.Estado == UnidadesConductoresEnums.Activo);
        }
    }
}
