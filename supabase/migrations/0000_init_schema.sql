-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- 1. Enums
create type public.user_role as enum ('ADMIN', 'STAFF', 'DJ', 'PROMOTER', 'EXTERNAL_EVENT');
create type public.guest_type as enum ('FREE', 'PAID');
create type public.guest_status as enum ('REGISTERED', 'CHECKED_IN');

-- 2. Tables

-- Clubs
create table public.clubs (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  timezone text not null default 'Asia/Seoul',
  cutoff_time time not null default '06:00:00',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Profiles (Extends auth.users)
create table public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  club_id uuid not null references public.clubs(id),
  username text not null,
  display_name text,
  role public.user_role not null default 'STAFF',
  is_active boolean default true,
  created_at timestamptz default now(),
  
  unique(club_id, username)
);

-- User Access Scopes (for Promoter/External Event)
create table public.user_access_scopes (
  id uuid primary key default uuid_generate_v4(),
  club_id uuid not null references public.clubs(id),
  user_id uuid not null references public.profiles(user_id) on delete cascade,
  start_date date not null,
  end_date date not null,
  created_at timestamptz default now()
);

-- Guest Entries
create table public.guest_entries (
  id uuid primary key default uuid_generate_v4(),
  club_id uuid not null references public.clubs(id),
  business_date date not null,
  
  guest_name text not null,
  phone text,
  guest_type public.guest_type not null default 'FREE',
  price integer, -- nullable for FREE
  status public.guest_status not null default 'REGISTERED',
  
  created_by uuid references public.profiles(user_id), -- null if system created
  
  checked_in_at timestamptz,
  checked_in_by uuid references public.profiles(user_id),
  
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 3. RLS Policies

alter table public.clubs enable row level security;
alter table public.profiles enable row level security;
alter table public.user_access_scopes enable row level security;
alter table public.guest_entries enable row level security;

-- Helper function to get current user's profile
create or replace function public.get_my_profile()
returns public.profiles
language sql stable
as $$
  select * from public.profiles where user_id = auth.uid() limit 1;
$$;

-- Clubs Policies
create policy "Clubs are viewable by everyone" 
  on public.clubs for select using (true);
  
create policy "Clubs are updateable by ADMIN only"
  on public.clubs for update using (
    exists (
      select 1 from public.profiles
      where user_id = auth.uid() and role = 'ADMIN' and club_id = public.clubs.id
    )
  );

-- Profiles Policies
create policy "Users can view their own profile"
  on public.profiles for select using (auth.uid() = user_id);

create policy "Admins can view profiles in their club"
  on public.profiles for select using (
    exists (
      select 1 from public.profiles as mine
      where mine.user_id = auth.uid() 
      and mine.role = 'ADMIN' 
      and mine.club_id = public.profiles.club_id
    )
  );

-- Guest Entries Policies

-- Read: Same Club AND (If Promoter/External, within Scope)
create policy "View guests in same club"
  on public.guest_entries for select using (
    exists (
      select 1 from public.profiles as mine
      left join public.user_access_scopes as scope on scope.user_id = mine.user_id
      where mine.user_id = auth.uid()
      and mine.club_id = public.guest_entries.club_id
      and (
        mine.role in ('ADMIN', 'STAFF', 'DJ')
        or (
          mine.role in ('PROMOTER', 'EXTERNAL_EVENT')
          and public.guest_entries.business_date between scope.start_date and scope.end_date
        )
      )
    )
  );

-- Insert: Same Club AND (If Promoter/External, within Scope) AND (Set created_by = auth.uid)
create policy "Insert guests"
  on public.guest_entries for insert with check (
    exists (
      select 1 from public.profiles as mine
      left join public.user_access_scopes as scope on scope.user_id = mine.user_id
        where mine.user_id = auth.uid()
        and mine.club_id = public.guest_entries.club_id
        and (
            mine.role in ('ADMIN', 'STAFF', 'DJ')
            or (
                mine.role in ('PROMOTER', 'EXTERNAL_EVENT')
                and public.guest_entries.business_date between scope.start_date and scope.end_date
            )
        )
    )
  );

-- Update: 
-- 1. General Update: Created By Me OR Admin, and Status is REGISTERED (Prevent modify checked-in guests)
-- 2. Check-in (Status -> CHECKED_IN): Staff/Admin only (This needs careful handling, maybe separate policy or unified)

-- Simplified Update Policy for MVP
create policy "Update guests"
  on public.guest_entries for update using (
    exists (
      select 1 from public.profiles as mine
      left join public.user_access_scopes as scope on scope.user_id = mine.user_id
      where mine.user_id = auth.uid()
      and mine.club_id = public.guest_entries.club_id
      and (
        -- CASE 1: Check-in (STAFF/ADMIN only) -> Checking status change would require more complex check, simpler to allow STAFF/ADMIN update all
        (mine.role in ('ADMIN', 'STAFF'))
        or 
        -- CASE 2: Edit Info (Creator only, within scope, status=REGISTERED)
        (
            public.guest_entries.created_by = auth.uid()
            and public.guest_entries.status = 'REGISTERED'
            and (
                mine.role = 'DJ' 
                or (
                    mine.role in ('PROMOTER', 'EXTERNAL_EVENT')
                    and public.guest_entries.business_date between scope.start_date and scope.end_date
                )
            )
        )
      )
    )
  );
  
-- Triggers for updated_at
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language 'plpgsql';

create trigger update_clubs_modtime before update on public.clubs for each row execute procedure update_updated_at_column();
create trigger update_guest_entries_modtime before update on public.guest_entries for each row execute procedure update_updated_at_column();
