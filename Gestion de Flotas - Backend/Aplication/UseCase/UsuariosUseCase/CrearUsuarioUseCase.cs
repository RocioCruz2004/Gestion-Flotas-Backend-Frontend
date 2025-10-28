using System;
using System.Threading.Tasks;
using Domain.Entities;
using Domain.Interfaces;

namespace Application.UseCase.UsuariosUseCase
{
    public class CrearUsuarioUseCase
    {
        private readonly IUsuariosRepository _usuariosRepository;

        public CrearUsuarioUseCase(IUsuariosRepository usuariosRepository)
        {
            _usuariosRepository = usuariosRepository;
        }

        public async Task EjecutarAsync(Usuarios usuario)
        {
            ValidarUsuario(usuario);
            await _usuariosRepository.CrearUsuarioAsync(usuario);
        }

        private void ValidarUsuario(Usuarios usuario)
        {
            if (usuario == null)
                throw new ArgumentNullException(nameof(usuario), "El usuario no puede ser nulo.");

            if (string.IsNullOrWhiteSpace(usuario.Nombre))
                throw new ArgumentException("El nombre del usuario no puede estar vacío.");

            if (string.IsNullOrWhiteSpace(usuario.Email) || !usuario.Email.Contains("@"))
                throw new ArgumentException("El correo electrónico del usuario no es válido.");

            if (string.IsNullOrWhiteSpace(usuario.Contrasena))
                throw new ArgumentException("La contraseña no puede estar vacía.");
        }
    }
}
