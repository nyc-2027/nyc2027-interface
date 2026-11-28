create table public.chat_daily_usage (
  day date not null,
  subject text not null,
  requests integer not null default 0,
  primary key(day, subject)
);
alter table public.chat_daily_usage enable row level security;
revoke all on public.chat_daily_usage from anon, authenticated;
create function public.consume_chat_quota(p_subject text) returns boolean
language plpgsql security definer set search_path=public as $$
declare today date := (now() at time zone 'Asia/Ho_Chi_Minh')::date;
  total_count integer; visitor_count integer;
begin
  if p_subject !~ '^[a-f0-9]{64}$' then return false; end if;
  insert into chat_daily_usage(day,subject) values(today,'global') on conflict do nothing;
  select requests into total_count from chat_daily_usage where day=today and subject='global' for update;
  if total_count >= 300 then return false; end if;
  insert into chat_daily_usage(day,subject) values(today,p_subject) on conflict do nothing;
  select requests into visitor_count from chat_daily_usage where day=today and subject=p_subject for update;
  if visitor_count >= 30 then return false; end if;
  update chat_daily_usage set requests=requests+1 where day=today and subject in ('global',p_subject);
  delete from chat_daily_usage where day < today - 7;
  return true;
end;
$$;
revoke all on function public.consume_chat_quota(text) from public,anon,authenticated;
grant execute on function public.consume_chat_quota(text) to service_role;
