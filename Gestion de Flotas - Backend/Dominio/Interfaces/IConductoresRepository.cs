using Domain.Entities;
using Domain.Enums;

namespace Domain.Interfaces
{
    public interface IConductoresRepository
    {
        Task<Conductores> CrearConductorAsync(Conductores conductor);
        Task<IEnumerable<Conductores>> ListarConductoresAsync();
        Task<Conductores?> ConductorPorIdAsync(Guid id);
        Task<Conductores> EditarConductorAsync(Conductores conductor);
        Task<IEnumerable<Conductores>> BuscarConductoresAsync(string? nombre, string? cedula, string? licencia, ConductoresEnums? estado);
    }
}
