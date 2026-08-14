-- Run in the Supabase SQL editor.
-- auth.users is provided by Supabase Auth.

create table if not exists public.dogs (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  breed text,
  photo_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.walks (
  id uuid primary key default gen_random_uuid(),
  dog_id uuid not null references public.dogs (id) on delete cascade,
  started_at timestamptz not null,
  ended_at timestamptz not null,
  distance_metres double precision not null default 0,
  route jsonb not null default '[]'::jsonb,
  notes text,
  stools jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists walks_dog_id_started_at_idx
  on public.walks (dog_id, started_at desc);

alter table public.walks
  add column if not exists stools jsonb not null default '[]'::jsonb;

alter table public.dogs enable row level security;
alter table public.walks enable row level security;

create policy "Owners can read their dogs"
  on public.dogs for select
  using (auth.uid() = owner_id);

create policy "Owners can insert their dogs"
  on public.dogs for insert
  with check (auth.uid() = owner_id);

create policy "Owners can update their dogs"
  on public.dogs for update
  using (auth.uid() = owner_id);

create policy "Owners can read their walks"
  on public.walks for select
  using (
    exists (
      select 1 from public.dogs
      where dogs.id = walks.dog_id
        and dogs.owner_id = auth.uid()
    )
  );

create policy "Owners can insert their walks"
  on public.walks for insert
  with check (
    exists (
      select 1 from public.dogs
      where dogs.id = walks.dog_id
        and dogs.owner_id = auth.uid()
    )
  );

create policy "Owners can update their walks"
  on public.walks for update
  using (
    exists (
      select 1 from public.dogs
      where dogs.id = walks.dog_id
        and dogs.owner_id = auth.uid()
    )
  );

create policy "Owners can delete their walks"
  on public.walks for delete
  using (
    exists (
      select 1 from public.dogs
      where dogs.id = walks.dog_id
        and dogs.owner_id = auth.uid()
    )
  );
