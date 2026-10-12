

namespace ShipmentService.Entities;

public class Shipment
{
    public int Id { get; set; }

    public string TrackingNumber { get; set; } = string.Empty;

    public string OriginAddress { get; set; } = string.Empty;

    public string DestinationAddress { get; set; } = string.Empty;

    public string Status { get; set; } = "Pending";

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? EstimatedDeliveryDate { get; set; }

    public DateTime? DeliveredAt { get; set; }

    public int CustomerId { get; set; }

    public Customer Customer { get; set; } = null!;

    public ICollection<ShipmentStatusHistory> StatusHistory { get; set; }
        = new List<ShipmentStatusHistory>();
}
