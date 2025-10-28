using Domain.Entities;
using Domain.Interfaces;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories
{
   public class RolesRepository : IRolesRepository
    {
        private readonly AppDbContext _context;

        public RolesRepository(AppDbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        public async Task<Roles> ObtenerId(Guid id)
        {
            return await _context.Roles
                .FirstOrDefaultAsync(r => r.RolId == id)
                ?? throw new KeyNotFoundException($"Rol con ID {id} no encontrado.");
        }

        public async Task<IEnumerable<Roles>> ListarTodosAsync()
        {
            return await _context.Roles
                .ToListAsync();
        }

        public async Task CrearAsync(Roles rol)
        {
            if (rol == null) throw new ArgumentNullException(nameof(rol));
            _context.Roles.Add(rol);
            await _context.SaveChangesAsync();
        }

        public async Task ActualizarAsync(Roles rol)
        {
            if (rol == null) throw new ArgumentNullException(nameof(rol));
            var existingRol = await _context.Roles.FindAsync(rol.RolId);
            if (existingRol == null) throw new KeyNotFoundException($"Rol con ID {rol.RolId} no encontrado.");

            _context.Entry(existingRol).CurrentValues.SetValues(rol);
            await _context.SaveChangesAsync();
        }
    }
}