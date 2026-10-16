
using Microsoft.EntityFrameworkCore;
using ShipmentService.Data;
using ShipmentService.DTOs;
using ShipmentService.Entities;

namespace ShipmentService.Services;

public class ShipmentService : IShipmentService
{
    private readonly AppDbContext _context;

    public ShipmentService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Shipment> CreateShipmentAsync(CreateShipmentDto dto)
    {
        var customerExists = await _context.Customers
            .AnyAsync(customer => customer.Id == dto.CustomerId);

        if (!customerExists)
        {
            throw new KeyNotFoundException(
                $"Customer with ID {dto.CustomerId} was not found.");
        }

        var shipment = new Shipment
        {
            TrackingNumber =
                $"SHP-{Guid.NewGuid().ToString("N")[..12].ToUpperInvariant()}",
            OriginAddress = dto.OriginAddress,
            DestinationAddress = dto.DestinationAddress,
            CustomerId = dto.CustomerId,
            Status = "Pending",
            CreatedAt = DateTime.UtcNow,
            EstimatedDeliveryDate = dto.EstimatedDeliveryDate
        };

        shipment.StatusHistory.Add(new ShipmentStatusHistory
        {
            Status = "Pending",
            Description = "Shipment created.",
            ChangedAt = DateTime.UtcNow
        });

        _context.Shipments.Add(shipment);

        await _context.SaveChangesAsync();

        return shipment;
    }

    public async Task<List<Shipment>> GetAllShipmentsAsync()
{
    return await _context.Shipments
        .AsNoTracking()
        .Include(shipment => shipment.Customer)
        .Include(shipment => shipment.StatusHistory)
        .OrderByDescending(shipment => shipment.CreatedAt)
        .ToListAsync();
}
   public async Task<Shipment?> GetShipmentByIdAsync(int id)
{
    return await _context.Shipments
        .AsNoTracking()
        .Include(shipment => shipment.Customer)
        .Include(shipment => shipment.StatusHistory)
        .FirstOrDefaultAsync(shipment => shipment.Id == id);
}

    public async Task<Shipment?> UpdateShipmentAsync(
        int id,
        UpdateShipmentDto dto)
    {
        var shipment = await _context.Shipments
            .FirstOrDefaultAsync(shipment => shipment.Id == id);

        if (shipment is null)
        {
            return null;
        }

        shipment.OriginAddress = dto.OriginAddress;
        shipment.DestinationAddress = dto.DestinationAddress;
        shipment.EstimatedDeliveryDate = dto.EstimatedDeliveryDate;

        if (shipment.Status != dto.Status)
        {
            shipment.Status = dto.Status;

            shipment.StatusHistory.Add(new ShipmentStatusHistory
            {
                Status = dto.Status,
                Description = "Shipment status updated.",
                ChangedAt = DateTime.UtcNow
            });
        }

        await _context.SaveChangesAsync();

        return shipment;
    }

    public async Task<bool> DeleteShipmentAsync(int id)
    {
        var shipment = await _context.Shipments
            .FirstOrDefaultAsync(shipment => shipment.Id == id);

        if (shipment is null)
        {
            return false;
        }

        _context.Shipments.Remove(shipment);

        await _context.SaveChangesAsync();

        return true;
    }
}
