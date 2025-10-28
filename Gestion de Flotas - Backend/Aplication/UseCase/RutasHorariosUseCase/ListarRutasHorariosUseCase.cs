using System.Collections.Generic;
using System.Threading.Tasks;
using Domain.Entities;
using Domain.Interfaces;

namespace Application.UseCase.RutasHorariosUseCase
{
    public class ListarRutasHorariosUseCase
    {
        private readonly IRutasHorariosRepository _rutasHorariosRepository;

        public ListarRutasHorariosUseCase(IRutasHorariosRepository rutasHorariosRepository)
        {
            _rutasHorariosRepository = rutasHorariosRepository;
        }

        public async Task<IEnumerable<RutasHorarios>> EjecutarAsync()
        {
            var rutas = await _rutasHorariosRepository.ListarRutasHorariosAsync();

            if (rutas == null)
                throw new KeyNotFoundException("No se encontraron rutas registradas.");

            return rutas;
        }
    }
}
