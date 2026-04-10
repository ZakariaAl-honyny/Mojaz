using Mojaz.Application.Interfaces.Infrastructure;
using Mojaz.Domain.Entities;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using System;
using System.Threading.Tasks;

namespace Mojaz.Infrastructure.Documents
{
    public class QuestPdfLicenseGenerator : ILicensePdfGenerator
    {
        public async Task<byte[]> GenerateLicensePdfAsync(License license, User holder, LicenseCategory category)
        {
            return await Task.Run(() =>
            {
                var document = Document.Create(container =>
                {
                    container.Page(page =>
                    {
                        page.Size(PageSizes.A4);
                        page.Margin(1, Unit.Centimetre);
                        page.PageColor(Colors.White);
                        
                        // Default Font
                        page.DefaultTextStyle(x => x.FontSize(12).FontFamily("Arial"));

                        page.Content().Column(col =>
                        {
                            col.Spacing(10);

                            // License Card Container
                            col.Item().Border(1).BorderColor(Colors.Green.Medium).Background(Colors.Grey.Lighten5).Padding(20).Column(innerCol =>
                            {
                                innerCol.Spacing(15);

                                // Header
                                innerCol.Item().Row(row =>
                                {
                                    row.RelativeItem().Column(headerCol =>
                                    {
                                        headerCol.Item().Text("Kingdom of Saudi Arabia").FontSize(14).Bold().FontColor("#006C35");
                                        headerCol.Item().Text("Ministry of Interior").FontSize(12).FontColor("#006C35");
                                        headerCol.Item().Text("Driving License").FontSize(16).Bold().FontColor("#006C35");
                                    });

                                    row.ConstantItem(60).Height(60).Placeholder(); // Logo Placeholder
                                });

                                innerCol.Item().LineHorizontal(1).LineColor(Colors.Green.Medium);

                                // Main Info
                                innerCol.Item().Row(row =>
                                {
                                    // Left Side: Text Details
                                    row.RelativeItem().Column(detailsCol =>
                                    {
                                        detailsCol.Spacing(5);
                                        
                                        detailsCol.Item().Row(r => {
                                            r.ConstantItem(100).Text("License No:").Bold();
                                            r.RelativeItem().Text(license.LicenseNumber);
                                        });

                                        detailsCol.Item().Row(r => {
                                            r.ConstantItem(100).Text("Holder Name:").Bold();
                                            r.RelativeItem().Text(holder.FullNameEn);
                                        });

                                        detailsCol.Item().Row(r => {
                                            r.ConstantItem(100).Text("National ID:").Bold();
                                            r.RelativeItem().Text(holder.NationalId ?? "N/A");
                                        });

                                        detailsCol.Item().Row(r => {
                                            r.ConstantItem(100).Text("Category:").Bold();
                                            r.RelativeItem().Text($"{category.Code} - {category.NameEn}");
                                        });
                                    });

                                    // Right Side: QR Code & Photo Placeholder
                                    row.ConstantItem(120).Column(rightCol =>
                                    {
                                        rightCol.Spacing(5);
                                        rightCol.Item().Width(100).Height(120).Placeholder(); // Photo Placeholder
                                        rightCol.Item().AlignCenter().Width(80).Height(80).Placeholder(); // QR Placeholder
                                    });
                                });

                                innerCol.Item().LineHorizontal(1).LineColor(Colors.Green.Medium);

                                // Footer Dates
                                innerCol.Item().Row(row =>
                                {
                                    row.RelativeItem().Text($"Issue Date: {license.IssuedAt:yyyy-MM-dd}").FontSize(10);
                                    row.RelativeItem().Text($"Expiry Date: {license.ExpiresAt:yyyy-MM-dd}").FontSize(10).FontColor(Colors.Red.Medium);
                                    row.RelativeItem().AlignRight().Text("MOJAZ PLATFORM").FontSize(10).Bold();
                                });
                            });
                            
                            // Arabic Version (Simplified RTL Simulation)
                            col.Item().PaddingTop(20).Text("Document for verification purposes only.").FontSize(8).Italic().AlignCenter();
                        });
                    });
                });

                return document.GeneratePdf();
            });
        }
    }
}
