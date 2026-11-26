create table public.registrations (
  id text primary key,
  order_data jsonb not null,
  payment_data jsonb not null,
  access_token_hash text not null,
  status text not null default 'pending' check (status in ('pending','reported','confirmed')),
  receipt_path text,
  created_at timestamptz not null default now(),
  reported_at timestamptz
);
alter table public.registrations enable row level security;
revoke all on public.registrations from anon, authenticated;
grant select, insert, update on public.registrations to service_role;
create index registrations_status_created on public.registrations(status, created_at);
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('payment-receipts', 'payment-receipts', false, 3145728, array['image/jpeg','image/png'])
on conflict (id) do nothing;
