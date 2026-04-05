# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy csproj and restore as distinct layers
COPY ["Mojaz.API/Mojaz.API.csproj", "Mojaz.API/"]
COPY ["Mojaz.Application/Mojaz.Application.csproj", "Mojaz.Application/"]
COPY ["Mojaz.Domain/Mojaz.Domain.csproj", "Mojaz.Domain/"]
COPY ["Mojaz.Infrastructure/Mojaz.Infrastructure.csproj", "Mojaz.Infrastructure/"]
COPY ["Mojaz.Shared/Mojaz.Shared.csproj", "Mojaz.Shared/"]

RUN dotnet restore "Mojaz.API/Mojaz.API.csproj"

# Copy everything else and build
COPY . .
WORKDIR "/src/Mojaz.API"
RUN dotnet build "Mojaz.API.csproj" -c Release -o /app/build

# Stage 2: Publish
FROM build AS publish
RUN dotnet publish "Mojaz.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Stage 3: Final
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENV ASPNETCORE_URLS=http://+:5000
EXPOSE 5000
ENTRYPOINT ["dotnet", "Mojaz.API.dll"]
