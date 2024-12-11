using Microsoft.EntityFrameworkCore;
using Microsoft.OData.Edm;
using Microsoft.OData.ModelBuilder;
using Microsoft.AspNetCore.OData;
using BussinessObject.Dto;
using BussinessObject.Models;

namespace BussinessObject
{
    public class Program
    {
        public static void Main(string[] args)
        {
            Environment.SetEnvironmentVariable("TEMP", "D:\\Temp");
            Environment.SetEnvironmentVariable("TMP", "D:\\Temp");

            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            builder.Services.AddControllers(options =>
            {
                options.RespectBrowserAcceptHeader = true; // Content Negotiation
            })
            .AddNewtonsoftJson(options =>
            {
                options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
            })
            .AddXmlSerializerFormatters()
            .AddOData(opt => opt.Select().Filter().OrderBy().Expand().SetMaxTop(100).Count());

            // Configure DbContext
            builder.Services.AddDbContext<ShoeStoreContext>(
                options => options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

            // Configure AutoMapper
             builder.Services.AddAutoMapper(typeof(MapperConfig));

            // Add CORS policy
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowAll", policy =>
                {
                    policy.AllowAnyOrigin()
                          .AllowAnyMethod()
                          .AllowAnyHeader();
                });
            });
            builder.Services.AddDistributedMemoryCache(); // Cấu hình bộ nhớ cho session
            builder.Services.AddSession(options =>
            {
                options.IdleTimeout = TimeSpan.FromMinutes(30);
                options.Cookie.HttpOnly = true;
                options.Cookie.IsEssential = true;
            });
            // Add Swagger/OpenAPI
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            var app = builder.Build();

            // Configure middleware
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();
            app.UseCors("AllowAll");
            app.UseSession();

            app.UseAuthorization();
            app.MapControllers();
            app.Run();
        }
    }
}
