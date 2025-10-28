using System.Collections.Generic;
using System.Threading.Tasks;
using Domain.Entities;
using Domain.Interfaces;

namespace Application.UseCase.RolesUseCase
{
    public class ListarRolesUseCase
    {
        private readonly IRolesRepository _rolesRepository;

        public ListarRolesUseCase(IRolesRepository rolesRepository)
        {
            _rolesRepository = rolesRepository;
        }

        public async Task<IEnumerable<Roles>> EjecutarAsync()
        {
            var roles = await _rolesRepository.ListarTodosAsync();

            if (roles == null)
                throw new KeyNotFoundException("No se encontraron roles registrados.");

            return roles;
        }
    }
}
