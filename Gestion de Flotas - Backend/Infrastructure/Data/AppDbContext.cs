using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        // Tablas (DbSet)
        public DbSet<Conductores> Conductores { get; set; }
        public DbSet<Unidades> Unidades { get; set; }
        public DbSet<UnidadesConductores> UnidadesConductores { get; set; }
        public DbSet<RutasHorarios> RutasHorarios { get; set; }
        public DbSet<AsignacionesRutas> AsignacionesRutas { get; set; }
        public DbSet<Incidencias> Incidencias { get; set; }
        public DbSet<Usuarios> Usuarios { get; set; }
        public DbSet<Roles> Roles { get; set; }
    }
}
