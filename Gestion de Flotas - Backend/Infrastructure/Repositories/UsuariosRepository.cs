using Domain.Entities;
using Domain.Enums;
using Domain.Interfaces;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories
{
    public class UsuariosRepository : IUsuariosRepository
    {
        private readonly AppDbContext _context;

        public UsuariosRepository(AppDbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        public async Task<Usuarios> CrearUsuarioAsync(Usuarios usuarios)
        {
            if (usuarios == null) throw new ArgumentNullException(nameof(usuarios));
            _context.Usuarios.Add(usuarios);
            await _context.SaveChangesAsync();
            return usuarios;
        }

        public async Task<IEnumerable<Usuarios>> ListarUsuariosAsync()
        {
            return await _context.Usuarios
                .Include(u => u.Rol)
                .ToListAsync();
        }

        public async Task<Usuarios> UsuarioPorIdAsync(Guid id)
        {
            return await _context.Usuarios
                .Include(u => u.Rol)
                .FirstOrDefaultAsync(u => u.UsuarioId == id)
                ?? throw new KeyNotFoundException($"Usuario con ID {id} no encontrado.");
        }

        public async Task<Usuarios> UsuarioPorNombreAsync(string nombre)
        {
            if (string.IsNullOrWhiteSpace(nombre)) throw new ArgumentException("El nombre no puede estar vacío.", nameof(nombre));
            return await _context.Usuarios
                .Include(u => u.Rol)
                .FirstOrDefaultAsync(u => u.Nombre == nombre)
                ?? throw new KeyNotFoundException($"Usuario con nombre {nombre} no encontrado.");
        }

        public async Task<Usuarios> EditarUsuarioAsync(Usuarios usuarios)
        {
            if (usuarios == null) throw new ArgumentNullException(nameof(usuarios));
            var existingUsuario = await _context.Usuarios.FindAsync(usuarios.UsuarioId);
            if (existingUsuario == null) throw new KeyNotFoundException($"Usuario con ID {usuarios.UsuarioId} no encontrado.");

            _context.Entry(existingUsuario).CurrentValues.SetValues(usuarios);
            await _context.SaveChangesAsync();
            return usuarios;
        }

        public async Task<IEnumerable<Usuarios>> BuscarUsuariosAsync(string? nombre = null, string? email = null, Guid? rolId = null, UsuariosEnums? estado = null)
        {
            var query = _context.Usuarios
                .Include(u => u.Rol)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(nombre))
                query = query.Where(u => EF.Functions.Like(u.Nombre, $"%{nombre}%"));

            if (!string.IsNullOrWhiteSpace(email))
                query = query.Where(u => EF.Functions.Like(u.Email, $"%{email}%"));

            if (rolId.HasValue)
                query = query.Where(u => u.RolId == rolId.Value);

            if (estado.HasValue)
                query = query.Where(u => u.Estado == estado.Value);

            return await query.ToListAsync();
        }
    }
}
