using Domain.Enums;

namespace Aplication.DTOs
{
    public class UnidadesDTO
    {
        public Guid UnidadId { get; set; }
        public string? Placa { get; set; }
        public string? Modelo { get; set; }
        public int Capacidad { get; set; }
        public UnidadesEnums Estado { get; set; }
    }
}
