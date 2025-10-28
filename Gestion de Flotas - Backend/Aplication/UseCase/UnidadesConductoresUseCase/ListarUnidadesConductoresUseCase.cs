using Domain.Entities;
using Domain.Interfaces;

namespace Application.UseCase.UnidadesConductoresUseCase
{
    public class ListarUnidadesConductoresUseCase
    {
        private readonly IUnidadesConductoresRepository _repository;

        public ListarUnidadesConductoresUseCase(IUnidadesConductoresRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<UnidadesConductores>> EjecutarAsync()
        {
            var asignaciones = await _repository.ListarUnidadesConductoresAsync();

            if (!asignaciones.Any())
                throw new KeyNotFoundException("No existen asignaciones registradas entre unidades y conductores.");

            return asignaciones;
        }
    }
}
