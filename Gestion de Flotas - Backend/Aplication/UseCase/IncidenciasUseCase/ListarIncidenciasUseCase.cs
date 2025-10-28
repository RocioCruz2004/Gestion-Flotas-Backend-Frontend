using System.Collections.Generic;
using System.Threading.Tasks;
using Domain.Entities;
using Domain.Interfaces;

namespace Application.UseCase.IncidenciasUseCase
{
    public class ListarIncidenciasUseCase
    {
        private readonly IIncidenciasRepository _incidenciasRepository;

        public ListarIncidenciasUseCase(IIncidenciasRepository incidenciasRepository)
        {
            _incidenciasRepository = incidenciasRepository;
        }

        public async Task<IEnumerable<Incidencias>> EjecutarAsync()
        {
            var incidencias = await _incidenciasRepository.ListarTodosAsync();

            if (incidencias == null)
                throw new KeyNotFoundException("No se encontraron incidencias registradas.");

            return incidencias;
        }
    }
}
