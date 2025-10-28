using Domain.Entities;
using Domain.Enums;

namespace Domain.Interfaces
{
    public interface IRutasHorariosRepository
    {
        Task<RutasHorarios> CrearRutaHorarioAsync(RutasHorarios rutaHorario);
        Task<IEnumerable<RutasHorarios>> ListarRutasHorariosAsync();
        Task<RutasHorarios?> RutaHorarioPorNombreAsync(string nombre);
        Task<RutasHorarios> EditarRutaHorarioAsync(RutasHorarios rutaHorario);
        Task<IEnumerable<RutasHorarios>> BuscarRutasHorariosAsync(
            string? nombre = null,
            string? origen = null,
            string? destino = null,
            string? dias = null,
            RutasHorariosEnums? estado = null);
    }
}
