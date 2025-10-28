using System;
using System.Threading.Tasks;
using Domain.Entities;
using Domain.Interfaces;

namespace Application.UseCase.UnidadesConductoresUseCase
{
    public class ActualizarUnidadConductorUseCase
    {
        private readonly IUnidadesConductoresRepository _unidadesConductoresRepository;

        public ActualizarUnidadConductorUseCase(IUnidadesConductoresRepository unidadesConductoresRepository)
        {
            _unidadesConductoresRepository = unidadesConductoresRepository;
        }

        public async Task EjecutarAsync(UnidadesConductores unidadConductor)
        {
            ValidarAsignacion(unidadConductor);
            await _unidadesConductoresRepository.ActualizarUnidadConductorAsync(unidadConductor);
        }

        private void ValidarAsignacion(UnidadesConductores unidadConductor)
        {
            if (unidadConductor == null)
                throw new ArgumentNullException(nameof(unidadConductor), "La asignación no puede ser nula.");

            if (unidadConductor.UnidadConductorId == Guid.Empty)
                throw new ArgumentException("El ID de la asignación no es válido.");

            if (unidadConductor.UnidadId == Guid.Empty)
                throw new ArgumentException("El ID de la unidad no es válido.");

            if (unidadConductor.ConductorId == Guid.Empty)
                throw new ArgumentException("El ID del conductor no es válido.");
        }
    }
}
