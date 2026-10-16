
using System.ComponentModel.DataAnnotations;

namespace ShipmentService.DTOs;

public class CreateShipmentDto
{
    [Required]
    [StringLength(200, MinimumLength = 3)]
    public string OriginAddress { get; set; } = string.Empty;

    [Required]
    [StringLength(200, MinimumLength = 3)]
    public string DestinationAddress { get; set; } = string.Empty;

    [Required]
    [Range(1, int.MaxValue)]
    public int CustomerId { get; set; }

    public DateTime? EstimatedDeliveryDate { get; set; }
}
