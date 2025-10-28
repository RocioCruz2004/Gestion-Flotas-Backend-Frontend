using Domain.Enums;

namespace Aplication.DTOs
{
    public class RutasHorariosDTO
    {
        public Guid RutaHorarioId { get; set; }
        public string Nombre { get; set; }
        public string? Origen { get; set; }
        public string? Destino { get; set; }
        public double Distancia { get; set; }
        public DateTime HoraSalida { get; set; }
        public DateTime HoraLlegada { get; set; }
        public string? Dias { get; set; }
        public  RutasHorariosEnums Estado { get; set; }
    }
}