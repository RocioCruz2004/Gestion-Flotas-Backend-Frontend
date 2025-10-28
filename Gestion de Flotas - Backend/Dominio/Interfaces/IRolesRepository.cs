using Domain.Entities;

namespace Domain.Interfaces
{
   public interface IRolesRepository
{
    Task<Roles> ObtenerId(Guid id);
    Task<IEnumerable<Roles>> ListarTodosAsync();
    Task CrearAsync(Roles rol);
    Task ActualizarAsync(Roles rol);

    }
}
