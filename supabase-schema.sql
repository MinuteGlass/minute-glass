-- ============================================================
-- Minute Glass — Schéma base de données
-- Exécuter dans Supabase : SQL Editor → New query → Run
-- ============================================================

-- 1. Profils utilisateurs (liés à auth.users)
create table if not exists profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  role        text not null check (role in ('particulier', 'partenaire')),
  name        text not null,
  email       text not null,
  phone       text,
  company     text,   -- réparateur
  siret       text,   -- réparateur
  city        text,
  tokens      int not null default 0,  -- jetons réparateur
  created_at  timestamptz not null default now()
);

-- 2. Demandes de réparation
create table if not exists demandes (
  id                    uuid primary key default gen_random_uuid(),
  client_id             uuid not null references profiles(id) on delete cascade,
  title                 text not null,
  city                  text not null,
  intervention          text not null check (intervention in ('remplacement','reparation','vitre')),
  insurance             text not null check (insurance in ('avec','sans')),
  damage                text,
  availability          text,
  phone                 text,
  email                 text,
  photos                text[],         -- URLs Supabase Storage
  status                text not null default 'active'
                          check (status in ('active','attributed','aboutie','annulee')),
  accepted_repairer_id  uuid references profiles(id),
  unlock_count          int not null default 0,
  created_at            timestamptz not null default now()
);

-- 3. Déblocages (quelle fiche → quel réparateur)
create table if not exists unlocks (
  id            uuid primary key default gen_random_uuid(),
  demande_id    uuid not null references demandes(id) on delete cascade,
  repairer_id   uuid not null references profiles(id) on delete cascade,
  tokens_spent  int not null,
  created_at    timestamptz not null default now(),
  unique (demande_id, repairer_id)
);

-- 4. Threads de conversation
create table if not exists threads (
  id              uuid primary key default gen_random_uuid(),
  demande_id      uuid not null references demandes(id) on delete cascade,
  repairer_id     uuid not null references profiles(id) on delete cascade,
  last_message    text,
  offer_label     text,
  offer_status    text check (offer_status in ('pending','accepted','refused')),
  created_at      timestamptz not null default now(),
  unique (demande_id, repairer_id)
);

-- 5. Transactions de jetons
create table if not exists token_transactions (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null references profiles(id) on delete cascade,
  pack_name           text not null,
  tokens              int not null,
  amount_cents        int not null,
  stripe_payment_id   text,
  status              text not null default 'pending'
                        check (status in ('pending','paid','refunded')),
  created_at          timestamptz not null default now()
);

-- ============================================================
-- Row Level Security (RLS)
-- ============================================================

alter table profiles           enable row level security;
alter table demandes           enable row level security;
alter table unlocks            enable row level security;
alter table threads            enable row level security;
alter table token_transactions enable row level security;

-- Profiles : chacun voit/modifie son propre profil
create policy "profiles_select" on profiles for select using (auth.uid() = id);
create policy "profiles_insert" on profiles for insert with check (auth.uid() = id);
create policy "profiles_update" on profiles for update using (auth.uid() = id);

-- Demandes : client voit ses demandes ; réparateur voit toutes les demandes actives
create policy "demandes_client_all" on demandes for all
  using (auth.uid() = client_id);

create policy "demandes_repairer_select" on demandes for select
  using (
    status = 'active'
    and exists (
      select 1 from profiles where id = auth.uid() and role = 'partenaire'
    )
  );

-- Unlocks : réparateur voit ses propres déblocages
create policy "unlocks_own" on unlocks for all
  using (auth.uid() = repairer_id);

-- Threads : les deux parties voient leurs fils
create policy "threads_repairer" on threads for all
  using (auth.uid() = repairer_id);

create policy "threads_client" on threads for select
  using (
    exists (select 1 from demandes where id = demande_id and client_id = auth.uid())
  );

-- Token transactions : chacun voit les siennes
create policy "token_tx_own" on token_transactions for all
  using (auth.uid() = user_id);

-- ============================================================
-- Fonction : créer le profil automatiquement à l'inscription
-- ============================================================
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into profiles (id, role, name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'role', 'particulier'),
    coalesce(new.raw_user_meta_data->>'name', ''),
    new.email
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();
