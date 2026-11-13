-- tyro.cell: progress sync for signed-in users (Google sign-in via Supabase Auth).
-- Run once in the Supabase SQL editor. Each user can only read and write their own rows.
create table if not exists public.progress (
user_id uuid not null references auth.users(id) on delete cascade,
exercise_id text not null check (exercise_id ~ '^[a-z0-9_]{1,64}$'),
status text not null default 'done' check (status in ('done','assisted')),
updated_at timestamptz not null default now(),
primary key (user_id, exercise_id)
);
create table if not exists public.practice_days (
user_id uuid not null references auth.users(id) on delete cascade,
day date not null,
primary key (user_id, day)
);
alter table public.progress enable row level security;
alter table public.practice_days enable row level security;
create policy "own progress" on public.progress for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "own days" on public.practice_days for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
revoke all on public.progress, public.practice_days from anon;
grant select, insert, update, delete on public.progress, public.practice_days to authenticated;
