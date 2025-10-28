using Aplication.DTOs;
using Application.UseCase.IncidenciasUseCase;
using AutoMapper;
using Domain.Entities;
using Domain.Enums;
using Domain.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class IncidenciasController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly CrearIncidenciaUseCase _crear;
        private readonly ListarIncidenciasUseCase _listar;
        private readonly ActualizarIncidenciaUseCase _actualizar;
        private readonly BuscarIncidenciasUseCase _buscar;

        public IncidenciasController(
            IMapper mapper,
            CrearIncidenciaUseCase crear,
            ListarIncidenciasUseCase listar,
            ActualizarIncidenciaUseCase actualizar,
            BuscarIncidenciasUseCase buscar)
        {
            _mapper = mapper;
            _crear = crear;
            _listar = listar;
            _actualizar = actualizar;
            _buscar = buscar;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var incidencias = await _listar.EjecutarAsync();
            var dto = _mapper.Map<IEnumerable<IncidenciasDTO>>(incidencias);
            return Ok(dto);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] IncidenciasDTO dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var entidad = _mapper.Map<Incidencias>(dto);
            await _crear.EjecutarAsync(entidad);
            return Ok(new { mensaje = "Incidencia registrada correctamente." });
        }

        [HttpPut("{id:guid}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] IncidenciasDTO dto)
        {
            if (id != dto.IncidenciaId)
                return BadRequest(new { mensaje = "El ID no coincide." });

            var entidad = _mapper.Map<Incidencias>(dto);
            await _actualizar.EjecutarAsync(entidad);
            return Ok(new { mensaje = "Incidencia actualizada correctamente." });
        }

        [HttpGet("buscar")]
        public async Task<IActionResult> Buscar(
            [FromQuery] IncidenciasTipoEnums? tipo,
            [FromQuery] IncidenciasGravedadEnums? gravedad,
            [FromQuery] IncidenciasEstadosEnums? estado,
            [FromQuery] DateTime? fechaInicio,
            [FromQuery] DateTime? fechaFin)
        {
            try
            {
                var resultados = await _buscar.EjecutarAsync(tipo, gravedad, estado, fechaInicio, fechaFin);
                var dto = _mapper.Map<IEnumerable<IncidenciasDTO>>(resultados);
                return Ok(dto);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { mensaje = ex.Message });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { mensaje = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = $"Error interno: {ex.Message}" });
            }
        }
    }
}
