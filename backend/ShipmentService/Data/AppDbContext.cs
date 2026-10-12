
using Microsoft.EntityFrameworkCore;
using ShipmentService.Entities;

namespace ShipmentService.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<Customer> Customers => Set<Customer>();

    public DbSet<Shipment> Shipments => Set<Shipment>();

    public DbSet<ShipmentStatusHistory> ShipmentStatusHistories
        => Set<ShipmentStatusHistory>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Customer>()
            .HasMany(customer => customer.Shipments)
            .WithOne(shipment => shipment.Customer)
            .HasForeignKey(shipment => shipment.CustomerId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Shipment>()
            .HasMany(shipment => shipment.StatusHistory)
            .WithOne(history => history.Shipment)
            .HasForeignKey(history => history.ShipmentId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Shipment>()
            .HasIndex(shipment => shipment.TrackingNumber)
            .IsUnique();
    }
}
