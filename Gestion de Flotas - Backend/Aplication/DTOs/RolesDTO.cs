using Domain.Enums;

namespace Aplication.DTOs
{
  public class RolesDTO
    {
        public Guid RolId { get; set; }
        public string Nombre { get; set; }
        public string? Descripcion { get; set; }
        public RolesEnums Estado { get; set; }
    }
}
