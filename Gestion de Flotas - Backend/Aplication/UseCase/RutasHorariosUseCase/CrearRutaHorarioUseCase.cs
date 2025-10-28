using System;
using System.Threading.Tasks;
using Domain.Entities;
using Domain.Interfaces;

namespace Application.UseCase.RutasHorariosUseCase
{
    public class CrearRutaHorarioUseCase
    {
        private readonly IRutasHorariosRepository _rutasHorariosRepository;

        public CrearRutaHorarioUseCase(IRutasHorariosRepository rutasHorariosRepository)
        {
            _rutasHorariosRepository = rutasHorariosRepository;
        }

        public async Task EjecutarAsync(RutasHorarios ruta)
        {
            ValidarRuta(ruta);
            await _rutasHorariosRepository.CrearRutaHorarioAsync(ruta);
        }

        private void ValidarRuta(RutasHorarios ruta)
        {
            if (ruta == null)
                throw new ArgumentNullException(nameof(ruta), "La ruta no puede ser nula.");

            if (string.IsNullOrWhiteSpace(ruta.Nombre))
                throw new ArgumentException("El nombre de la ruta no puede estar vacío.");

            if (ruta.Distancia < 0)
                throw new ArgumentException("La distancia no puede ser negativa.");

            if (ruta.HoraSalida >= ruta.HoraLlegada)
                throw new ArgumentException("La hora de llegada debe ser mayor que la hora de salida.");
        }
    }
}
