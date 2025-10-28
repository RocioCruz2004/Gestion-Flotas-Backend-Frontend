using Aplication.DTOs;
using Application.UseCase;
using Application.UseCase.RolesUseCase;
using AutoMapper;
using Domain.Entities;
using Domain.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RolesController : ControllerBase
    {
        private readonly IRolesRepository _repository;
        private readonly IMapper _mapper;
        private readonly CrearRolUseCase _crear;
        private readonly ListarRolesUseCase _listar;
        private readonly EditarRolUseCase _editar;

        public RolesController(
            IRolesRepository repository,
            IMapper mapper,
            CrearRolUseCase crear,
            ListarRolesUseCase listar,
            EditarRolUseCase editar)
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
            var roles = await _listar.EjecutarAsync();
            var dto = _mapper.Map<IEnumerable<RolesDTO>>(roles);
            return Ok(dto);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] RolesDTO dto)
        {
            var entidad = _mapper.Map<Roles>(dto);
            await _crear.EjecutarAsync(entidad);
            return Ok(new { mensaje = "Rol registrado correctamente." });
        }

        [HttpPut("{id:guid}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] RolesDTO dto)
        {
            var entidad = _mapper.Map<Roles>(dto);
            await _editar.EjecutarAsync(entidad);
            return Ok(new { mensaje = "Rol actualizado correctamente." });
        }
    }
}
