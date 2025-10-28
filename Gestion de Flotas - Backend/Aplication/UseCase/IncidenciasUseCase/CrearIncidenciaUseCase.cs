using System;
using System.Threading.Tasks;
using Domain.Entities;
using Domain.Interfaces;

namespace Application.UseCase.IncidenciasUseCase
{
    public class CrearIncidenciaUseCase
    {
        private readonly IIncidenciasRepository _incidenciasRepository;

        public CrearIncidenciaUseCase(IIncidenciasRepository incidenciasRepository)
        {
            _incidenciasRepository = incidenciasRepository;
        }

        public async Task EjecutarAsync(Incidencias incidencia)
        {
            ValidarIncidencia(incidencia);
            await _incidenciasRepository.CrearAsync(incidencia);
        }

        private void ValidarIncidencia(Incidencias incidencia)
        {
            if (incidencia == null)
                throw new ArgumentNullException(nameof(incidencia), "La incidencia no puede ser nula.");

            if (incidencia.AsignacionId == Guid.Empty)
                throw new ArgumentException("Debe especificar una asignación válida.");

            if (string.IsNullOrWhiteSpace(incidencia.Descripcion))
                throw new ArgumentException("Debe proporcionar una descripción de la incidencia.");
        }
    }
}
