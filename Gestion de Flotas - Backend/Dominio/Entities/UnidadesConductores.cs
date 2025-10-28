using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.CodeAnalysis;
using Domain.Enums;

namespace Domain.Entities
{
    [ExcludeFromCodeCoverage]
    [Table("unidades_conductores")]
    public class UnidadesConductores
    {
        [Key]
        [Column("unidad_conductor_id")]
        public Guid UnidadConductorId { get; set; }

        [ForeignKey("Unidad")]
        [Column("unidad_id")]
        public Guid UnidadId { get; set; }

        [ForeignKey("Conductor")]
        [Column("conductor_id")]
        public Guid ConductorId { get; set; }

        [Column("estado")]
        public UnidadesConductoresEnums Estado { get; set; }

        public Unidades Unidad { get; set; }
        public Conductores Conductor { get; set; }

        public UnidadesConductores()
        {
            Estado = UnidadesConductoresEnums.Activo;
        }
    }
}
