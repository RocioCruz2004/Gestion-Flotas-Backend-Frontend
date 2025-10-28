using Aplication.DTOs;
using Application.UseCase.UnidadesConductoresUseCase;
using AutoMapper;
using Domain.Entities;
using Domain.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UnidadesConductoresController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly CrearUnidadConductorUseCase _crear;
        private readonly ActualizarUnidadConductorUseCase _actualizar;
        private readonly ListarUnidadesConductoresUseCase _listar;

        public UnidadesConductoresController(
            IMapper mapper,
            CrearUnidadConductorUseCase crear,
            ActualizarUnidadConductorUseCase actualizar,
            ListarUnidadesConductoresUseCase listar)
        {
            _mapper = mapper;
            _crear = crear;
            _actualizar = actualizar;
            _listar = listar;
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] UnidadesConductoresDTO dto)
        {
            var entidad = _mapper.Map<UnidadesConductores>(dto);
            await _crear.EjecutarAsync(entidad);
            return Ok(new { mensaje = "Asignación creada correctamente." });
        }

        [HttpPut("{id:guid}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] UnidadesConductoresDTO dto)
        {
            if (id != dto.UnidadConductorId)
                return BadRequest(new { mensaje = "El ID no coincide." });

            var entidad = _mapper.Map<UnidadesConductores>(dto);
            await _actualizar.EjecutarAsync(entidad);
            return Ok(new { mensaje = "Asignación actualizada correctamente." });
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var asignaciones = await _listar.EjecutarAsync();
                var dto = _mapper.Map<IEnumerable<UnidadesConductoresDTO>>(asignaciones);
                return Ok(dto);
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
