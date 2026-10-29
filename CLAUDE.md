# Poruch — rules for Claude

A directory of Ukrainian businesses and events (starting with Chicago). The idea and plan are in [PLAN.md](PLAN.md).

- `apps/mobile/` — the Expo (React Native) app. Expo-specific rules are in `apps/mobile/AGENTS.md`.
- `supabase/` — the Supabase database: migrations and demo data.
- `docs/ONBOARDING.md` — setup guide for new contributors.

## Who works on this project

- **Owner — Serg** (`git config user.name` = `Serg`). Manages the database and merges changes into `main`.
- **Non-programmer contributors** who build features together with Claude ("vibe coding").

Talk to people in **simple Ukrainian**, without jargon. Before anything risky, briefly say what you are about to do and why.

## Git — mandatory

1. **Never commit or push to `main`.** Exception: `git config user.name` is `Serg` and he explicitly asks to commit to `main`.
2. At the start of every task:
   ```
   git checkout main
   git pull
   git checkout -b <short-latin-name>   # e.g. event-page, fix-catalog-search
   ```
   If there are uncommitted changes, ask what to do with them first. Never discard anything silently.
3. Commit in small steps with clear messages.
4. When the person is happy with the result: push the branch (`git push -u origin <branch>`) and open a Pull Request (`gh pr create` if `gh` is installed; otherwise give the link `https://github.com/SerhiiDer/Poruch/pull/new/<branch>`). Describe in plain words what changed and how to check it.
5. **Forbidden:** `git push --force`, `git reset --hard` on shared branches, rewriting history, merging PRs (only Serg merges), deleting other people's branches.

## Database — Serg only

- **Do not run** `supabase db push`, `supabase db query`, `supabase link`, `supabase migration repair`, or anything else that changes the database.
- **Do not edit** files in `supabase/` or `apps/mobile/src/data/database.types.ts`.
- If a task needs a new column or table, do not do it yourself. Describe the needed database change in the PR description; Serg will apply it.
- For Serg: database changes go through the Supabase CLI from the repo root (`npm run db:new`, `npx supabase db push --linked --dry-run`, then without `--dry-run`, then `npm run db:types`).

## Secrets

- The app only uses the **publishable key** (`EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY` in `apps/mobile/.env`). It is public; the data is protected by RLS policies.
- **Never** put a secret / service_role key, passwords, or tokens in code, `.env`, or commits.

## Code

- Run the app: `cd apps/mobile && npx expo start` (on the phone: Expo Go).
- Before every commit, in `apps/mobile/`: `npx tsc --noEmit` and `npx expo lint` must pass with no errors.
- Add libraries only with `npx expo install <package>`, and only ones that work in **Expo Go** (no custom native code). If something else is needed, ask Serg.
- Do not delete or rename files without explaining it to the person.
- Code comments: short, in Ukrainian.
- All text shown in the app: Ukrainian.
