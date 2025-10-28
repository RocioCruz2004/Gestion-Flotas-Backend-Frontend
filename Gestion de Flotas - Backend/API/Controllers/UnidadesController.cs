using Aplication.DTOs;
using Application.UseCase.UnidadesUseCase;
using AutoMapper;
using Domain.Entities;
using Domain.Enums;
using Domain.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UnidadesController : ControllerBase
    {
        private readonly IUnidadesRepository _unidadesRepository;
        private readonly IMapper _mapper;
        private readonly CrearUnidadUseCase _crearUnidad;
        private readonly ListarUnidadesUseCase _listarUnidades;
        private readonly EditarUnidadUseCase _editarUnidad;
        private readonly BuscarUnidadesUseCase _buscarUnidades;

        public UnidadesController(
            IUnidadesRepository unidadesRepository,
            IMapper mapper,
            CrearUnidadUseCase crearUnidad,
            ListarUnidadesUseCase listarUnidades,
            EditarUnidadUseCase editarUnidad,
            BuscarUnidadesUseCase buscarUnidades)
        {
            _unidadesRepository = unidadesRepository;
            _mapper = mapper;
            _crearUnidad = crearUnidad;
            _listarUnidades = listarUnidades;
            _editarUnidad = editarUnidad;
            _buscarUnidades = buscarUnidades;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var unidades = await _listarUnidades.EjecutarAsync();
            var dto = _mapper.Map<IEnumerable<UnidadesDTO>>(unidades);
            return Ok(dto);
        }

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var unidad = await _unidadesRepository.UsuarioPorIdAsync(id);
            if (unidad == null)
                return NotFound(new { mensaje = "Unidad no encontrada." });

            return Ok(_mapper.Map<UnidadesDTO>(unidad));
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] UnidadesDTO dto)
        {
            var entidad = _mapper.Map<Unidades>(dto);
            await _crearUnidad.EjecutarAsync(entidad);
            return Ok(new { mensaje = "Unidad registrada correctamente." });
        }

        [HttpPut("{id:guid}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] UnidadesDTO dto)
        {
            if (id != dto.UnidadId)
                return BadRequest(new { mensaje = "El ID no coincide." });

            var entidad = _mapper.Map<Unidades>(dto);
            await _editarUnidad.EjecutarAsync(entidad);
            return Ok(new { mensaje = "Unidad actualizada correctamente." });
        }

        // 🔎 NUEVO: búsqueda avanzada
        [HttpGet("buscar")]
        public async Task<IActionResult> Buscar(
            [FromQuery] string? placa,
            [FromQuery] string? modelo,
            [FromQuery] int? minCapacidad,
            [FromQuery] int? maxCapacidad,
            [FromQuery] UnidadesEnums? estado)
        {
            try
            {
                var resultados = await _buscarUnidades.EjecutarAsync(placa, modelo, minCapacidad, maxCapacidad, estado);
                var dto = _mapper.Map<IEnumerable<UnidadesDTO>>(resultados);
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
