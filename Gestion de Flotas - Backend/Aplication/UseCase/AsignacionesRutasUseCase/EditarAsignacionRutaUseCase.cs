using System;
using System.Threading.Tasks;
using Domain.Entities;
using Domain.Interfaces;

namespace Application.UseCase.AsignacionesRutasUseCase
{
    public class EditarAsignacionRutaUseCase
    {
        private readonly IAsignacionesRutasRepository _asignacionesRutasRepository;

        public EditarAsignacionRutaUseCase(IAsignacionesRutasRepository asignacionesRutasRepository)
        {
            _asignacionesRutasRepository = asignacionesRutasRepository;
        }

        public async Task EjecutarAsync(AsignacionesRutas asignacion)
        {
            ValidarAsignacion(asignacion);
            await _asignacionesRutasRepository.EditarAsignacionAsync(asignacion);
        }

        private void ValidarAsignacion(AsignacionesRutas asignacion)
        {
            if (asignacion == null)
                throw new ArgumentNullException(nameof(asignacion), "La asignación no puede ser nula.");

            if (asignacion.AsignacionId == Guid.Empty)
                throw new ArgumentException("El ID de la asignación no es válido.");

            if (asignacion.UnidadConductorId == Guid.Empty)
                throw new ArgumentException("El ID de la relación unidad-conductor no es válido.");

            if (asignacion.RutaHorarioId == Guid.Empty)
                throw new ArgumentException("El ID de la ruta no es válido.");
        }
    }
}
