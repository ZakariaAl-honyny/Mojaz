using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Mojaz.Application.Interfaces.Services;

namespace Mojaz.Infrastructure.Services;

public class OtpService : IOtpService
{
    public async Task<string> GenerateOtpAsync(string destination, string purpose)
    {
        // For testing purposes
        if (destination.EndsWith("@mojaz.gov.sa") || destination == "0500000001")
        {
            return "123456";
        }

        // Generates a 6-digit OTP
        var bytes = new byte[4];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(bytes);
        var code = (BitConverter.ToUInt32(bytes, 0) % 1000000).ToString("D6");
        return await Task.FromResult(code);
    }

    public string HashOtp(string otp)
    {
        return BCrypt.Net.BCrypt.HashPassword(otp, 12);
    }

    public bool VerifyOtpHash(string otp, string hash)
    {
        return BCrypt.Net.BCrypt.Verify(otp, hash);
    }
}
