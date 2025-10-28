using Domain.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.CodeAnalysis;

namespace Domain.Entities
{
    [ExcludeFromCodeCoverage]
    [Table("rutas_horarios")]
    public class RutasHorarios
    {
        [Key]
        [Column("ruta_horario_id")]
        public Guid RutaHorarioId { get; set; }

        [Required]
        [Column("nombre")]
        public string Nombre { get; set; }

        [Column("origen")]
        public string? Origen { get; set; }

        [Column("destino")]
        public string? Destino { get; set; }

        [Column("distancia")]
        public double Distancia { get; set; }

        [Column("hora_salida")]
        public DateTime HoraSalida { get; set; }

        [Column("hora_llegada")]
        public DateTime HoraLlegada { get; set; }

        [Column("dias")]
        public string? Dias { get; set; }

        [Column("estado")]
        public RutasHorariosEnums Estado { get; set; }

        public RutasHorarios()
        {
            Estado = RutasHorariosEnums.Activo;
        }
    }
}
