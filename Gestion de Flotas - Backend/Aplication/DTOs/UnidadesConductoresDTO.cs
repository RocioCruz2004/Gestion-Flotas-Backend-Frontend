using Domain.Enums;

namespace Aplication.DTOs
{
    public class UnidadesConductoresDTO
    {
        public Guid UnidadConductorId { get; set; }
        public Guid UnidadId { get; set; }
        public Guid ConductorId { get; set; }
        public UnidadesConductoresEnums Estado { get; set; }
    }
}
