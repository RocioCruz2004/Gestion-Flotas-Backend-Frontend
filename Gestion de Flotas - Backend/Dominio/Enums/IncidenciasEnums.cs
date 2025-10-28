using System.Text.Json.Serialization;

namespace Domain.Enums
{
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum IncidenciasEstadosEnums
    {
        Activo,
        Inactivo
    }

    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum IncidenciasTipoEnums
    {
        FalloTecnico,
        Choque,
        FaltaConductor
    }

    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum IncidenciasGravedadEnums
    {
        Alto,
        Medio,
        Bajo
    }
}
