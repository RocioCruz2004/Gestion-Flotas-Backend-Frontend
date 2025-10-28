using Domain.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.CodeAnalysis;

namespace Domain.Entities
{
    [ExcludeFromCodeCoverage]
    [Table("roles")]
    public class Roles
    {
        [Key]
        [Column("rol_id")]
        public Guid RolId { get; set; }

        [Required]
        [Column("nombre")]
        public string Nombre { get; set; }

        [Column("descripcion")]
        public string? Descripcion { get; set; }

        [Column("estado")]
        public RolesEnums Estado { get; set; }

        public Roles()
        {
            Estado = RolesEnums.Activo;
        }
    }
}