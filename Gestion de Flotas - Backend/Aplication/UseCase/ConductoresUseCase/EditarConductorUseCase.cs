using System;
using System.Threading.Tasks;
using Domain.Entities;
using Domain.Interfaces;

namespace Application.UseCase.ConductoresUseCase
{
    public class EditarConductorUseCase
    {
        private readonly IConductoresRepository _conductoresRepository;

        public EditarConductorUseCase(IConductoresRepository conductoresRepository)
        {
            _conductoresRepository = conductoresRepository;
        }

        public async Task EjecutarAsync(Conductores conductor)
        {
            ValidarConductor(conductor);
            await _conductoresRepository.EditarConductorAsync(conductor);
        }

        private void ValidarConductor(Conductores conductor)
        {
            if (conductor == null)
                throw new ArgumentNullException(nameof(conductor), "El conductor no puede ser nulo.");

            if (conductor.ConductorId == Guid.Empty)
                throw new ArgumentException("El ID del conductor es inválido.");

            if (string.IsNullOrWhiteSpace(conductor.Nombre))
                throw new ArgumentException("El nombre del conductor no puede estar vacío.");
        }
    }
}
