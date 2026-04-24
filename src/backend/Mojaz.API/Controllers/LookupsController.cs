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
        new LookupItem { Code = "EC001", NameAr = "مركز فحص القيادة المركزي", NameEn = "Central Driving Test Center", RegionCode = "SA", RegionNameAr = "العاصمة صنعاء" },
        new LookupItem { Code = "EC002", NameAr = "مركز فحص القيادة - عدن", NameEn = "Driving Test Center - Aden", RegionCode = "AD", RegionNameAr = "عدن" },
        new LookupItem { Code = "EC003", NameAr = "مركز فحص القيادة - تعز", NameEn = "Driving Test Center - Taiz", RegionCode = "TZ", RegionNameAr = "تعز" },
        new LookupItem { Code = "EC004", NameAr = "مركز فحص القيادة - الحديدة", NameEn = "Driving Test Center - Hodeidah", RegionCode = "HD", RegionNameAr = "الحديدة" },
        new LookupItem { Code = "EC005", NameAr = "مركز فحص القيادة - إب", NameEn = "Driving Test Center - Ibb", RegionCode = "IB", RegionNameAr = "إب" },
        new LookupItem { Code = "EC006", NameAr = "مركز فحص القيادة - صعدة", NameEn = "Driving Test Center - Saadah", RegionCode = "SD", RegionNameAr = "صعدة" },
        new LookupItem { Code = "EC007", NameAr = "مركز فحص القيادة - المكلا", NameEn = "Driving Test Center - Mukalla", RegionCode = "HM", RegionNameAr = "المكلا" }
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
    [ProducesResponseType(typeof(Mojaz.Shared.ApiResponse<List<LookupItem>>), StatusCodes.Status200OK)]
    public IActionResult GetRegions()
    {
        return Ok(Mojaz.Shared.ApiResponse<List<LookupItem>>.Ok(
            Governorates,
            "تم جلب المحافظات بنجاح"));
    }
}