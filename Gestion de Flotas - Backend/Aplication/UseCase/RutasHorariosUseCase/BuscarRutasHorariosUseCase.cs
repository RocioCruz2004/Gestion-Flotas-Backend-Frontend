using Domain.Entities;
using Domain.Enums;
using Domain.Interfaces;

namespace Application.UseCase.RutasHorariosUseCase
{
    public class BuscarRutasHorariosUseCase
    {
        private readonly IRutasHorariosRepository _repository;

        public BuscarRutasHorariosUseCase(IRutasHorariosRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<RutasHorarios>> EjecutarAsync(
            string? nombre = null,
            string? origen = null,
            string? destino = null,
            string? dias = null,
            RutasHorariosEnums? estado = null)
        {
            return await _repository.BuscarRutasHorariosAsync(nombre, origen, destino, dias, estado);
        }
    }
}
