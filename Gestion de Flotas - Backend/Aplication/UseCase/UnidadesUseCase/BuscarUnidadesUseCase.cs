using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.Entities;
using Domain.Enums;
using Domain.Interfaces;

namespace Application.UseCase.UnidadesUseCase
{
    public class BuscarUnidadesUseCase
    {
        private readonly IUnidadesRepository _unidadesRepository;

        public BuscarUnidadesUseCase(IUnidadesRepository unidadesRepository)
        {
            _unidadesRepository = unidadesRepository;
        }

        public async Task<IEnumerable<Unidades>> EjecutarAsync(
            string? placa,
            string? modelo,
            int? minCapacidad,
            int? maxCapacidad,
            UnidadesEnums? estado)
        {
            // Validación básica
            if (string.IsNullOrWhiteSpace(placa) &&
                string.IsNullOrWhiteSpace(modelo) &&
                !minCapacidad.HasValue &&
                !maxCapacidad.HasValue &&
                !estado.HasValue)
            {
                throw new ArgumentException("Debe proporcionar al menos un filtro de búsqueda.");
            }

            var resultados = await _unidadesRepository.BuscarUnidadesAsync(placa, modelo, minCapacidad, maxCapacidad, estado);

            if (resultados == null || !resultados.Any())
                throw new KeyNotFoundException("No se encontraron unidades que coincidan con los filtros.");

            return resultados;
        }
    }
}
