using System;
using System.Threading.Tasks;
using Domain.Entities;
using Domain.Interfaces;

namespace Application.UseCase.ConductoresUseCase
{
    public class CrearConductorUseCase
    {
        private readonly IConductoresRepository _conductoresRepository;

        public CrearConductorUseCase(IConductoresRepository conductoresRepository)
        {
            _conductoresRepository = conductoresRepository;
        }

        public async Task EjecutarAsync(Conductores conductor)
        {
            ValidarConductor(conductor);
            await _conductoresRepository.CrearConductorAsync(conductor);
        }

        private void ValidarConductor(Conductores conductor)
        {
            if (conductor == null)
                throw new ArgumentNullException(nameof(conductor), "El conductor no puede ser nulo.");

            if (string.IsNullOrWhiteSpace(conductor.Nombre))
                throw new ArgumentException("El nombre del conductor no puede estar vacío.");

            if (!string.IsNullOrEmpty(conductor.Cedula) && conductor.Cedula.Length < 7)
                throw new ArgumentException("La cédula ingresada no es válida.");

            if (!string.IsNullOrEmpty(conductor.Licencia) && conductor.Licencia.Length < 5)
                throw new ArgumentException("El número de licencia no es válido.");
        }
    }
}
