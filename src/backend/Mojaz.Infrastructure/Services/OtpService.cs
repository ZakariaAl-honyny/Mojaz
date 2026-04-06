using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Mojaz.Application.Interfaces.Services;

namespace Mojaz.Infrastructure.Services;

public class OtpService : IOtpService
{
    public async Task<string> GenerateOtpAsync(string destination, string purpose)
    {
        // Generates a 6-digit OTP
        var bytes = new byte[4];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(bytes);
        var code = (BitConverter.ToUInt32(bytes, 0) % 1000000).ToString("D6");
        return await Task.FromResult(code);
    }

    public string HashOtp(string otp)
    {
        using var sha = SHA256.Create();
        var bytes = Encoding.UTF8.GetBytes(otp);
        var hash = sha.ComputeHash(bytes);
        return Convert.ToBase64String(hash);
    }

    public bool VerifyOtpHash(string otp, string hash)
    {
        var computed = HashOtp(otp);
        return computed == hash;
    }
}
