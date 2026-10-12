
namespace ShipmentService.Entities;

public class ShipmentStatusHistory
{
    public int Id { get; set; }

    public int ShipmentId { get; set; }

    public string Status { get; set; } = string.Empty;

    public string? Description { get; set; }

    public DateTime ChangedAt { get; set; } = DateTime.UtcNow;

    public Shipment Shipment { get; set; } = null!;
}
