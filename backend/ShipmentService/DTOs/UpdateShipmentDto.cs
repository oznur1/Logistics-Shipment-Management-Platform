using System.ComponentModel.DataAnnotations;

namespace ShipmentService.DTOs;

public class UpdateShipmentDto
{
    [Required]
    [StringLength(200, MinimumLength = 3)]
    public string OriginAddress { get; set; } = string.Empty;

    [Required]
    [StringLength(200, MinimumLength = 3)]
    public string DestinationAddress { get; set; } = string.Empty;

    [Required]
    [StringLength(50)]
    public string Status { get; set; } = string.Empty;

    public DateTime? EstimatedDeliveryDate { get; set; }
}