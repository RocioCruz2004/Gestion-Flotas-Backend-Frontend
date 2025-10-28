using Aplication.DTOs;
using Application.UseCase.ConductoresUseCase;
using AutoMapper;
using Domain.Entities;
using Domain.Enums;
using Domain.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ConductoresController : ControllerBase
    {
        private readonly IConductoresRepository _conductoresRepository;
        private readonly IMapper _mapper;
        private readonly CrearConductorUseCase _crearConductor;
        private readonly ListarConductoresUseCase _listarConductores;
        private readonly EditarConductorUseCase _editarConductor;
        private readonly BuscarConductoresUseCase _buscarConductores;


        public ConductoresController(
            IConductoresRepository conductoresRepository,
            IMapper mapper,
            CrearConductorUseCase crearConductor,
            ListarConductoresUseCase listarConductores,
            EditarConductorUseCase editarConductor,
            BuscarConductoresUseCase buscarConductores)
        {
            _conductoresRepository = conductoresRepository;
            _mapper = mapper;
            _crearConductor = crearConductor;
            _listarConductores = listarConductores;
            _editarConductor = editarConductor;
            _buscarConductores = buscarConductores;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var conductores = await _listarConductores.EjecutarAsync();
            var dto = _mapper.Map<IEnumerable<ConductoresDTO>>(conductores);
            return Ok(dto);
        }

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var conductor = await _conductoresRepository.ConductorPorIdAsync(id);
            if (conductor == null)
                return NotFound(new { mensaje = "Conductor no encontrado." });

            return Ok(_mapper.Map<ConductoresDTO>(conductor));
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] ConductoresDTO dto)
        {
            try
            {
                var conductor = _mapper.Map<Conductores>(dto);
                await _crearConductor.EjecutarAsync(conductor);
                return Ok(new { mensaje = "Conductor registrado correctamente." });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { mensaje = ex.Message });
            }
        }

        [HttpPut("{id:guid}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] ConductoresDTO dto)
        {
            if (id != dto.ConductorId)
                return BadRequest(new { mensaje = "El ID no coincide." });

            var conductor = _mapper.Map<Conductores>(dto);
            await _editarConductor.EjecutarAsync(conductor);
            return Ok(new { mensaje = "Conductor actualizado correctamente." });
        }

        [HttpGet("buscar")]
        public async Task<IActionResult> Buscar(
        [FromQuery] string? nombre,
        [FromQuery] string? cedula,
        [FromQuery] string? licencia,
        [FromQuery] ConductoresEnums? estado)
        {
            try
            {
                var resultados = await _buscarConductores.EjecutarAsync(nombre, cedula, licencia, estado);
                var dto = _mapper.Map<IEnumerable<ConductoresDTO>>(resultados);
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
