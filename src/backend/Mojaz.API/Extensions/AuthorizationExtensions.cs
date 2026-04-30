using Microsoft.AspNetCore.Authorization;
using Mojaz.Shared.Constants;

namespace Mojaz.API.Extensions
{
    public static class AuthorizationExtensions
    {
        public static void AddPolicies(this AuthorizationOptions options)
        {
            options.AddPolicy(RolePolicies.AdminOnly, policy => 
                policy.RequireRole(Roles.Admin));
            
            options.AddPolicy(RolePolicies.EmployeeOnly, policy => 
                policy.RequireClaim("role", 
                    Roles.Admin, 
                    Roles.Receptionist, 
                    Roles.Doctor, 
                    Roles.Examiner, 
                    Roles.Manager, 
                    Roles.Security));
            
            options.AddPolicy(RolePolicies.ApplicantOnly, policy => 
                policy.RequireClaim("role", Roles.Applicant));
                
            options.AddPolicy(RolePolicies.ReceptionistOrAbove, policy => 
                policy.RequireClaim("role", 
                    Roles.Admin, 
                    Roles.Receptionist,
                    Roles.Doctor,
                    Roles.Manager));
                    
            options.AddPolicy(RolePolicies.ExaminerOrAbove, policy => 
                policy.RequireClaim("role", 
                    Roles.Admin, 
                    Roles.Receptionist, 
                    Roles.Doctor, 
                    Roles.Examiner,
                    Roles.Manager));
                    
            options.AddPolicy(RolePolicies.ManagerOrAbove, policy => 
                policy.RequireClaim("role", 
                    Roles.Admin, 
                    Roles.Manager));
            
            // Allow Manager and Admin to view users
            options.AddPolicy("ManagerOrAdmin", policy => 
                policy.RequireClaim("role", 
                    Roles.Admin, 
                    Roles.Manager));
        }
    }
}