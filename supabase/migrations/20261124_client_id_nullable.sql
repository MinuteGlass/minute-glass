-- Minute Glass — publier une demande sans compte client
-- À exécuter une fois dans Supabase : SQL Editor → New query → Run.
--
-- Rend `demandes.client_id` facultatif : les demandes déposées depuis /deposer
-- n'ont plus besoin d'un profil / compte particulier. La contrainte de clé
-- étrangère est conservée pour les demandes existantes.

alter table public.demandes
  alter column client_id drop not null;
