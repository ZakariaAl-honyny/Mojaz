namespace Mojaz.Application.Interfaces.Services;

using System.Threading.Tasks;

public interface IOtpService
{
    Task<string> GenerateOtpAsync(string destination, string purpose);
    string HashOtp(string otp);
    bool VerifyOtpHash(string otp, string hash);
}
