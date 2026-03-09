-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table (Extends Supabase Auth)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  role TEXT CHECK (role IN ('admin', 'guest')) DEFAULT 'guest',
  full_name TEXT,
  phone TEXT,
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
