using System;
using System.Threading.Tasks;
using Domain.Entities;
using Domain.Interfaces;

namespace Application.UseCase.RolesUseCase
{
    public class CrearRolUseCase
    {
        private readonly IRolesRepository _rolesRepository;

        public CrearRolUseCase(IRolesRepository rolesRepository)
        {
            _rolesRepository = rolesRepository;
        }

        public async Task EjecutarAsync(Roles rol)
        {
            ValidarRol(rol);
            await _rolesRepository.CrearAsync(rol);
        }

        private void ValidarRol(Roles rol)
        {
            if (rol == null)
                throw new ArgumentNullException(nameof(rol), "El rol no puede ser nulo.");

            if (string.IsNullOrWhiteSpace(rol.Nombre))
                throw new ArgumentException("El nombre del rol no puede estar vacío.");
        }
    }
}
