using Microsoft.EntityFrameworkCore;
using ShipmentService.Data;

var builder = WebApplication.CreateBuilder(args);

//ASP.NET Core'a, AppDbContext sınıfını kullanarak SQL Server veritabanına nasıl bağlanacağını belirlemek.
builder.Services.AddDbContext<AppDbContext>(options =>options.UseSqlServer(
    builder.Configuration.GetConnectionString("DefaultConnection")
));

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
