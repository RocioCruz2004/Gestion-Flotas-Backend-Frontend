using System;
using System.Threading.Tasks;
using Domain.Entities;
using Domain.Interfaces;

namespace Application.UseCase.RolesUseCase
{
    public class EditarRolUseCase
    {
        private readonly IRolesRepository _rolesRepository;

        public EditarRolUseCase(IRolesRepository rolesRepository)
        {
            _rolesRepository = rolesRepository;
        }

        public async Task EjecutarAsync(Roles rol)
        {
            ValidarRol(rol);
            await _rolesRepository.ActualizarAsync(rol);
        }

        private void ValidarRol(Roles rol)
        {
            if (rol == null)
                throw new ArgumentNullException(nameof(rol), "El rol no puede ser nulo.");

            if (rol.RolId == Guid.Empty)
                throw new ArgumentException("El ID del rol no es válido.");

            if (string.IsNullOrWhiteSpace(rol.Nombre))
                throw new ArgumentException("El nombre del rol no puede estar vacío.");
        }
    }
}
