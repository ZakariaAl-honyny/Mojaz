using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Mojaz.API.Controllers;

/// <summary>
/// Static lookup data for Yemen context - exam centers, nationalities, and governorates.
/// </summary>
[ApiController]
[Route("api/v1/[controller]")]
[AllowAnonymous]
[Produces("application/json")]
public class LookupsController : ControllerBase
{
    /// <summary>
    /// Standard lookup item for dropdown selections.
    /// </summary>
    public class LookupItem
    {
        public string Code { get; set; } = string.Empty;
        public string NameAr { get; set; } = string.Empty;
        public string NameEn { get; set; } = string.Empty;
        public string? RegionCode { get; set; }
        public string? RegionNameAr { get; set; }
    }

    private static readonly List<LookupItem> ExamCenters = new()
    {
        new LookupItem { Code = "9a3e6f21-7d1a-4c9b-8e1f-4d2eaa1b2c3d", NameAr = "مركز فحص القيادة المركزي", NameEn = "Central Driving Test Center", RegionCode = "SA", RegionNameAr = "العاصمة صنعاء" },
        new LookupItem { Code = "8b4f7a32-8e2b-5d0c-9f2a-5e3fbb2c3d4e", NameAr = "مركز فحص القيادة - عدن", NameEn = "Driving Test Center - Aden", RegionCode = "AD", RegionNameAr = "عدن" },
        new LookupItem { Code = "7c5a8b43-9f3c-6e1d-0a3b-6f4acc3d4e5f", NameAr = "مركز فحص القيادة - تعز", NameEn = "Driving Test Center - Taiz", RegionCode = "TZ", RegionNameAr = "تعز" },
        new LookupItem { Code = "6d6b9c54-0a4d-7f2e-1b4c-705bdd4e5f60", NameAr = "مركز فحص القيادة - الحديدة", NameEn = "Driving Test Center - Hodeidah", RegionCode = "HD", RegionNameAr = "الحديدة" },
        new LookupItem { Code = "5e7c0d65-1b5e-803f-2c5d-816cee5f6071", NameAr = "مركز فحص القيادة - إب", NameEn = "Driving Test Center - Ibb", RegionCode = "IB", RegionNameAr = "إب" },
        new LookupItem { Code = "4f8d1e76-2c6f-9140-3d6e-927dff607182", NameAr = "مركز فحص القيادة - صعدة", NameEn = "Driving Test Center - Saadah", RegionCode = "SD", RegionNameAr = "صعدة" },
        new LookupItem { Code = "3a9e2f87-3d70-a251-4e7f-038e00718293", NameAr = "مركز فحص القيادة - المكلا", NameEn = "Driving Test Center - Mukalla", RegionCode = "HM", RegionNameAr = "المكلا" }
    };

    private static readonly List<LookupItem> Nationalities = new()
    {
        new LookupItem { Code = "YE", NameAr = "يمني", NameEn = "Yemeni" },
        new LookupItem { Code = "SA", NameAr = "سعودي", NameEn = "Saudi" },
        new LookupItem { Code = "EG", NameAr = "مصري", NameEn = "Egyptian" },
        new LookupItem { Code = "SD", NameAr = "سوداني", NameEn = "Sudanese" },
        new LookupItem { Code = "IQ", NameAr = "عراقي", NameEn = "Iraqi" },
        new LookupItem { Code = "JO", NameAr = "أردني", NameEn = "Jordanian" },
        new LookupItem { Code = "SY", NameAr = "سوري", NameEn = "Syrian" },
        new LookupItem { Code = "LB", NameAr = "لبناني", NameEn = "Lebanese" },
        new LookupItem { Code = "LY", NameAr = "ليبي", NameEn = "Libyan" },
        new LookupItem { Code = "MA", NameAr = "مغربي", NameEn = "Moroccan" },
        new LookupItem { Code = "DZ", NameAr = "جزائري", NameEn = "Algerian" },
        new LookupItem { Code = "TN", NameAr = "تونسي", NameEn = "Tunisian" },
        new LookupItem { Code = "KW", NameAr = "كويتي", NameEn = "Kuwaiti" },
        new LookupItem { Code = "AE", NameAr = "إماراتي", NameEn = "Emirati" },
        new LookupItem { Code = "QA", NameAr = "قطري", NameEn = "Qatari" },
        new LookupItem { Code = "BH", NameAr = "بحريني", NameEn = "Bahraini" },
        new LookupItem { Code = "OM", NameAr = "عماني", NameEn = "Omani" },
        new LookupItem { Code = "PS", NameAr = "فلسطيني", NameEn = "Palestinian" },
        new LookupItem { Code = "US", NameAr = "أمريكي", NameEn = "American" },
        new LookupItem { Code = "GB", NameAr = "بريطاني", NameEn = "British" },
        new LookupItem { Code = "FR", NameAr = "فرنسي", NameEn = "French" },
        new LookupItem { Code = "DE", NameAr = "ألماني", NameEn = "German" },
        new LookupItem { Code = "TR", NameAr = "تركي", NameEn = "Turkish" },
        new LookupItem { Code = "IN", NameAr = "هندي", NameEn = "Indian" },
        new LookupItem { Code = "PK", NameAr = "باكستاني", NameEn = "Pakistani" },
        new LookupItem { Code = "CN", NameAr = "صيني", NameEn = "Chinese" },
        new LookupItem { Code = "NG", NameAr = "نيجيري", NameEn = "Nigerian" },
        new LookupItem { Code = "ET", NameAr = "إثيوبي", NameEn = "Ethiopian" },
        new LookupItem { Code = "KE", NameAr = "كيني", NameEn = "Kenyan" }
    };

    private static readonly List<LookupItem> Governorates = new()
    {
        new LookupItem { Code = "SA", NameAr = "صنعاء", NameEn = "Sanaa" },
        new LookupItem { Code = "AD", NameAr = "عدن", NameEn = "Aden" },
        new LookupItem { Code = "TZ", NameAr = "تعز", NameEn = "Taiz" },
        new LookupItem { Code = "HD", NameAr = "الحديدة", NameEn = "Hodeidah" },
        new LookupItem { Code = "IB", NameAr = "إب", NameEn = "Ibb" },
        new LookupItem { Code = "SD", NameAr = "صعدة", NameEn = "Saadah" },
        new LookupItem { Code = "HM", NameAr = "المكلا", NameEn = "Mukalla" },
        new LookupItem { Code = "BJ", NameAr = "حجة", NameEn = "Hajjah" },
        new LookupItem { Code = "LH", NameAr = "الحديدة", NameEn = "Lahj" },
        new LookupItem { Code = "MR", NameAr = "مارب", NameEn = "Marib" },
        new LookupItem { Code = "AJ", NameAr = "الجوف", NameEn = "Al Jawf" },
        new LookupItem { Code = "HM2", NameAr = "حضرموت", NameEn = "Hadramaut" },
        new LookupItem { Code = "SH", NameAr = "شبوة", NameEn = "Shabwah" },
        new LookupItem { Code = "BA", NameAr = "البيضاء", NameEn = "Al Bayda" },
        new LookupItem { Code = "MW", NameAr = "المحويت", NameEn = "Al Mahwit" },
        new LookupItem { Code = "RM", NameAr = "ريمه", NameEn = "Raymah" },
        new LookupItem { Code = "HU", NameAr = "الحديدة", NameEn = "Al Hudaydah" },
        new LookupItem { Code = "AB", NameAr = "أبين", NameEn = "Abyan" },
        new LookupItem { Code = "DA", NameAr = "الضالع", NameEn = "Dhamar" },
        new LookupItem { Code = "DH", NameAr = "الظهران", NameEn = "Dhale" },
        new LookupItem { Code = "SN", NameAr = "سقطرى", NameEn = "Socotra" }
    };

    /// <summary>
    /// Get all exam centers for driving tests.
    /// </summary>
    /// <returns>List of exam centers</returns>
    [HttpGet("exam-centers")]
    [ProducesResponseType(typeof(Mojaz.Shared.ApiResponse<List<LookupItem>>), StatusCodes.Status200OK)]
    public IActionResult GetExamCenters()
    {
        return Ok(Mojaz.Shared.ApiResponse<List<LookupItem>>.Ok(
            ExamCenters,
            "تم جلب مراكز الفحص بنجاح"));
    }

    /// <summary>
    /// Get all nationalities (Yemen context).
    /// </summary>
    /// <returns>List of nationalities</returns>
    [HttpGet("nationalities")]
    [ProducesResponseType(typeof(Mojaz.Shared.ApiResponse<List<LookupItem>>), StatusCodes.Status200OK)]
    public IActionResult GetNationalities()
    {
        return Ok(Mojaz.Shared.ApiResponse<List<LookupItem>>.Ok(
            Nationalities,
            "تم جلب الجنسيات بنجاح"));
    }

    /// <summary>
    /// Get all Yemen governorates (regions).
    /// </summary>
    /// <returns>List of governorates</returns>
    [HttpGet("regions")]
    [HttpGet("provinces")]
    [ProducesResponseType(typeof(Mojaz.Shared.ApiResponse<List<LookupItem>>), StatusCodes.Status200OK)]
    public IActionResult GetRegions()
    {
        return Ok(Mojaz.Shared.ApiResponse<List<LookupItem>>.Ok(
            Governorates,
            "تم جلب المحافظات بنجاح"));
    }

    /// <summary>
    /// Get all lookups in one call.
    /// </summary>
    [HttpGet]
    public IActionResult GetAllLookups()
    {
        return Ok(Mojaz.Shared.ApiResponse<object>.Ok(new
        {
            ExamCenters,
            Nationalities,
            Governorates
        }, "تم جلب جميع البيانات المرجعية بنجاح"));
    }
}