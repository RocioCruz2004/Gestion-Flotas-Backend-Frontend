using Domain.Entities;
using Domain.Enums;

namespace Domain.Interfaces
{
    public interface IUnidadesRepository
    {
        Task<Unidades> CrearUsuarioAsync(Unidades unidades);
        Task<IEnumerable<Unidades>> ListarUsuariosAsync();
        Task<Unidades> UsuarioPorIdAsync(Guid id);
        Task<Unidades> EditarUsuarioAsync(Unidades unidades);
        Task<IEnumerable<Unidades>> BuscarUnidadesAsync(
            string? placa,
            string? modelo,
            int? minCapacidad,
            int? maxCapacidad,
            UnidadesEnums? estado);
    }
}
