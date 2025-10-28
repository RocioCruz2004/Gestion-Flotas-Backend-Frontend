using Domain.Enums;

namespace Aplication.DTOs
{
    public class ConductoresDTO
    {
        public Guid ConductorId { get; set; }
        public string? Nombre { get; set; }
        public string? Cedula { get; set; }
        public string? Telefono { get; set; }
        public string? Direccion { get; set; }
        public string? Licencia { get; set; }
        public ConductoresEnums Estado { get; set; }
    }
}
