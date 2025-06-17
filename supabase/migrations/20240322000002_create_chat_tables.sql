CREATE TABLE IF NOT EXISTS public.chat_rooms (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    trip_id uuid REFERENCES public.trips(id) ON DELETE CASCADE UNIQUE,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.messages (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    chat_room_id uuid REFERENCES public.chat_rooms(id) ON DELETE CASCADE,
    sender_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
    content text NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_messages_chat_room_created_at ON public.messages(chat_room_id, created_at);
CREATE INDEX IF NOT EXISTS idx_chat_rooms_trip_id ON public.chat_rooms(trip_id);

alter publication supabase_realtime add table chat_rooms;
alter publication supabase_realtime add table messages;
