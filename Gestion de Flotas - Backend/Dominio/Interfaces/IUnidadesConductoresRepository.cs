using Domain.Entities;

namespace Domain.Interfaces
{
    public interface IUnidadesConductoresRepository
    {
        Task CrearUnidadConductorAsync(UnidadesConductores unidadesConductores);
        Task ActualizarUnidadConductorAsync(UnidadesConductores unidadesConductores);
        Task<IEnumerable<UnidadesConductores>> ListarUnidadesConductoresAsync();
        Task<bool> ExisteActivoAsync(Guid unidadId, Guid conductorId);
    }
}