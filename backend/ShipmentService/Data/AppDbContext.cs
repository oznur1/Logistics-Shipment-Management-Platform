
using Microsoft.EntityFrameworkCore;
using ShipmentService.Entities;

namespace ShipmentService.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    // Veritabanı tabloları
    public DbSet<Customer> Customers => Set<Customer>();

    public DbSet<Shipment> Shipments => Set<Shipment>();

    public DbSet<ShipmentStatusHistory> ShipmentStatusHistories
        => Set<ShipmentStatusHistory>();

    public DbSet<AppUser> AppUsers => Set<AppUser>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Kullanıcı ayarları
        modelBuilder.Entity<AppUser>()
            .HasIndex(user => user.Email)
            .IsUnique();

        modelBuilder.Entity<AppUser>()
            .Property(user => user.FullName)
            .HasMaxLength(100)
            .IsRequired();

        modelBuilder.Entity<AppUser>()
            .Property(user => user.Email)
            .HasMaxLength(256)
            .IsRequired();

        modelBuilder.Entity<AppUser>()
            .Property(user => user.PasswordHash)
            .IsRequired();

        modelBuilder.Entity<AppUser>()
            .Property(user => user.Role)
            .HasMaxLength(20)
            .IsRequired();

        // Customer - Shipment ilişkisi
        modelBuilder.Entity<Customer>()
            .HasMany(customer => customer.Shipments)
            .WithOne(shipment => shipment.Customer)
            .HasForeignKey(shipment => shipment.CustomerId)
            .OnDelete(DeleteBehavior.Restrict);

        // Shipment - ShipmentStatusHistory ilişkisi
        modelBuilder.Entity<Shipment>()
            .HasMany(shipment => shipment.StatusHistory)
            .WithOne(history => history.Shipment)
            .HasForeignKey(history => history.ShipmentId)
            .OnDelete(DeleteBehavior.Cascade);

        // Takip numarası benzersiz olmalı
        modelBuilder.Entity<Shipment>()
            .HasIndex(shipment => shipment.TrackingNumber)
            .IsUnique();
    }
}
