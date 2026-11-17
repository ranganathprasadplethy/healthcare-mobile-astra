# Healthcare Mobile (patients)

Expo (React Native) app for patients: login/register, book and cancel appointments, browse doctors, view records, edit profile.

## Run
1. Start the backend (`healthcare-backend`, port 5000).
2. `npm install`
3. `npm start`, then scan the QR code with the Expo Go app (phone and computer on the same Wi-Fi).

The app auto-detects your computer's IP for the API. If login says "Cannot reach server":
- Make sure the backend is running and your firewall allows port 5000.
- Or set `EXPO_PUBLIC_API_URL=http://<your-computer-ip>:5000/api` in `.env` and restart `npm start`.

## Run in the browser (no phone needed)
If your network or firewall blocks the phone from reaching your computer (e.g. an office laptop):
1. Start the backend (port 5000).
2. `npm run web` (opens http://localhost:8081)

Only patient accounts can log in here (try alice@demo.com / Password123! after `seed:demo`).
