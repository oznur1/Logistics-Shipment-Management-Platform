
using Microsoft.EntityFrameworkCore;
using ShipmentService.Data;
using ShipmentService.Services;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// Angular uygulaması için CORS izni
builder.Services.AddCors(options =>
{
    options.AddPolicy("AngularDevelopment", policy =>
    {
        policy
            .WithOrigins("http://localhost:4200")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

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

// Uygulama burada oluşturuluyor
var app = builder.Build();

// Development ortamında OpenAPI belgesi
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

// CORS middleware
app.UseCors("AngularDevelopment");

app.UseAuthorization();

app.MapControllers();

app.Run();
