alter table public.registrations
  add column confirmed_at timestamptz,
  add column confirmed_by uuid;
comment on column public.registrations.confirmed_by is 'Supabase Auth user ID of the administrator who verified the bank transfer';
