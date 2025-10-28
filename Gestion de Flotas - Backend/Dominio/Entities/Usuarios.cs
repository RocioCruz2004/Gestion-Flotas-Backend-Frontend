using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.CodeAnalysis;
using Domain.Enums;

namespace Domain.Entities
{
    [ExcludeFromCodeCoverage]
    [Table("usuarios")]
    public class Usuarios
    {
        [Key]
        [Column("usuario_id")]
        public Guid UsuarioId { get; set; }

        [Required]
        [Column("nombre")]
        public string Nombre { get; set; }

        [Required]
        [Column("email")]
        public string Email { get; set; }

        [Required]
        [Column("contrasena")]
        public string Contrasena { get; set; }

        [ForeignKey("Rol")]
        [Column("rol_id")]
        public Guid RolId { get; set; }

        [Column("estado")]
        public UsuariosEnums Estado { get; set; }

        public Roles Rol { get; set; }

        public Usuarios()
        {
            Estado = UsuariosEnums.Activo;
        }
    }
}
