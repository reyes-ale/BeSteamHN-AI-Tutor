create table if not exists public.app_courses (
  id text primary key,
  course jsonb,
  deleted boolean not null default false,
  updated_at timestamptz not null default now()
);

alter table public.app_courses enable row level security;

drop policy if exists "Anyone can read app courses" on public.app_courses;
create policy "Anyone can read app courses"
  on public.app_courses
  for select
  using (true);

drop policy if exists "Authenticated users can manage app courses" on public.app_courses;
create policy "Authenticated users can manage app courses"
  on public.app_courses
  for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
