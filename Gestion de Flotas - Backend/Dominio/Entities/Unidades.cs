using Domain.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.CodeAnalysis;

namespace Domain.Entities
{
    [ExcludeFromCodeCoverage]
    [Table("unidades")]
    public class Unidades
    {
        [Key]
        [Column("unidad_id")]
        public Guid UnidadId { get; set; }

        [Required]
        [Column("placa")]
        public string Placa { get; set; }

        [Column("modelo")]
        public string? Modelo { get; set; }

        [Column("capacidad")]
        public int Capacidad { get; set; }

        [Column("estado")]
        public UnidadesEnums Estado { get; set; }

        public Unidades()
        {
            Estado = UnidadesEnums.Activo;
        }
    }
}
