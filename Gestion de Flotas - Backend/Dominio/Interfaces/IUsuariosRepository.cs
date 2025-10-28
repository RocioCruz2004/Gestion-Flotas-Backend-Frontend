using Domain.Entities;
using Domain.Enums;

namespace Domain.Interfaces
{
    public interface IUsuariosRepository
    {
        Task<Usuarios> CrearUsuarioAsync(Usuarios usuarios);
        Task<IEnumerable<Usuarios>> ListarUsuariosAsync();
        Task<Usuarios> UsuarioPorIdAsync(Guid id);
        Task<Usuarios> UsuarioPorNombreAsync(string nombre);
        Task<Usuarios> EditarUsuarioAsync(Usuarios usuarios);
        Task<IEnumerable<Usuarios>> BuscarUsuariosAsync(
            string? nombre = null,
            string? email = null,
            Guid? rolId = null,
            UsuariosEnums? estado = null);
    }
}
