using System.Collections.Generic;
using System.Threading.Tasks;
using Domain.Entities;
using Domain.Interfaces;

namespace Application.UseCase.AsignacionesRutasUseCase
{
    public class ListarAsignacionesRutasUseCase
    {
        private readonly IAsignacionesRutasRepository _asignacionesRutasRepository;

        public ListarAsignacionesRutasUseCase(IAsignacionesRutasRepository asignacionesRutasRepository)
        {
            _asignacionesRutasRepository = asignacionesRutasRepository;
        }

        public async Task<IEnumerable<AsignacionesRutas>> EjecutarAsync()
        {
            var asignaciones = await _asignacionesRutasRepository.ListarAsignacionesAsync();

            if (asignaciones == null)
                throw new KeyNotFoundException("No se encontraron asignaciones registradas.");

            return asignaciones;
        }
    }
}
