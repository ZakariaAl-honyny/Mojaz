# Quickstart / Reference: Firebase Push Notification Integration

## Backend Integration Steps

1. **Install Dependencies**:
   ```bash
   dotnet add package FirebaseAdmin
   ```
2. **Add to `appsettings.json`**:
   ```json
   "Firebase": {
     "CredentialsPath": "Configuration/firebase-service-account.json"
   }
   ```
3. **Register Services** (`Program.cs` / `ServiceExtension`):
   ```csharp
   FirebaseApp.Create(new AppOptions
   {
       Credential = GoogleCredential.FromFile(configuration["Firebase:CredentialsPath"])
   });
   
   services.AddScoped<IPushNotificationService, FirebasePushService>();
   ```
4. **Trigger a Push**:
   ```csharp
   BackgroundJob.Enqueue<IPushNotificationService>(x => 
       x.SendToUserAsync(userId, "Application Approved", "Your license is ready for issuance.", PushEventType.StatusChange));
   ```

## Frontend Integration Steps

1. **Add `firebase-messaging-sw.js` to `/public/`**:
   ```javascript
   importScripts('https://www.gstatic.com/firebasejs/10.x.x/firebase-app-compat.js');
   importScripts('https://www.gstatic.com/firebasejs/10.x.x/firebase-messaging-compat.js');
   // Init firebase...
   ```
2. **Create Hook `usePushNotifications`**:
   ```typescript
   export const usePushNotifications = () => {
     const requestPermission = async () => {
       const permission = await Notification.requestPermission();
       if (permission === 'granted') {
         const token = await getToken(messaging, { vapidKey: '...' });
         // send token to API
       }
     }
     // ...
   }
   ```
