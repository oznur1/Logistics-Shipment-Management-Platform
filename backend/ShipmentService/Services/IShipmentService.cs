
using ShipmentService.DTOs;
using ShipmentService.Entities;

namespace ShipmentService.Services;

public interface IShipmentService
{
    Task<Shipment> CreateShipmentAsync(CreateShipmentDto dto);

    Task<List<Shipment>> GetAllShipmentsAsync();

    Task<Shipment?> GetShipmentByIdAsync(int id);

    Task<Shipment?> UpdateShipmentAsync(int id, UpdateShipmentDto dto);

    Task<bool> DeleteShipmentAsync(int id);
}
