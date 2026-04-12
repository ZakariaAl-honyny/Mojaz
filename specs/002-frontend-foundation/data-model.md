# Data Model: Frontend Foundation

## Entities

### `AuthStore` (Zustand Global State)
Manages the current user's session state on the client.
- **Fields**:
  - `user`: User Profile Object (nullable)
  - `accessToken`: String (JWT) (nullable)
  - `refreshToken`: String (nullable)
  - `isAuthenticated`: Boolean (computed/derived)
  - `login(tokens)`: Action method
  - `logout()`: Action method
  - `setTokens(tokens)`: Action method
- **Persisted**: LocalStorage via `persist` middleware.

### `ThemePreference` (Theme System)
Defines the client's current visual appearance setting.
- **Values**: `light` | `dark` | `system`
- **Stored In**: LocalStorage (via `next-themes` default behavior).

### `ApiResponse<T>` (API Layer)
Standard HTTP response wrapper for all Axios calls.
- **Fields**:
  - `success`: Boolean
  - `message`: String
  - `data`: Type `T` (nullable)
  - `errors`: Array of Strings (nullable)
  - `statusCode`: Number

### `User` (Profile)
Basic representation of an authenticated user.
- **Fields**:
  - `id`: String
  - `fullName`: String
  - `roles`: Array of Strings (e.g., `["Applicant"]`, `["Receptionist"]`)
  - `email`: String
  - `phoneNumber`: String
