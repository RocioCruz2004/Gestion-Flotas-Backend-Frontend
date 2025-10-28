using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class firstmigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "conductores",
                columns: table => new
                {
                    conductor_id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    nombre = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    cedula = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    telefono = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    direccion = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    licencia = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    estado = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_conductores", x => x.conductor_id);
                });

            migrationBuilder.CreateTable(
                name: "roles",
                columns: table => new
                {
                    rol_id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    nombre = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    descripcion = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    estado = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_roles", x => x.rol_id);
                });

            migrationBuilder.CreateTable(
                name: "rutas_horarios",
                columns: table => new
                {
                    ruta_horario_id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    nombre = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    origen = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    destino = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    distancia = table.Column<double>(type: "float", nullable: false),
                    hora_salida = table.Column<DateTime>(type: "datetime2", nullable: false),
                    hora_llegada = table.Column<DateTime>(type: "datetime2", nullable: false),
                    dias = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    estado = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_rutas_horarios", x => x.ruta_horario_id);
                });

            migrationBuilder.CreateTable(
                name: "unidades",
                columns: table => new
                {
                    unidad_id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    placa = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    modelo = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    capacidad = table.Column<int>(type: "int", nullable: false),
                    estado = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_unidades", x => x.unidad_id);
                });

            migrationBuilder.CreateTable(
                name: "usuarios",
                columns: table => new
                {
                    usuario_id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    nombre = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    contrasena = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    rol_id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    estado = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_usuarios", x => x.usuario_id);
                    table.ForeignKey(
                        name: "FK_usuarios_roles_rol_id",
                        column: x => x.rol_id,
                        principalTable: "roles",
                        principalColumn: "rol_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "unidades_conductores",
                columns: table => new
                {
                    unidad_conductor_id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    unidad_id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    conductor_id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    estado = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_unidades_conductores", x => x.unidad_conductor_id);
                    table.ForeignKey(
                        name: "FK_unidades_conductores_conductores_conductor_id",
                        column: x => x.conductor_id,
                        principalTable: "conductores",
                        principalColumn: "conductor_id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_unidades_conductores_unidades_unidad_id",
                        column: x => x.unidad_id,
                        principalTable: "unidades",
                        principalColumn: "unidad_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "asignaciones_rutas",
                columns: table => new
                {
                    asignacion_id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    unidad_conductor_id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ruta_horario_id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    fecha_asignacion = table.Column<DateTime>(type: "datetime2", nullable: false),
                    estado = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_asignaciones_rutas", x => x.asignacion_id);
                    table.ForeignKey(
                        name: "FK_asignaciones_rutas_rutas_horarios_ruta_horario_id",
                        column: x => x.ruta_horario_id,
                        principalTable: "rutas_horarios",
                        principalColumn: "ruta_horario_id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_asignaciones_rutas_unidades_conductores_unidad_conductor_id",
                        column: x => x.unidad_conductor_id,
                        principalTable: "unidades_conductores",
                        principalColumn: "unidad_conductor_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "incidencias",
                columns: table => new
                {
                    incidencia_id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    asignacion_id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    fecha = table.Column<DateTime>(type: "datetime2", nullable: false),
                    tipo = table.Column<int>(type: "int", nullable: false),
                    gravedad = table.Column<int>(type: "int", nullable: false),
                    descripcion = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    estado = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_incidencias", x => x.incidencia_id);
                    table.ForeignKey(
                        name: "FK_incidencias_asignaciones_rutas_asignacion_id",
                        column: x => x.asignacion_id,
                        principalTable: "asignaciones_rutas",
                        principalColumn: "asignacion_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_asignaciones_rutas_ruta_horario_id",
                table: "asignaciones_rutas",
                column: "ruta_horario_id");

            migrationBuilder.CreateIndex(
                name: "IX_asignaciones_rutas_unidad_conductor_id",
                table: "asignaciones_rutas",
                column: "unidad_conductor_id");

            migrationBuilder.CreateIndex(
                name: "IX_incidencias_asignacion_id",
                table: "incidencias",
                column: "asignacion_id");

            migrationBuilder.CreateIndex(
                name: "IX_unidades_conductores_conductor_id",
                table: "unidades_conductores",
                column: "conductor_id");

            migrationBuilder.CreateIndex(
                name: "IX_unidades_conductores_unidad_id",
                table: "unidades_conductores",
                column: "unidad_id");

            migrationBuilder.CreateIndex(
                name: "IX_usuarios_rol_id",
                table: "usuarios",
                column: "rol_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "incidencias");

            migrationBuilder.DropTable(
                name: "usuarios");

            migrationBuilder.DropTable(
                name: "asignaciones_rutas");

            migrationBuilder.DropTable(
                name: "roles");

            migrationBuilder.DropTable(
                name: "rutas_horarios");

            migrationBuilder.DropTable(
                name: "unidades_conductores");

            migrationBuilder.DropTable(
                name: "conductores");

            migrationBuilder.DropTable(
                name: "unidades");
        }
    }
}
