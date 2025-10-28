using System;
using System.Threading.Tasks;
using Domain.Entities;
using Domain.Interfaces;

namespace Application.UseCase.RutasHorariosUseCase
{
    public class EditarRutaHorarioUseCase
    {
        private readonly IRutasHorariosRepository _rutasHorariosRepository;

        public EditarRutaHorarioUseCase(IRutasHorariosRepository rutasHorariosRepository)
        {
            _rutasHorariosRepository = rutasHorariosRepository;
        }

        public async Task EjecutarAsync(RutasHorarios ruta)
        {
            ValidarRuta(ruta);
            await _rutasHorariosRepository.EditarRutaHorarioAsync(ruta);
        }

        private void ValidarRuta(RutasHorarios ruta)
        {
            if (ruta == null)
                throw new ArgumentNullException(nameof(ruta), "La ruta no puede ser nula.");

            if (ruta.RutaHorarioId == Guid.Empty)
                throw new ArgumentException("El ID de la ruta no es válido.");

            if (string.IsNullOrWhiteSpace(ruta.Nombre))
                throw new ArgumentException("El nombre de la ruta no puede estar vacío.");

            if (ruta.HoraSalida >= ruta.HoraLlegada)
                throw new ArgumentException("La hora de llegada debe ser mayor que la de salida.");
        }
    }
}
