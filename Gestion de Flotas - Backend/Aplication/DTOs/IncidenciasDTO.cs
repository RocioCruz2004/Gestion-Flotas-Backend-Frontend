using Domain.Enums;

namespace Aplication.DTOs
{
    public class IncidenciasDTO
    {
        public Guid IncidenciaId { get; set; }
        public Guid AsignacionId { get; set; }
        public DateTime Fecha { get; set; }
        public IncidenciasTipoEnums Tipo { get; set; }
        public IncidenciasGravedadEnums Gravedad { get; set; }
        public string? Descripcion { get; set; }
        public IncidenciasEstadosEnums Estado { get; set; }
    }
}
