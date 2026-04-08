# API Contracts: Push Tokens

These are the core endpoints provided by the `PushTokensController` for managing FCM registrations on the client.

## 1. Register Token

Creates or reactivates a Web Push token for the currently authenticated user.

- **URL Pattern**: `POST /api/v1/pushtokens/register`
- **Authorization**: Required (`[Authorize]`)
- **Request Body**:
  ```json
  {
    "token": "d8eO1...",
    "deviceType": "Web"
  }
  ```
- **Responses**:
  - `200 OK` (Standard `ApiResponse<T>`) indicating success.
  - `400 BadRequest` if token is empty or malformed.

## 2. Unregister Token (Logout Flow)

Safely unregisters a token from the user, ensuring notifications cease upon logging out on that device.

- **URL Pattern**: `DELETE /api/v1/pushtokens/{token}`
  - *(or optionally passed in body to avoid URL max length constraints if tokens exceed standard paths: `POST /api/v1/pushtokens/unregister` depending on standard HTTP constraints for large FCM tokens)*
- **Authorization**: Required (`[Authorize]`)
- **Request Body** (if using POST for unregister):
  ```json
  {
    "token": "d8eO1..."
  }
  ```
- **Responses**:
  - `200 OK` (Standard `ApiResponse<T>`) indicating token deactivated.
  - `404 NotFound` if token isn't found/owned by the user.
