using System;

namespace Mojaz.Application.DTOs.License
{
    public class UpgradeTargetCategoryDto
    {
        public Guid Id { get; set; }
        public string Code { get; set; } = string.Empty;
        public string NameEn { get; set; } = string.Empty;
        public string NameAr { get; set; } = string.Empty;
        public string DescriptionEn { get; set; } = string.Empty;
        public string DescriptionAr { get; set; } = string.Empty;
        public int MinAge { get; set; }
        public bool RequiresFieldTest { get; set; }
    }
}
