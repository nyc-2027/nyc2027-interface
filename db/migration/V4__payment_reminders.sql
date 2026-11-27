alter table public.registration_emails drop constraint registration_emails_kind_check;
alter table public.registration_emails add constraint registration_emails_kind_check check (kind in ('registered','confirmed','reminder'));
alter table public.registration_emails drop constraint registration_emails_registration_id_kind_key;
alter table public.registration_emails add column delivery_key text not null default 'initial';
alter table public.registration_emails add constraint registration_emails_delivery_unique unique(registration_id,kind,delivery_key);
create function public.queue_payment_reminders(target_id text default null) returns integer
language plpgsql security definer set search_path = public as $$
declare queued integer;
begin
  insert into public.registration_emails(registration_id,kind,payload,delivery_key)
  select id,'reminder',jsonb_build_object('order',order_data,'payment',payment_data),
    to_char(now() at time zone 'Asia/Ho_Chi_Minh','YYYY-MM-DD')
  from public.registrations where status='pending' and (target_id is null or id=target_id)
  on conflict do nothing;
  get diagnostics queued = row_count;
  return queued;
end;
$$;
revoke all on function public.queue_payment_reminders(text) from public, anon, authenticated;
grant execute on function public.queue_payment_reminders(text) to service_role;
