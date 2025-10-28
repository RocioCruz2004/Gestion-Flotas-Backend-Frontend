using Aplication.DTOs;
using AutoMapper;
using Domain.Entities;

namespace Application.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // Mapeos principales
            CreateMap<Conductores, ConductoresDTO>().ReverseMap();
            CreateMap<Unidades, UnidadesDTO>().ReverseMap();
            CreateMap<UnidadesConductores, UnidadesConductoresDTO>().ReverseMap();
            CreateMap<RutasHorarios, RutasHorariosDTO>().ReverseMap();
            CreateMap<AsignacionesRutas, AsignacionesRutasDTO>().ReverseMap();
            CreateMap<Incidencias, IncidenciasDTO>().ReverseMap();
            CreateMap<Usuarios, UsuariosDTO>().ReverseMap();
            CreateMap<Roles, RolesDTO>().ReverseMap();
        }
    }
}
