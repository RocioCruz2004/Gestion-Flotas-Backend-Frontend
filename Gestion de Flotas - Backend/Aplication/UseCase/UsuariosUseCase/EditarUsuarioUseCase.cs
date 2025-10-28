using System;
using System.Threading.Tasks;
using Domain.Entities;
using Domain.Interfaces;

namespace Application.UseCase.UsuariosUseCase
{
    public class EditarUsuarioUseCase
    {
        private readonly IUsuariosRepository _usuariosRepository;

        public EditarUsuarioUseCase(IUsuariosRepository usuariosRepository)
        {
            _usuariosRepository = usuariosRepository;
        }

        public async Task EjecutarAsync(Usuarios usuario)
        {
            ValidarUsuario(usuario);
            await _usuariosRepository.EditarUsuarioAsync(usuario);
        }

        private void ValidarUsuario(Usuarios usuario)
        {
            if (usuario == null)
                throw new ArgumentNullException(nameof(usuario), "El usuario no puede ser nulo.");

            if (usuario.UsuarioId == Guid.Empty)
                throw new ArgumentException("El ID del usuario no es válido.");

            if (string.IsNullOrWhiteSpace(usuario.Nombre))
                throw new ArgumentException("El nombre no puede estar vacío.");

            if (string.IsNullOrWhiteSpace(usuario.Email) || !usuario.Email.Contains("@"))
                throw new ArgumentException("El correo electrónico no es válido.");
        }
    }
}
