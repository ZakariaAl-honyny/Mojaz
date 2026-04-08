using System.Security.Cryptography;
using System.Text;

namespace Mojaz.Shared.Utilities;

public static class PasswordGenerator
{
    private const string LowercaseChars = "abcdefghijklmnopqrstuvwxyz";
    private const string UppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    private const string DigitChars = "0123456789";
    private const string SpecialChars = "!@#$%^&*()_+-=[]{}|;:,.<>?";
    private const int MinPasswordLength = 12;

    public static string GenerateSecurePassword()
    {
        // Use cryptographically secure random number generator
        return GenerateSecurePassword(MinPasswordLength);
    }

    public static string GenerateSecurePassword(int length)
    {
        if (length < MinPasswordLength)
            length = MinPasswordLength;

        var password = new StringBuilder();
        var allChars = LowercaseChars + UppercaseChars + DigitChars + SpecialChars;
        
        // Ensure we have at least one of each character type
        password.Append(GetSecureRandomChar(LowercaseChars));
        password.Append(GetSecureRandomChar(UppercaseChars));
        password.Append(GetSecureRandomChar(DigitChars));
        password.Append(GetSecureRandomChar(SpecialChars));

        // Fill the rest randomly
        for (int i = password.Length; i < length; i++)
        {
            password.Append(GetSecureRandomChar(allChars));
        }

        // Shuffle the password to avoid predictable patterns
        return ShuffleString(password.ToString());
    }

    private static char GetSecureRandomChar(string characters)
    {
        var randomBytes = new byte[4];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(randomBytes);
        var randomIndex = Math.Abs(BitConverter.ToInt32(randomBytes, 0)) % characters.Length;
        return characters[randomIndex];
    }

    private static string ShuffleString(string input)
    {
        var array = input.ToCharArray();
        var n = array.Length;
        
        for (int i = n - 1; i > 0; i--)
        {
            var randomBytes = new byte[4];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomBytes);
            var j = Math.Abs(BitConverter.ToInt32(randomBytes, 0)) % (i + 1);
            
            // Swap
            (array[i], array[j]) = (array[j], array[i]);
        }
        
        return new string(array);
    }
}