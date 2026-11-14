-- tyro.cell: work in progress for signed-in users — unfinished final tests ("test:unit_sum")
-- and half-written exercise sheets ("sheet:sum_weekly"). Each user can only see their own rows.
create table if not exists public.drafts (
user_id uuid not null references auth.users(id) on delete cascade,
key text not null check (key ~ '^(test|sheet):[a-z0-9_]{1,64}$'),
data jsonb not null check (pg_column_size(data) < 32000),
updated_at timestamptz not null default now(),
primary key (user_id, key)
);
alter table public.drafts enable row level security;
create policy "own drafts" on public.drafts for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
revoke all on public.drafts from anon;
grant select, insert, update, delete on public.drafts to authenticated;
