# Store release checklist — Lydia's Thrift

## Paystack (production wallet funding)

1. Paystack Dashboard → **Settings → Webhooks**
   - URL: `https://YOUR_API_DOMAIN/api/webhooks/paystack`
   - Events: `charge.success`, `charge.failed`
2. Server `.env` must have live keys and `APP_URL` set to your public API URL (HTTPS).
3. Flow: app opens Paystack → user pays → **webhook credits wallet** → app polls `GET /api/wallet/fund/{reference}`.

## Android (Google Play)

### Option A — EAS Build (recommended)

```bash
npm install -g eas-cli
eas login
eas build:configure
eas build --platform android --profile production
```

EAS manages the release keystore. Download the `.aab` from the Expo dashboard and upload to Play Console.

### Option B — Local signed build

1. Generate a release keystore (once):

```powershell
keytool -genkeypair -v -storetype PKCS12 -keystore android/app/lydiathrift-release.keystore -alias lydiathrift -keyalg RSA -keysize 2048 -validity 10000
```

2. Copy `android/keystore.properties.example` → `android/keystore.properties` and fill in passwords.
3. Build:

```powershell
cd lydia-thrift-mobile
$env:NODE_ENV = "production"
cd android
.\gradlew.bat bundleRelease
```

Output: `android/app/build/outputs/bundle/release/app-release.aab`

### Play Console

- Create app listing (screenshots, description, privacy policy URL)
- Upload **AAB** (not APK) for production
- Complete content rating & data safety forms

## iOS (App Store)

```bash
eas build --platform ios --profile production
eas submit --platform ios
```

Requires Apple Developer account ($99/yr), App Store Connect app record, and privacy policy.

## App metadata

| Field | Value |
|-------|-------|
| Name | Lydia's Thrift |
| Bundle ID | com.lydiathrift.mobile |
| Version | 1.0.0 |
| Deep link scheme | `lydiathrift://` |

## Before submitting

- [ ] `THRIFT_ALLOW_MOCK_WALLET_FUND=false` on production API
- [ ] HTTPS API URL in mobile `EXPO_PUBLIC_API_URL`
- [ ] Paystack webhook tested with a live ₦100 top-up
- [ ] Privacy policy hosted (required by both stores)
- [ ] Test login, shop, enroll, fund wallet, pay installment on release build
