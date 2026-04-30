using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Mojaz.Domain.Enums;
using Mojaz.Shared;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Mojaz.API.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
[AllowAnonymous]
[Produces("application/json")]
public class ServicesController : ControllerBase
{
    public class ServiceItem
    {
        public string Code { get; set; } = string.Empty;
        public string NameAr { get; set; } = string.Empty;
        public string NameEn { get; set; } = string.Empty;
        public string DescriptionAr { get; set; } = string.Empty;
        public bool IsActive { get; set; } = true;
    }

    private static readonly List<ServiceItem> AvailableServices = new()
    {
        new ServiceItem { Code = "NewLicense", NameAr = "إصدار رخصة جديدة", NameEn = "New License Issuance", DescriptionAr = "طلب إصدار رخصة قيادة لأول مرة" },
        new ServiceItem { Code = "Renewal", NameAr = "تجديد رخصة", NameEn = "License Renewal", DescriptionAr = "تجديد رخصة قيادة منتهية أو قاربت على الانتهاء" },
        new ServiceItem { Code = "Replacement", NameAr = "بدل تالف/فاقد", NameEn = "License Replacement", DescriptionAr = "إصدار بدل تالف أو بدل فاقد لرخصة قيادة سارية" },
        new ServiceItem { Code = "CategoryUpgrade", NameAr = "ترقية فئة الرخصة", NameEn = "Category Upgrade", DescriptionAr = "إضافة فئة جديدة إلى رخصة القيادة الحالية" },
        new ServiceItem { Code = "InternationalLicense", NameAr = "رخصة دولية", NameEn = "International License", DescriptionAr = "استخراج رخصة قيادة دولية معتمدة" },
        new ServiceItem { Code = "TemporaryLicense", NameAr = "رخصة مؤقتة", NameEn = "Temporary License", DescriptionAr = "إصدار تصريح قيادة مؤقت (تعليم)" }
    };

    /// <summary>
    /// Get all available license services.
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<List<ServiceItem>>), StatusCodes.Status200OK)]
    public IActionResult GetServices()
    {
        return Ok(ApiResponse<List<ServiceItem>>.Ok(AvailableServices, "تم جلب الخدمات بنجاح"));
    }
}
