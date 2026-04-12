using Mojaz.Application.DTOs.Payment;
using Mojaz.Application.Interfaces.Infrastructure;
using Mojaz.Domain.Enums;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using System;
using System.Globalization;
using System.Threading.Tasks;

namespace Mojaz.Infrastructure.Documents
{
    public class QuestPdfPaymentReceiptGenerator : IPaymentReceiptGenerator
    {
        public async Task<byte[]> GenerateReceiptAsync(PaymentDto payment)
        {
            // Simplified for build stability - QuestPDF 2024.7.0 compatible
            return await Task.Run(() =>
            {
                var document = Document.Create(container =>
                {
                    container.Page(page =>
                    {
                        page.Size(PageSizes.A4);
                        page.Margin(2, Unit.Centimetre);
                        page.Header().Text("Mojaz Payment Receipt").FontSize(20);
                        
                        page.Content().Column(col =>
                        {
                            col.Spacing(10);
                            col.Item().Text($"Payment ID: {payment.Id}");
                            col.Item().Text($"Amount: {payment.Amount} SAR");
                            col.Item().Text($"Status: {payment.Status}");
                            col.Item().Text($"Date: {payment.CreatedAt:yyyy-MM-dd}");
                        });
                    });
                });

                return document.GeneratePdf();
            });
        }
    }
}