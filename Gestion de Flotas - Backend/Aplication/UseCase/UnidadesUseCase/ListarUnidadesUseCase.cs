using System.Collections.Generic;
using System.Threading.Tasks;
using Domain.Entities;
using Domain.Interfaces;

namespace Application.UseCase.UnidadesUseCase
{
    public class ListarUnidadesUseCase
    {
        private readonly IUnidadesRepository _unidadesRepository;

        public ListarUnidadesUseCase(IUnidadesRepository unidadesRepository)
        {
            _unidadesRepository = unidadesRepository;
        }

        public async Task<IEnumerable<Unidades>> EjecutarAsync()
        {
            var unidades = await _unidadesRepository.ListarUsuariosAsync();

            if (unidades == null)
                throw new KeyNotFoundException("No se encontraron unidades registradas.");

            return unidades;
        }
    }
}
