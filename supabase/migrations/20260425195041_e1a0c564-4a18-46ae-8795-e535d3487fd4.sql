
-- Roles
create type public.app_role as enum ('admin', 'user');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  created_at timestamp with time zone not null default now(),
  unique (user_id, role)
);

alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  )
$$;

create policy "Users can view own roles"
  on public.user_roles for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Admins can view all roles"
  on public.user_roles for select
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

create policy "Admins can manage roles"
  on public.user_roles for all
  to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- Updated_at helper
create or replace function public.tg_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Announcements (blog)
create table public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  excerpt text,
  body text not null,
  cover_image_url text,
  published boolean not null default true,
  author_id uuid references auth.users(id) on delete set null,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

alter table public.announcements enable row level security;

create trigger announcements_updated_at
  before update on public.announcements
  for each row execute function public.tg_set_updated_at();

create policy "Anyone can read published announcements"
  on public.announcements for select
  to anon, authenticated
  using (published = true or public.has_role(auth.uid(), 'admin'));

create policy "Admins manage announcements"
  on public.announcements for all
  to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- Services
create table public.services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  icon text,
  sort_order int not null default 0,
  active boolean not null default true,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

alter table public.services enable row level security;

create trigger services_updated_at
  before update on public.services
  for each row execute function public.tg_set_updated_at();

create policy "Anyone can read active services"
  on public.services for select
  to anon, authenticated
  using (active = true or public.has_role(auth.uid(), 'admin'));

create policy "Admins manage services"
  on public.services for all
  to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- Products
create table public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  tag text,
  description text not null,
  features text[] not null default '{}',
  accent boolean not null default false,
  sort_order int not null default 0,
  active boolean not null default true,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

alter table public.products enable row level security;

create trigger products_updated_at
  before update on public.products
  for each row execute function public.tg_set_updated_at();

create policy "Anyone can read active products"
  on public.products for select
  to anon, authenticated
  using (active = true or public.has_role(auth.uid(), 'admin'));

create policy "Admins manage products"
  on public.products for all
  to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- Contact submissions
create table public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  company text,
  message text not null,
  handled boolean not null default false,
  created_at timestamp with time zone not null default now()
);

alter table public.contact_submissions enable row level security;

create policy "Anyone can submit contact"
  on public.contact_submissions for insert
  to anon, authenticated
  with check (true);

create policy "Admins read contact"
  on public.contact_submissions for select
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

create policy "Admins update contact"
  on public.contact_submissions for update
  to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

create policy "Admins delete contact"
  on public.contact_submissions for delete
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

-- Seed services
insert into public.services (title, description, icon, sort_order) values
  ('Custom Software Development', 'End-to-end web and mobile applications tailored to your business workflows.', 'Code2', 1),
  ('Cloud & DevOps', 'Modern cloud infrastructure, CI/CD, and observability for resilient products.', 'Cloud', 2),
  ('AI & Data Solutions', 'Production-ready AI features, analytics dashboards, and data pipelines.', 'Sparkles', 3),
  ('UX & Product Design', 'Research-driven design systems that turn complex problems into clear flows.', 'Palette', 4),
  ('Cybersecurity', 'Hardening, audits, and compliance to keep your platform and users safe.', 'ShieldCheck', 5),
  ('Integration & APIs', 'Connect tools, automate operations, and build robust public APIs.', 'Workflow', 6);

-- Seed products
insert into public.products (name, tag, description, features, accent, sort_order) values
  ('NexCRM', 'Sales Platform', 'An intuitive CRM that gives your sales team a single source of truth.',
   array['Visual pipelines','AI lead scoring','Email & calendar sync','Custom workflows'], false, 1),
  ('FlowOps', 'Operations', 'Automate repetitive operations work with no-code flows.',
   array['Visual flow builder','200+ integrations','Real-time triggers','Audit logging'], true, 2),
  ('InsightAI', 'Analytics', 'Ask questions of your data in plain language.',
   array['Natural language queries','Auto dashboards','Anomaly detection','Forecasting'], false, 3),
  ('SecureGate', 'Security', 'Identity, access, and threat detection unified.',
   array['SSO & MFA','Threat detection','API protection','Compliance reports'], false, 4);

-- Seed welcome announcement
insert into public.announcements (title, excerpt, body, published) values
  ('Welcome to the Nexora Blog',
   'Product updates, engineering notes, and announcements from our team.',
   'This is the first post on our new announcements feed. Check back here for product updates, customer stories, and engineering deep dives.',
   true);
