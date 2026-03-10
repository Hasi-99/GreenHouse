-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table (Extends Supabase Auth)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  role TEXT CHECK (role IN ('admin', 'guest')) DEFAULT 'guest',
  full_name TEXT,
  phone TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Rooms Table
CREATE TABLE rooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL CHECK (name IN ('Double Room', 'Triple Room', 'Family Room', 'Driver Room')),
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  capacity INT NOT NULL,
  status TEXT CHECK (status IN ('available', 'maintenance')) DEFAULT 'available',
  features JSONB DEFAULT '[]'::jsonb, -- e.g., ["Free Wi-Fi", "Balcony"]
  images TEXT[] DEFAULT '{}', -- Array of Supabase Storage URLs
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Bookings Table
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  guest_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  status TEXT CHECK (status IN ('confirmed', 'cancelled', 'completed')) DEFAULT 'confirmed',
  add_ons JSONB DEFAULT '[]'::jsonb, -- e.g., [{"item": "Breakfast", "price": 15}]
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Global Settings (For dynamic theming)
CREATE TABLE settings (
  id INT PRIMARY KEY DEFAULT 1,
  active_theme TEXT CHECK (active_theme IN ('theme-classic', 'theme-modern', 'theme-luxury')) DEFAULT 'theme-classic'
);

-- Insert Initial Rooms
INSERT INTO rooms (name, price, capacity, description) VALUES
('Double Room', 120.00, 2, 'Cozy room with forest views.'),
('Triple Room', 160.00, 3, 'Spacious room for small groups.'),
('Family Room', 250.00, 5, 'Large suite with multiple beds.'),
('Driver Room', 50.00, 1, 'Comfortable budget accommodation.');

-- Insert Default Theme
INSERT INTO settings (id, active_theme) VALUES (1, 'theme-classic');

-- 5. Reviews/Testimonials Table
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  guest_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  guest_name TEXT NOT NULL,
  room_id UUID REFERENCES rooms(id) ON DELETE SET NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  is_approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Add-ons Table
CREATE TABLE add_ons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert Default Add-ons
INSERT INTO add_ons (name, description, price) VALUES
('Breakfast', 'Daily continental breakfast for all guests', 15.00),
('Coffee', 'Freshly brewed coffee service', 5.00),
('Nature Walk Guide', 'Guided tour of the forest trails', 25.00),
('Spa Access', 'Access to hotel spa facilities', 35.00),
('Airport Transfer', 'Round-trip airport transportation', 50.00);

-- =============================================
-- ROW LEVEL SECURITY POLICIES
-- =============================================

-- Enable RLS on profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to insert their own profile
CREATE POLICY "Users can insert their own profile"
ON profiles FOR INSERT
WITH CHECK (auth.uid() = id);

-- Allow users to read their own profile
CREATE POLICY "Users can read their own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update their own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id);

-- Allow admins to do everything with profiles
CREATE POLICY "Admins can do everything with profiles"
ON profiles FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = auth.uid() AND p.role = 'admin'
  )
);

-- Enable RLS on rooms table
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read rooms
CREATE POLICY "Anyone can read rooms"
ON rooms FOR SELECT
USING (true);

-- Allow admins to insert/update/delete rooms
CREATE POLICY "Admins can manage rooms"
ON rooms FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = auth.uid() AND p.role = 'admin'
  )
);

-- Enable RLS on bookings table
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own bookings
CREATE POLICY "Users can read their own bookings"
ON bookings FOR SELECT
USING (auth.uid() = guest_id);

-- Allow users to insert their own bookings
CREATE POLICY "Users can insert their own bookings"
ON bookings FOR INSERT
WITH CHECK (auth.uid() = guest_id);

-- Allow users to update their own bookings
CREATE POLICY "Users can update their own bookings"
ON bookings FOR UPDATE
USING (auth.uid() = guest_id);

-- Allow admins to do everything with bookings
CREATE POLICY "Admins can manage all bookings"
ON bookings FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = auth.uid() AND p.role = 'admin'
  )
);

-- Enable RLS on reviews table
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read approved reviews
CREATE POLICY "Anyone can read approved reviews"
ON reviews FOR SELECT
USING (is_approved = true);

-- Allow users to insert their own reviews
CREATE POLICY "Users can insert their own reviews"
ON reviews FOR INSERT
WITH CHECK (auth.uid() = guest_id);

-- Allow users to update their own reviews
CREATE POLICY "Users can update their own reviews"
ON reviews FOR UPDATE
USING (auth.uid() = guest_id);

-- Allow admins to manage reviews
CREATE POLICY "Admins can manage reviews"
ON reviews FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = auth.uid() AND p.role = 'admin'
  )
);

-- Enable RLS on add_ons table
ALTER TABLE add_ons ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read add-ons
CREATE POLICY "Anyone can read add_ons"
ON add_ons FOR SELECT
USING (true);

-- Allow admins to manage add-ons
CREATE POLICY "Admins can manage add_ons"
ON add_ons FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = auth.uid() AND p.role = 'admin'
  )
);

-- Enable RLS on settings table
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read settings
CREATE POLICY "Anyone can read settings"
ON settings FOR SELECT
USING (true);

-- Allow admins to update settings
CREATE POLICY "Admins can update settings"
ON settings FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = auth.uid() AND p.role = 'admin'
  )
);
