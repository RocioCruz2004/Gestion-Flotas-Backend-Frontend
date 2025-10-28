using Aplication.DTOs;
using Application.UseCase.UsuariosUseCase;
using AutoMapper;
using Domain.Entities;
using Domain.Enums;
using Domain.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsuariosController : ControllerBase
    {
        private readonly IUsuariosRepository _repository;
        private readonly IMapper _mapper;
        private readonly CrearUsuarioUseCase _crear;
        private readonly ListarUsuariosUseCase _listar;
        private readonly EditarUsuarioUseCase _editar;
        private readonly BuscarUsuariosUseCase _buscar;

        public UsuariosController(
            IUsuariosRepository repository,
            IMapper mapper,
            CrearUsuarioUseCase crear,
            ListarUsuariosUseCase listar,
            EditarUsuarioUseCase editar,
            BuscarUsuariosUseCase buscar)
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
            var usuarios = await _listar.EjecutarAsync();
            var dto = _mapper.Map<IEnumerable<UsuariosDTO>>(usuarios);
            return Ok(dto);
        }

        [HttpGet("buscar")]
        public async Task<IActionResult> Buscar(
            [FromQuery] string? nombre,
            [FromQuery] string? email,
            [FromQuery] Guid? rolId,
            [FromQuery] UsuariosEnums? estado)
        {
            var usuarios = await _buscar.EjecutarAsync(nombre, email, rolId, estado);
            var dto = _mapper.Map<IEnumerable<UsuariosDTO>>(usuarios);
            return Ok(dto);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] UsuariosDTO dto)
        {
            var entidad = _mapper.Map<Usuarios>(dto);
            await _crear.EjecutarAsync(entidad);
            return Ok(new { mensaje = "Usuario registrado correctamente." });
        }

        [HttpPut("{id:guid}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] UsuariosDTO dto)
        {
            if (id != dto.UsuarioId)
                return BadRequest(new { mensaje = "El ID no coincide." });

            var entidad = _mapper.Map<Usuarios>(dto);
            await _editar.EjecutarAsync(entidad);
            return Ok(new { mensaje = "Usuario actualizado correctamente." });
        }
    }
}
