using Domain.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.CodeAnalysis;

namespace Domain.Entities
{
    [ExcludeFromCodeCoverage]
    [Table("incidencias")]
    public class Incidencias
    {
        [Key]
        [Column("incidencia_id")]
        public Guid IncidenciaId { get; set; }

        [ForeignKey("AsignacionRuta")]
        [Column("asignacion_id")]
        public Guid AsignacionId { get; set; }

        [Column("fecha")]
        public DateTime Fecha { get; set; }

        [Column("tipo")]
        public IncidenciasTipoEnums Tipo { get; set; }

        [Column("gravedad")]
        public IncidenciasGravedadEnums Gravedad { get; set; }

        [Column("descripcion")]
        public string? Descripcion { get; set; }

        [Column("estado")]
        public IncidenciasEstadosEnums Estado { get; set; }

        public AsignacionesRutas AsignacionRuta { get; set; }

        public Incidencias()
        {
            Estado = IncidenciasEstadosEnums.Activo;
        }
    }
}
