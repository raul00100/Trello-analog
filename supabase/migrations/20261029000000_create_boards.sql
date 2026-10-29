create table if not exists public.boards (
  id text not null,
  owner_id uuid not null references auth.users (id) on delete cascade,
  position integer not null check (position >= 0),
  name text not null default '',
  lists jsonb not null default '[]'::jsonb
    check (jsonb_typeof(lists) = 'array'),
  primary key (owner_id, id)
);

create index if not exists boards_owner_position_idx
  on public.boards (owner_id, position);

alter table public.boards enable row level security;

grant select, insert, update, delete on public.boards to authenticated;

create policy "Users can read their own boards"
  on public.boards for select
  to authenticated
  using ((select auth.uid()) = owner_id);

create policy "Users can create their own boards"
  on public.boards for insert
  to authenticated
  with check ((select auth.uid()) = owner_id);

create policy "Users can update their own boards"
  on public.boards for update
  to authenticated
  using ((select auth.uid()) = owner_id)
  with check ((select auth.uid()) = owner_id);

create policy "Users can delete their own boards"
  on public.boards for delete
  to authenticated
  using ((select auth.uid()) = owner_id);
