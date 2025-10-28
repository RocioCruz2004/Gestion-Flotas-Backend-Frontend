using System;
using System.Threading.Tasks;
using Domain.Entities;
using Domain.Interfaces;

namespace Application.UseCase.UnidadesConductoresUseCase
{
    public class CrearUnidadConductorUseCase
    {
        private readonly IUnidadesConductoresRepository _repository;

        public CrearUnidadConductorUseCase(IUnidadesConductoresRepository repository)
        {
            _repository = repository;
        }

        public async Task EjecutarAsync(UnidadesConductores unidadConductor)
        {
            ValidarAsignacion(unidadConductor);

            bool existeActivo = await _repository.ExisteActivoAsync(unidadConductor.UnidadId, unidadConductor.ConductorId);
            if (existeActivo)
                throw new ArgumentException("La unidad o el conductor ya tienen una asignación activa.");

            await _repository.CrearUnidadConductorAsync(unidadConductor);
        }


        private void ValidarAsignacion(UnidadesConductores unidadConductor)
        {
            if (unidadConductor == null)
                throw new ArgumentNullException(nameof(unidadConductor), "La asignación no puede ser nula.");

            if (unidadConductor.UnidadId == Guid.Empty)
                throw new ArgumentException("El ID de la unidad no es válido.");

            if (unidadConductor.ConductorId == Guid.Empty)
                throw new ArgumentException("El ID del conductor no es válido.");
        }
    }
}
