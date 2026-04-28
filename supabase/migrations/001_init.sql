-- Codexa initial schema
-- Run with: supabase db push  (or paste into the Supabase SQL editor)

create extension if not exists "pgcrypto";

-- ── reviews ──────────────────────────────────────────────────
-- One row per PR review attempt.
create table if not exists public.reviews (
  id              uuid primary key default gen_random_uuid(),
  repo            text not null,
  pr_number       integer not null,
  installation_id bigint not null,
  provider        text not null,
  status          text not null check (status in ('pending', 'completed', 'failed')),
  summary         text,
  findings_count  integer default 0,
  duration_ms     integer,
  error           text,
  created_at      timestamptz not null default now()
);

create index if not exists reviews_repo_idx on public.reviews (repo, created_at desc);
create index if not exists reviews_status_idx on public.reviews (status, created_at desc);
create index if not exists reviews_created_idx on public.reviews (created_at desc);

-- ── installations ────────────────────────────────────────────
-- One row per GitHub App installation, linked to the user that installed it.
create table if not exists public.installations (
  id               bigint primary key,                  -- GitHub installation id
  user_id          uuid references auth.users (id) on delete set null,
  account_login    text not null,
  account_type     text not null check (account_type in ('User', 'Organization')),
  repository_count integer default 0,
  installed_at     timestamptz not null default now(),
  removed_at       timestamptz
);

create index if not exists installations_user_idx on public.installations (user_id);

-- ── user_keys (BYOK) ─────────────────────────────────────────
-- Encrypted user-supplied API keys for Gemini / Groq.
-- The application encrypts the value before insert; we store ciphertext only.
create table if not exists public.user_keys (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  gemini_key text,                                      -- ciphertext
  groq_key   text,                                      -- ciphertext
  updated_at timestamptz not null default now()
);

-- ── RLS ──────────────────────────────────────────────────────
-- The backend uses the service-role key, which bypasses RLS.
-- These policies guard browser-side reads via the anon key.
alter table public.reviews        enable row level security;
alter table public.installations  enable row level security;
alter table public.user_keys      enable row level security;

-- Reviews: a user can read reviews for installations they own
drop policy if exists "reviews_select_own" on public.reviews;
create policy "reviews_select_own"
  on public.reviews for select
  using (
    installation_id in (
      select id from public.installations where user_id = auth.uid()
    )
  );

-- Installations: read your own
drop policy if exists "installations_select_own" on public.installations;
create policy "installations_select_own"
  on public.installations for select
  using (user_id = auth.uid());

-- user_keys: users can read & upsert their own row
drop policy if exists "user_keys_select_own" on public.user_keys;
create policy "user_keys_select_own"
  on public.user_keys for select
  using (user_id = auth.uid());

drop policy if exists "user_keys_upsert_own" on public.user_keys;
create policy "user_keys_upsert_own"
  on public.user_keys for insert
  with check (user_id = auth.uid());

drop policy if exists "user_keys_update_own" on public.user_keys;
create policy "user_keys_update_own"
  on public.user_keys for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());
