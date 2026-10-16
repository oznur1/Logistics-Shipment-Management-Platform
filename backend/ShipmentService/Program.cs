
using Microsoft.EntityFrameworkCore;
using ShipmentService.Data;
using ShipmentService.Services;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// SQL Server veritabanı bağlantısı
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")
    )
);

// Controller ve JSON serileştirme ayarları
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler =
            ReferenceHandler.IgnoreCycles;
    });

// Shipment Service bağımlılık kaydı
builder.Services.AddScoped<
    IShipmentService,
    ShipmentService.Services.ShipmentService
>();

// OpenAPI yapılandırması
builder.Services.AddOpenApi();

var app = builder.Build();

// Development ortamında OpenAPI belgesi
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
