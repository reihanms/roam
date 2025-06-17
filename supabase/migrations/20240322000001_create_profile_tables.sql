CREATE TABLE IF NOT EXISTS public.travel_styles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL UNIQUE,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.user_travel_styles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
    travel_style_id uuid REFERENCES public.travel_styles(id) ON DELETE CASCADE,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    UNIQUE(user_id, travel_style_id)
);

CREATE TABLE IF NOT EXISTS public.trips (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    destination text NOT NULL,
    description text,
    start_date date NOT NULL,
    end_date date NOT NULL,
    budget_min integer,
    budget_max integer,
    max_participants integer DEFAULT 4,
    host_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    longitude DOUBLE PRECISION,
    latitude DOUBLE PRECISION
);

CREATE TABLE IF NOT EXISTS public.trip_participants (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    trip_id uuid REFERENCES public.trips(id) ON DELETE CASCADE,
    user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
    status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'declined')),
    joined_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    UNIQUE(trip_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.reviews (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    reviewer_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
    reviewee_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
    trip_id uuid REFERENCES public.trips(id) ON DELETE CASCADE,
    rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    UNIQUE(reviewer_id, reviewee_id, trip_id)
);

ALTER TABLE public.users ADD COLUMN IF NOT EXISTS bio text;

INSERT INTO public.travel_styles (name) VALUES 
    ('Backpacking'),
    ('Luxury'),
    ('Culinary'),
    ('Adventure'),
    ('Cultural'),
    ('Beach'),
    ('City Break'),
    ('Nature'),
    ('Photography'),
    ('Solo Travel')
ON CONFLICT (name) DO NOTHING;

alter publication supabase_realtime add table travel_styles;
alter publication supabase_realtime add table user_travel_styles;
alter publication supabase_realtime add table trips;
alter publication supabase_realtime add table trip_participants;
alter publication supabase_realtime add table reviews;