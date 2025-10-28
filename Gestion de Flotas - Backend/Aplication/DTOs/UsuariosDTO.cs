using Domain.Enums;

namespace Aplication.DTOs
{
    public class UsuariosDTO
    {
        public Guid UsuarioId { get; set; }
        public string Nombre { get; set; }
        public string Email { get; set; }
        public string Contrasena { get; set; }
        public Guid RolId { get; set; }
        public UsuariosEnums Estado { get; set; }
    }
}