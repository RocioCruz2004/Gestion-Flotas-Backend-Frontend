using Aplication.DTOs;
using Application.UseCase.RutasHorariosUseCase;
using AutoMapper;
using Domain.Entities;
using Domain.Enums;
using Domain.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RutasHorariosController : ControllerBase
    {
        private readonly IRutasHorariosRepository _repository;
        private readonly IMapper _mapper;
        private readonly CrearRutaHorarioUseCase _crear;
        private readonly ListarRutasHorariosUseCase _listar;
        private readonly EditarRutaHorarioUseCase _editar;
        private readonly BuscarRutasHorariosUseCase _buscar;

        public RutasHorariosController(
            IRutasHorariosRepository repository,
            IMapper mapper,
            CrearRutaHorarioUseCase crear,
            ListarRutasHorariosUseCase listar,
            EditarRutaHorarioUseCase editar,
            BuscarRutasHorariosUseCase buscar)
        {
            _repository = repository;
            _mapper = mapper;
            _crear = crear;
            _listar = listar;
            _editar = editar;
            _buscar = buscar;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var rutas = await _listar.EjecutarAsync();
            var dto = _mapper.Map<IEnumerable<RutasHorariosDTO>>(rutas);
            return Ok(dto);
        }

        // 🔍 Nuevo endpoint de búsqueda y filtrado
        [HttpGet("buscar")]
        public async Task<IActionResult> Buscar(
            [FromQuery] string? nombre,
            [FromQuery] string? origen,
            [FromQuery] string? destino,
            [FromQuery] string? dias,
            [FromQuery] RutasHorariosEnums? estado)
        {
            var rutas = await _buscar.EjecutarAsync(nombre, origen, destino, dias, estado);
            var dto = _mapper.Map<IEnumerable<RutasHorariosDTO>>(rutas);
            return Ok(dto);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] RutasHorariosDTO dto)
        {
            var entidad = _mapper.Map<RutasHorarios>(dto);
            await _crear.EjecutarAsync(entidad);
            return Ok(new { mensaje = "Ruta registrada correctamente." });
        }

        [HttpPut("{id:guid}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] RutasHorariosDTO dto)
        {
            if (id != dto.RutaHorarioId)
                return BadRequest(new { mensaje = "El ID no coincide." });

            var entidad = _mapper.Map<RutasHorarios>(dto);
            await _editar.EjecutarAsync(entidad);
            return Ok(new { mensaje = "Ruta actualizada correctamente." });
        }
    }
}
