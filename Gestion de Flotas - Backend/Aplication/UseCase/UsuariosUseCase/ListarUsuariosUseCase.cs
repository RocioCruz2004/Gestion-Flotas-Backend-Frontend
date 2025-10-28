using System.Collections.Generic;
using System.Threading.Tasks;
using Domain.Entities;
using Domain.Interfaces;

namespace Application.UseCase.UsuariosUseCase
{
    public class ListarUsuariosUseCase
    {
        private readonly IUsuariosRepository _usuariosRepository;

        public ListarUsuariosUseCase(IUsuariosRepository usuariosRepository)
        {
            _usuariosRepository = usuariosRepository;
        }

        public async Task<IEnumerable<Usuarios>> EjecutarAsync()
        {
            var usuarios = await _usuariosRepository.ListarUsuariosAsync();

            if (usuarios == null)
                throw new KeyNotFoundException("No se encontraron usuarios registrados.");

            return usuarios;
        }
    }
}
