using Aplication.DTOs;
using Application.UseCase;
using Application.UseCase.AsignacionesRutasUseCase;
using AutoMapper;
using Domain.Entities;
using Domain.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AsignacionesRutasController : ControllerBase
    {
        private readonly IAsignacionesRutasRepository _repository;
        private readonly IMapper _mapper;
        private readonly CrearAsignacionRutaUseCase _crear;
        private readonly ListarAsignacionesRutasUseCase _listar;
        private readonly EditarAsignacionRutaUseCase _editar;

        public AsignacionesRutasController(
            IAsignacionesRutasRepository repository,
            IMapper mapper,
            CrearAsignacionRutaUseCase crear,
            ListarAsignacionesRutasUseCase listar,
            EditarAsignacionRutaUseCase editar)
        {
            _repository = repository;
            _mapper = mapper;
            _crear = crear;
            _listar = listar;
            _editar = editar;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var asignaciones = await _listar.EjecutarAsync();
            var dto = _mapper.Map<IEnumerable<AsignacionesRutasDTO>>(asignaciones);
            return Ok(dto);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] AsignacionesRutasDTO dto)
        {
            var entidad = _mapper.Map<AsignacionesRutas>(dto);
            await _crear.EjecutarAsync(entidad);
            return Ok(new { mensaje = "Asignación registrada correctamente." });
        }

        [HttpPut("{id:guid}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] AsignacionesRutasDTO dto)
        {
            if (id != dto.AsignacionId)
                return BadRequest(new { mensaje = "El ID no coincide." });

            var entidad = _mapper.Map<AsignacionesRutas>(dto);
            await _editar.EjecutarAsync(entidad);
            return Ok(new { mensaje = "Asignación actualizada correctamente." });
        }
    }
}
