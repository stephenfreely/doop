# Doop

Doop is a dog walking tracker with stool logs for your vet. Create a dog profile, start a walk, and track your route and distance with GPS. Pause or resume as you go, log stools with a Bristol-inspired rating and optional photo, then save the walk and review history, routes, and weekly stats.

## Run

```bash
npm install
npx expo prebuild
npx expo run:ios
```

Use a development build, not Expo Go. Android: `npx expo run:android`.

To mock GPS in the iOS Simulator, start a walk in the app, then:

```bash
npm run simulate:walk
```

That walks downtown along Fifth Avenue (59th St to Washington Square) at 1.4 m/s. For a quicker preview: `SPEED=8 npm run simulate:walk`.

The app runs with a local mock if Supabase env vars are empty. To use a real backend, copy `.env.example` to `.env.local` and run `supabase/schema.sql` in your project.
