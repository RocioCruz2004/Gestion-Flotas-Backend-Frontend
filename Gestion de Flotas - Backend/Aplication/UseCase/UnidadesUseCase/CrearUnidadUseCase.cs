using System;
using System.Threading.Tasks;
using Domain.Entities;
using Domain.Interfaces;

namespace Application.UseCase.UnidadesUseCase
{
    public class CrearUnidadUseCase
    {
        private readonly IUnidadesRepository _unidadesRepository;

        public CrearUnidadUseCase(IUnidadesRepository unidadesRepository)
        {
            _unidadesRepository = unidadesRepository;
        }

        public async Task EjecutarAsync(Unidades unidad)
        {
            ValidarUnidad(unidad);
            await _unidadesRepository.CrearUsuarioAsync(unidad);
        }

        private void ValidarUnidad(Unidades unidad)
        {
            if (unidad == null)
                throw new ArgumentNullException(nameof(unidad), "La unidad no puede ser nula.");

            if (string.IsNullOrWhiteSpace(unidad.Placa))
                throw new ArgumentException("La placa de la unidad no puede estar vacía.");

            if (unidad.Capacidad <= 0)
                throw new ArgumentException("La capacidad de la unidad debe ser mayor a 0.");
        }
    }
}
