-- tyro.cell: every answer check (spec P1-04) and self-service account deletion (spec P1-14).
-- attempts: insert and read your own rows only; never updated; removed with the account.
create table if not exists public.attempts (
id bigint generated always as identity primary key,
user_id uuid not null references auth.users(id) on delete cascade,
exercise_id text not null check (exercise_id ~ '^[a-z0-9_]{1,64}$'),
unit text check (unit ~ '^unit_[a-z0-9_]{1,64}$'),
mode text not null check (mode in ('practice','test')),
formula text check (char_length(formula) <= 500),
result text not null check (result in ('pass','fail')),
message text check (char_length(message) <= 300),
attempt_no int,
ms_since_open int,
used_hint boolean not null default false,
used_solution boolean not null default false,
created_at timestamptz not null default now()
);
create index if not exists attempts_user_time on public.attempts (user_id, created_at);
create index if not exists attempts_ex_result on public.attempts (exercise_id, result);
alter table public.attempts enable row level security;
create policy "own attempts read" on public.attempts for select to authenticated using ((select auth.uid()) = user_id);
create policy "own attempts insert" on public.attempts for insert to authenticated with check ((select auth.uid()) = user_id);
revoke all on public.attempts from anon;
grant select, insert on public.attempts to authenticated;

-- Delete my account: removes the signed-in user; progress, practice_days, drafts and
-- attempts go with it (on delete cascade). Only ever acts on the caller's own id.
create or replace function public.delete_my_account() returns void
language plpgsql security definer set search_path = '' as $$
begin
  if auth.uid() is null then raise exception 'not signed in'; end if;
  delete from auth.users where id = auth.uid();
end; $$;
revoke all on function public.delete_my_account() from public, anon;
grant execute on function public.delete_my_account() to authenticated;
