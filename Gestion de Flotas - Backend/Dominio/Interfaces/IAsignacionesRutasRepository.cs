using Domain.Entities;

namespace Domain.Interfaces
{
    public interface IAsignacionesRutasRepository
    {
        Task<AsignacionesRutas> CrearAsignacionAsync(AsignacionesRutas asignacion);
        Task<IEnumerable<AsignacionesRutas>> ListarAsignacionesAsync();
        Task<AsignacionesRutas> EditarAsignacionAsync(AsignacionesRutas asignacion);
    }
}
