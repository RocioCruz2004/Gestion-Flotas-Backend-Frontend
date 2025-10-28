using Domain.Enums;

namespace Aplication.DTOs
{
    public class AsignacionesRutasDTO
    {
        public Guid AsignacionId { get; set; }
        public Guid UnidadConductorId { get; set; }
        public Guid RutaHorarioId { get; set; }
        public DateTime FechaAsignacion { get; set; }
        public AsignacionesRutasEnums Estado { get; set; }
    }
}