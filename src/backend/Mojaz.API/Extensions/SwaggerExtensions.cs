using System.IO;
using Microsoft.OpenApi.Models;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Builder;
using Swashbuckle.AspNetCore.SwaggerUI;

namespace Mojaz.API.Extensions;

public static class SwaggerExtensions
{
    public static IServiceCollection AddMojazSwagger(this IServiceCollection services)
    {
        services.AddEndpointsApiExplorer();
        services.AddSwaggerGen(options =>
        {
            options.CustomSchemaIds(type => type.FullName);
            options.SwaggerDoc("v1", new OpenApiInfo
            {
                Title = "Mojaz API",
                Version = "v1",
                Description = "Government Driving License Platform API",
                Contact = new OpenApiContact { Name = "Mojaz Team" }
            });

            // XML Documentation logic
            var xmlFile = $"{typeof(Program).Assembly.GetName().Name}.xml";
            var xmlPath = System.IO.Path.Combine(AppContext.BaseDirectory, xmlFile);
            if (System.IO.File.Exists(xmlPath))
            {
                options.IncludeXmlComments(xmlPath);
            }

            // JWT Auth in Swagger - FIXED for proper Authorization header injection
            options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
            {
                Description = "JWT Authorization header using the Bearer scheme.\r\n\r\nEnter 'Bearer' [space] and then your token in the text input below.\r\n\r\nExample: \"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...\"",
                Name = "Authorization",
                In = ParameterLocation.Header,
                Type = SecuritySchemeType.Http,
                Scheme = "bearer",
                BearerFormat = "JWT"
            });

            // Make sure ALL endpoints require this security scheme
            options.AddSecurityRequirement(new OpenApiSecurityRequirement
            {
                {
                    new OpenApiSecurityScheme
                    {
                        Reference = new OpenApiReference
                        {
                            Type = ReferenceType.SecurityScheme,
                            Id = "Bearer"
                        },
                        Scheme = "bearer",
                        Name = "Authorization",
                        In = ParameterLocation.Header
                    },
                    new List<string>()
                }
            });
        });

        return services;
    }

    public static IApplicationBuilder UseMojazSwagger(this IApplicationBuilder app)
    {
        app.UseSwagger();
        app.UseSwaggerUI(c =>
        {
            c.SwaggerEndpoint("/swagger/v1/swagger.json", "Mojaz API v1");
            c.RoutePrefix = "swagger"; // Standard: /swagger
            
            // UI Options - Ensure Try It Out button is enabled
            c.DisplayRequestDuration();
            c.EnableDeepLinking();
            c.ShowExtensions();
            
            // Explicitly enable all HTTP methods for Try It Out
            c.SupportedSubmitMethods(SubmitMethod.Get, SubmitMethod.Post, SubmitMethod.Put, SubmitMethod.Patch, SubmitMethod.Delete);
            
            c.EnableValidator();
            
            // Add "Authorize" button at the top for Bearer token
            c.DocumentTitle = "Mojaz Driving License API";
            
            // Configure OAuth2 Implicit flow for Bearer token
            c.OAuthClientId("mojaz-swagger");
            c.OAuthAppName("Mojaz API - Swagger");
            c.OAuthUsePkce();
        });

        return app;
    }
}
