using Infrastructure.Data;
using Infrastructure.Repositories;
using Domain.Interfaces;
using Microsoft.EntityFrameworkCore;
using Application.Mapping;
using Application.UseCase.UsuariosUseCase;
using Application.UseCase.UnidadesConductoresUseCase;
using Application.UseCase.UnidadesUseCase;
using Application.UseCase.RutasHorariosUseCase;
using Application.UseCase.RolesUseCase;
using Application.UseCase.IncidenciasUseCase;
using Application.UseCase.ConductoresUseCase;
using Application.UseCase.AsignacionesRutasUseCase;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("Cors", policy =>
    {
        policy
            .WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

// Add services to the container.
builder.Services.AddControllers();

// Swagger/OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

//Configurar conexión a SQL Server
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        b => b.MigrationsAssembly("Infrastructure") // nombre del proyecto donde está el contexto
    ));

// Configurar AutoMapper (para MappingProfile)
builder.Services.AddAutoMapper(typeof(MappingProfile).Assembly);

// Registrar Repositorios
builder.Services.AddScoped<IConductoresRepository, ConductoresRepository>();
builder.Services.AddScoped<IUnidadesRepository, UnidadesRepository>();
builder.Services.AddScoped<IUnidadesConductoresRepository, UnidadesConductoresRepository>();
builder.Services.AddScoped<IRutasHorariosRepository, RutasHorariosRepository>();
builder.Services.AddScoped<IAsignacionesRutasRepository, AsignacionesRutasRepository>();
builder.Services.AddScoped<IIncidenciasRepository, IncidenciasRepository>();
builder.Services.AddScoped<IUsuariosRepository, UsuariosRepository>();
builder.Services.AddScoped<IRolesRepository, RolesRepository>();

// Registrar UseCases
builder.Services.AddScoped<CrearConductorUseCase>();
builder.Services.AddScoped<ListarConductoresUseCase>();
builder.Services.AddScoped<EditarConductorUseCase>();
builder.Services.AddScoped<BuscarConductoresUseCase>();

builder.Services.AddScoped<CrearUnidadUseCase>();
builder.Services.AddScoped<ListarUnidadesUseCase>();
builder.Services.AddScoped<EditarUnidadUseCase>();
builder.Services.AddScoped<BuscarUnidadesUseCase>();

builder.Services.AddScoped<CrearUnidadConductorUseCase>();
builder.Services.AddScoped<ActualizarUnidadConductorUseCase>();
builder.Services.AddScoped<ListarUnidadesConductoresUseCase>();

builder.Services.AddScoped<CrearRutaHorarioUseCase>();
builder.Services.AddScoped<ListarRutasHorariosUseCase>();
builder.Services.AddScoped<EditarRutaHorarioUseCase>();
builder.Services.AddScoped<BuscarRutasHorariosUseCase>();

builder.Services.AddScoped<CrearAsignacionRutaUseCase>();
builder.Services.AddScoped<ListarAsignacionesRutasUseCase>();
builder.Services.AddScoped<EditarAsignacionRutaUseCase>();

builder.Services.AddScoped<CrearIncidenciaUseCase>();
builder.Services.AddScoped<ListarIncidenciasUseCase>();
builder.Services.AddScoped<ActualizarIncidenciaUseCase>();
builder.Services.AddScoped<BuscarIncidenciasUseCase>();

builder.Services.AddScoped<CrearUsuarioUseCase>();
builder.Services.AddScoped<ListarUsuariosUseCase>();
builder.Services.AddScoped<EditarUsuarioUseCase>();
builder.Services.AddScoped<BuscarUsuariosUseCase>();

builder.Services.AddScoped<CrearRolUseCase>();
builder.Services.AddScoped<ListarRolesUseCase>();
builder.Services.AddScoped<EditarRolUseCase>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();
app.UseCors("Cors");
app.Run();
