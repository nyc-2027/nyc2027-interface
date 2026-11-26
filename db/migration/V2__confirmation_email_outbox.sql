create table public.registration_emails (
  id uuid primary key default gen_random_uuid(),
  registration_id text not null references public.registrations(id),
  kind text not null check (kind in ('registered', 'confirmed')),
  payload jsonb not null,
  created_at timestamptz not null default now(),
  sent_at timestamptz,
  provider_id text,
  last_error text,
  unique (registration_id, kind)
);
alter table public.registration_emails enable row level security;
revoke all on public.registration_emails from anon, authenticated;
grant select, insert, update on public.registration_emails to service_role;
create index registration_emails_pending on public.registration_emails(created_at) where sent_at is null;

create function public.queue_registration_email() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if TG_OP = 'INSERT' then
    insert into public.registration_emails(registration_id, kind, payload)
    values (NEW.id, 'registered', jsonb_build_object('order', NEW.order_data, 'payment', NEW.payment_data))
    on conflict do nothing;
  end if;
  if NEW.status = 'confirmed' then
    if TG_OP = 'INSERT' or OLD.status is distinct from 'confirmed' then
      insert into public.registration_emails(registration_id, kind, payload)
      values (NEW.id, 'confirmed', jsonb_build_object('order', NEW.order_data, 'payment', NEW.payment_data))
      on conflict do nothing;
    end if;
  end if;
  return NEW;
end;
$$;
revoke all on function public.queue_registration_email() from public;
create trigger queue_registration_email after insert or update of status on public.registrations
for each row execute function public.queue_registration_email();
