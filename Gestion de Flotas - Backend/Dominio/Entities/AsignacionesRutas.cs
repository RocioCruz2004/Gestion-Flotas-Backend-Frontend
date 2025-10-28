using Domain.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.CodeAnalysis;

namespace Domain.Entities
{
    [ExcludeFromCodeCoverage]
    [Table("asignaciones_rutas")]
    public class AsignacionesRutas
    {
        [Key]
        [Column("asignacion_id")]
        public Guid AsignacionId { get; set; }

        [ForeignKey("UnidadConductor")]
        [Column("unidad_conductor_id")]
        public Guid UnidadConductorId { get; set; }

        [ForeignKey("RutaHorario")]
        [Column("ruta_horario_id")]
        public Guid RutaHorarioId { get; set; }

        [Column("fecha_asignacion")]
        public DateTime FechaAsignacion { get; set; }

        [Column("estado")]
        public AsignacionesRutasEnums Estado { get; set; }

        public UnidadesConductores UnidadConductor { get; set; }
        public RutasHorarios RutaHorario { get; set; }

        public AsignacionesRutas()
        {
            Estado = AsignacionesRutasEnums.Activo;
        }
    }
}
