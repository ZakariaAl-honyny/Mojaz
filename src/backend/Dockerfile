# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy csproj and restore as distinct layers
COPY ["DrivingLicenseIssuanceSystem.API/DrivingLicenseIssuanceSystem.API.csproj", "DrivingLicenseIssuanceSystem.API/"]
COPY ["DrivingLicenseIssuanceSystem.Application/DrivingLicenseIssuanceSystem.Application.csproj", "DrivingLicenseIssuanceSystem.Application/"]
COPY ["DrivingLicenseIssuanceSystem.Domain/DrivingLicenseIssuanceSystem.Domain.csproj", "DrivingLicenseIssuanceSystem.Domain/"]
COPY ["DrivingLicenseIssuanceSystem.Infrastructure/DrivingLicenseIssuanceSystem.Infrastructure.csproj", "DrivingLicenseIssuanceSystem.Infrastructure/"]
COPY ["DrivingLicenseIssuanceSystem.Shared/DrivingLicenseIssuanceSystem.Shared.csproj", "DrivingLicenseIssuanceSystem.Shared/"]

RUN dotnet restore "DrivingLicenseIssuanceSystem.API/DrivingLicenseIssuanceSystem.API.csproj"

# Copy everything else and build
COPY . .
WORKDIR "/src/DrivingLicenseIssuanceSystem.API"
RUN dotnet build "DrivingLicenseIssuanceSystem.API.csproj" -c Release -o /app/build

# Stage 2: Publish
FROM build AS publish
RUN dotnet publish "DrivingLicenseIssuanceSystem.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Stage 3: Final
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENV ASPNETCORE_URLS=http://+:5000
EXPOSE 5000
ENTRYPOINT ["dotnet", "DrivingLicenseIssuanceSystem.API.dll"]
