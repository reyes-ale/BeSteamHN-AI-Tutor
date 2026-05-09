create table if not exists public.app_courses (
  id text primary key,
  educator_id uuid,
  course jsonb,
  deleted boolean not null default false,
  updated_at timestamptz not null default now()
);

alter table public.app_courses
  add column if not exists educator_id uuid;

alter table public.app_courses enable row level security;

drop policy if exists "Anyone can read app courses" on public.app_courses;
create policy "Anyone can read app courses"
  on public.app_courses
  for select
  using (true);

drop policy if exists "Educators can create their own courses" on public.app_courses;
create policy "Educators can create their own courses"
  on public.app_courses
  for insert
  with check (
    auth.role() = 'authenticated'
    and (
      educator_id = auth.uid()
      or (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
    )
  );

drop policy if exists "Educators can update their own courses" on public.app_courses;
create policy "Educators can update their own courses"
  on public.app_courses
  for update
  using (
    auth.role() = 'authenticated'
    and (
      educator_id = auth.uid()
      or (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
    )
  )
  with check (
    auth.role() = 'authenticated'
    and (
      educator_id = auth.uid()
      or (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
    )
  );

drop policy if exists "Educators can delete their own courses" on public.app_courses;
create policy "Educators can delete their own courses"
  on public.app_courses
  for delete
  using (
    auth.role() = 'authenticated'
    and (
      educator_id = auth.uid()
      or (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
    )
  );
