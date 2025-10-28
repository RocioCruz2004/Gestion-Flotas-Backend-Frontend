using Domain.Entities;
using Domain.Enums;
using Domain.Interfaces;

namespace Application.UseCase.UsuariosUseCase
{
    public class BuscarUsuariosUseCase
    {
        private readonly IUsuariosRepository _repository;

        public BuscarUsuariosUseCase(IUsuariosRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<Usuarios>> EjecutarAsync(
            string? nombre = null,
            string? email = null,
            Guid? rolId = null,
            UsuariosEnums? estado = null)
        {
            return await _repository.BuscarUsuariosAsync(nombre, email, rolId, estado);
        }
    }
}
