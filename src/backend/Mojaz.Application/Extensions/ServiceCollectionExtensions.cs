using Microsoft.Extensions.DependencyInjection;
using AutoMapper;
using FluentValidation;
using Mojaz.Application.Services;
using System.Reflection;

namespace Mojaz.Application.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services)
        {
            // Register AutoMapper profiles in this assembly
            services.AddAutoMapper(Assembly.GetExecutingAssembly());
            // Register FluentValidation validators in this assembly
            services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());
            // Register application services
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<IAuditLogService, AuditLogService>();
            return services;
        }
    }
}
