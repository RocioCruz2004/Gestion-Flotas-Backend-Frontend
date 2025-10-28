using Domain.Entities;

namespace Domain.Interfaces
{
public interface IIncidenciasRepository
{

    Task<IEnumerable<Incidencias>> ListarTodosAsync();
    Task CrearAsync(Incidencias incidencia);
    Task ActualizarAsync(Incidencias incidencia);
}
}
