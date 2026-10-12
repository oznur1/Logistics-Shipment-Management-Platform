

namespace ShipmentService.Entities;

public class Customer
{
    public int Id { get; set; }

    public string CompanyName { get; set; } = string.Empty;

    public string ContactName { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string PhoneNumber { get; set; } = string.Empty;

    public string Address { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<Shipment> Shipments { get; set; }
        = new List<Shipment>();
}
