create extension if not exists pgcrypto;

do $$ begin
  create type public.user_status as enum ('pending', 'approved', 'rejected');
exception when duplicate_object then null; end $$;
do $$ begin
  create type public.age_group as enum ('under_18', '18_plus');
exception when duplicate_object then null; end $$;

table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null check (char_length(full_name) between 2 and 120),
  phone text not null unique check (phone ~ '^\\+?[0-9 ]{8,20}$'),
  status public.user_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  rejected_reason text
);

table public.admin_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  role text not null default 'admin' check (role = 'admin'),
  created_at timestamptz not null default now()
);

table public.pricing (
  id uuid primary key default gen_random_uuid(),
  age_group public.age_group not null unique,
  price_per_minute numeric(10,2) not null check (price_per_minute > 0),
  daily_price numeric(10,2) not null check (daily_price > 0),
  weekly_price numeric(10,2) not null check (weekly_price > 0),
  monthly_price numeric(10,2) not null check (monthly_price > 0),
  yearly_price numeric(10,2) not null check (yearly_price > 0),
  updated_at timestamptz not null default now()
);

table public.reservations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  reservation_date date not null,
  reservation_time time not null,
  duration_minutes integer not null check (duration_minutes between 1 and 480),
  age_group public.age_group not null,
  calculated_price numeric(10,2) not null check (calculated_price > 0),
  package_name text,
  note text check (note is null or char_length(note) <= 1000),
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'cancelled', 'completed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index reservations_active_slot on public.reservations(reservation_date, reservation_time)
where status in ('pending', 'confirmed');

insert into public.pricing (age_group, price_per_minute, daily_price, weekly_price, monthly_price, yearly_price)
values
  ('under_18', 12, 250, 1320, 4800, 50400),
  ('18_plus', 25, 500, 2640, 9600, 100800)
on conflict (age_group) do nothing;

create or replace function public.is_admin()
returns boolean language sql stable security invoker set search_path = public
as $$ select exists (select 1 from public.admin_roles where user_id = (select auth.uid()) and role = 'admin') $$;

alter table public.profiles enable row level security;
alter table public.admin_roles enable row level security;
alter table public.pricing enable row level security;
alter table public.reservations enable row level security;

create policy profiles_own_select on public.profiles for select to authenticated using ((select auth.uid()) = id or public.is_admin());
create policy profiles_own_insert on public.profiles for insert to authenticated with check ((select auth.uid()) = id);
create policy profiles_own_update on public.profiles for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy admins_only_roles on public.admin_roles for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy pricing_public_read on public.pricing for select to anon, authenticated using (true);
create policy pricing_admin_write on public.pricing for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy reservations_own_select on public.reservations for select to authenticated using ((select auth.uid()) = user_id or public.is_admin());
create policy reservations_approved_insert on public.reservations for insert to authenticated with check (
  (select auth.uid()) = user_id and exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.status = 'approved')
);
create policy reservations_admin_update on public.reservations for update to authenticated using (public.is_admin()) with check (public.is_admin());

create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, phone)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''), coalesce(new.raw_user_meta_data ->> 'phone', ''))
  on conflict (id) do nothing;
  return new;
end; $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

create or replace function public.touch_updated_at() returns trigger language plpgsql as $$ begin new.updated_at = now(); return new; end; $$;
create trigger profiles_touch before update on public.profiles for each row execute function public.touch_updated_at();
create trigger pricing_touch before update on public.pricing for each row execute function public.touch_updated_at();
create trigger reservations_touch before update on public.reservations for each row execute function public.touch_updated_at();
