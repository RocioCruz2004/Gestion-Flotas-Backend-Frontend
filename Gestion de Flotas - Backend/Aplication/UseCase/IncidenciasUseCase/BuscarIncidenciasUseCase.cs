using AutoMapper;
using Domain.Entities;
using Domain.Enums;
using Domain.Interfaces;

namespace Application.UseCase.IncidenciasUseCase
{
    public class BuscarIncidenciasUseCase
    {
        private readonly IIncidenciasRepository _repository;
        private readonly IMapper _mapper;

        public BuscarIncidenciasUseCase(IIncidenciasRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<Incidencias>> EjecutarAsync(
            IncidenciasTipoEnums? tipo,
            IncidenciasGravedadEnums? gravedad,
            IncidenciasEstadosEnums? estado,
            DateTime? fechaInicio,
            DateTime? fechaFin)
        {
            var incidencias = await _repository.ListarTodosAsync();

            if (tipo.HasValue)
                incidencias = incidencias.Where(i => i.Tipo == tipo.Value);

            if (gravedad.HasValue)
                incidencias = incidencias.Where(i => i.Gravedad == gravedad.Value);

            if (estado.HasValue)
                incidencias = incidencias.Where(i => i.Estado == estado.Value);

            if (fechaInicio.HasValue)
                incidencias = incidencias.Where(i => i.Fecha >= fechaInicio.Value);

            if (fechaFin.HasValue)
                incidencias = incidencias.Where(i => i.Fecha <= fechaFin.Value);

            if (!incidencias.Any())
                throw new KeyNotFoundException("No se encontraron incidencias con los filtros aplicados.");

            return incidencias;
        }
    }
}
