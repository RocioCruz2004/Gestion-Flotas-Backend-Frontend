using Domain.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.CodeAnalysis;

namespace Domain.Entities
{
    [ExcludeFromCodeCoverage]
    [Table("conductores")]
    public class Conductores
    {
        [Key]
        [Column("conductor_id")]
        public Guid ConductorId { get; set; }

        [Required]
        [Column("nombre")]
        public string Nombre { get; set; }

        [Column("cedula")]
        public string? Cedula { get; set; }

        [Column("telefono")]
        public string? Telefono { get; set; }

        [Column("direccion")]
        public string? Direccion { get; set; }

        [Column("licencia")]
        public string? Licencia { get; set; }

        [Column("estado")]
        public ConductoresEnums Estado { get; set; }

        public Conductores()
        {
            Estado = ConductoresEnums.Activo;
        }
    }
}