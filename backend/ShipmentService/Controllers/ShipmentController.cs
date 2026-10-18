
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ShipmentService.DTOs;
using ShipmentService.Services;

namespace ShipmentService.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ShipmentController : ControllerBase
{
    private readonly IShipmentService _shipmentService;

    public ShipmentController(IShipmentService shipmentService)
    {
        _shipmentService = shipmentService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var shipments = await _shipmentService.GetAllShipmentsAsync();

        return Ok(shipments);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var shipment = await _shipmentService.GetShipmentByIdAsync(id);

        if (shipment is null)
        {
            return NotFound(new
            {
                message = $"Shipment with ID {id} was not found."
            });
        }

        return Ok(shipment);
    }

    [HttpPost]
    public async Task<IActionResult> Create(
        [FromBody] CreateShipmentDto dto)
    {
        try
        {
            var shipment = await _shipmentService.CreateShipmentAsync(dto);

            return CreatedAtAction(
                nameof(GetById),
                new { id = shipment.Id },
                shipment);
        }
        catch (KeyNotFoundException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(
        int id,
        [FromBody] UpdateShipmentDto dto)
    {
        var shipment = await _shipmentService.UpdateShipmentAsync(id, dto);

        if (shipment is null)
        {
            return NotFound(new
            {
                message = $"Shipment with ID {id} was not found."
            });
        }

        return Ok(shipment);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _shipmentService.DeleteShipmentAsync(id);

        if (!deleted)
        {
            return NotFound(new
            {
                message = $"Shipment with ID {id} was not found."
            });
        }

        return NoContent();
    }
}
