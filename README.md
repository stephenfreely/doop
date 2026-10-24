# Doop

Doop is a dog-walking tracker built for owners keeping an eye on a puppy's digestive health alongside their vet. Create a dog profile, start a walk, and track your route and distance live with GPS. Pause or resume as you go, log stool samples with a Bristol-inspired consistency rating and optional photo, then save the walk and review history, routes, and weekly stats.

## Product summary

- **Auth** — email/password sign in and sign up with client-side validation; sign out from Settings.
- **Dog profile** — one dog per account: name, breed, and an optional photo.
- **Walks** — start, pause, resume, and complete a walk with live GPS route and distance tracking. Leaving the active-walk screen doesn't lose progress — Home shows "Continue walk" until it's completed or discarded. If a walk can't be saved (e.g. no GPS points recorded), it can be retried or discarded without losing the dog or session.
- **Stool logs** — rate consistency on a 7-point Bristol-inspired scale (1 = hard pellets, 7 = watery), add notes for the vet, and optionally attach a photo. Log one mid-walk or add/edit one later from walk details.
- **History** — browse past walks with distance, duration, and a stool-consistency summary at a glance; open any walk for its full route, stats, and stool logs; delete a walk.
- **Settings** — account info, edit dog profile, sign out.

The app runs fully offline against a local mock backend by default (see [Run](#run) below), so none of the above requires a Supabase project to try.

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
