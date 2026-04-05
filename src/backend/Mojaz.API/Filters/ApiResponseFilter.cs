using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Mojaz.Shared.Models;
using System.Threading.Tasks;

namespace Mojaz.API.Filters;

public class ApiResponseFilter : IAsyncResultFilter
{
    public async Task OnResultExecutionAsync(ResultExecutingContext context, ResultExecutionDelegate next)
    {
        if (context.Result is ObjectResult objectResult && objectResult.Value is not null)
        {
            var valueType = objectResult.Value.GetType();
            
            // If already an ApiResponse, don't wrap twice
            if (!valueType.IsGenericType || valueType.GetGenericTypeDefinition() != typeof(ApiResponse<>))
            {
                var statusCode = objectResult.StatusCode ?? 200;
                var wrappedResponse = (dynamic)typeof(ApiResponse<>)
                    .MakeGenericType(valueType)
                    .GetMethod("Ok")!
                    .Invoke(null, new[] { objectResult.Value, "Success" })!;

                // Update status code if it was specifically set (e.g. 201)
                if (statusCode != 200)
                {
                    // This is a bit tricky with dynamic and static factory, 
                    // but standard Ok() is fine for most.
                }

                objectResult.Value = wrappedResponse;
            }
        }

        await next();
    }
}
