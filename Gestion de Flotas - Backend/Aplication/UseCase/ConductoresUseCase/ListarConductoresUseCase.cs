using System.Collections.Generic;
using System.Threading.Tasks;
using Domain.Entities;
using Domain.Interfaces;

namespace Application.UseCase.ConductoresUseCase
{
    public class ListarConductoresUseCase
    {
        private readonly IConductoresRepository _conductoresRepository;

        public ListarConductoresUseCase(IConductoresRepository conductoresRepository)
        {
            _conductoresRepository = conductoresRepository;
        }

        public async Task<IEnumerable<Conductores>> EjecutarAsync()
        {
            var conductores = await _conductoresRepository.ListarConductoresAsync();

            if (conductores == null)
                throw new KeyNotFoundException("No se encontraron conductores registrados.");

            return conductores;
        }
    }
}
