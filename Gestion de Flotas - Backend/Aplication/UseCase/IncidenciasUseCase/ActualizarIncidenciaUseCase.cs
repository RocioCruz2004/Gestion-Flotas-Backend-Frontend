using System;
using System.Threading.Tasks;
using Domain.Entities;
using Domain.Interfaces;

namespace Application.UseCase.IncidenciasUseCase
{
    public class ActualizarIncidenciaUseCase
    {
        private readonly IIncidenciasRepository _incidenciasRepository;

        public ActualizarIncidenciaUseCase(IIncidenciasRepository incidenciasRepository)
        {
            _incidenciasRepository = incidenciasRepository;
        }

        public async Task EjecutarAsync(Incidencias incidencia)
        {
            ValidarIncidencia(incidencia);
            await _incidenciasRepository.ActualizarAsync(incidencia);
        }

        private void ValidarIncidencia(Incidencias incidencia)
        {
            if (incidencia == null)
                throw new ArgumentNullException(nameof(incidencia), "La incidencia no puede ser nula.");

            if (incidencia.IncidenciaId == Guid.Empty)
                throw new ArgumentException("El ID de la incidencia no es válido.");

            if (string.IsNullOrWhiteSpace(incidencia.Descripcion))
                throw new ArgumentException("Debe proporcionar una descripción válida.");
        }
    }
}
