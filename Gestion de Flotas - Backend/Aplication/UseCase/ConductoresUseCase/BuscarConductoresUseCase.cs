using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Domain.Entities;
using Domain.Enums;
using Domain.Interfaces;

namespace Application.UseCase.ConductoresUseCase
{
    public class BuscarConductoresUseCase
    {
        private readonly IConductoresRepository _conductoresRepository;

        public BuscarConductoresUseCase(IConductoresRepository conductoresRepository)
        {
            _conductoresRepository = conductoresRepository;
        }

        public async Task<IEnumerable<Conductores>> EjecutarAsync(
            string? nombre,
            string? cedula,
            string? licencia,
            ConductoresEnums? estado)
        {
            if (string.IsNullOrWhiteSpace(nombre) &&
                string.IsNullOrWhiteSpace(cedula) &&
                string.IsNullOrWhiteSpace(licencia) &&
                !estado.HasValue)
            {
                throw new ArgumentException("Debe proporcionar al menos un filtro de búsqueda.");
            }

            var resultados = await _conductoresRepository.BuscarConductoresAsync(nombre, cedula, licencia, estado);

            if (resultados == null || !resultados.Any())
                throw new KeyNotFoundException("No se encontraron conductores que coincidan con los filtros.");

            return resultados;
        }
    }
}
