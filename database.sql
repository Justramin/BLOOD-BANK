-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create committees table
CREATE TABLE IF NOT EXISTS committees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create units table
CREATE TABLE IF NOT EXISTS units (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  committee_id UUID REFERENCES committees(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(committee_id, name)
);

-- Create donors table
CREATE TABLE IF NOT EXISTS donors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  committee_id UUID REFERENCES committees(id) ON DELETE SET NULL,
  unit_id UUID REFERENCES units(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  blood_group TEXT NOT NULL,
  dob DATE,
  phone TEXT NOT NULL UNIQUE, -- Added UNIQUE
  last_blood_donating_date DATE NULL,
  available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create donations table
CREATE TABLE IF NOT EXISTS donations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  donor_id UUID REFERENCES donors(id) ON DELETE CASCADE,
  hospital_name TEXT, -- Made Optional (Removed NOT NULL)
  donation_date DATE, -- Made Optional (Removed NOT NULL)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  -- Removed availability_status
);

-- Migration for existing tables (Safe to run multiple times)
DO $$
BEGIN
    -- Add unique constraint to phone if not exists
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'donors_phone_key') THEN
        ALTER TABLE donors ADD CONSTRAINT donors_phone_key UNIQUE (phone);
    END IF;

    -- Make hospital_name and donation_date optional
    ALTER TABLE donations ALTER COLUMN hospital_name DROP NOT NULL;
    ALTER TABLE donations ALTER COLUMN donation_date DROP NOT NULL;

    -- Remove availability_status if exists
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='donations' AND column_name='availability_status') THEN
        ALTER TABLE donations DROP COLUMN availability_status;
    END IF;
END $$;

-- Enable RLS
ALTER TABLE committees ENABLE ROW LEVEL SECURITY;
ALTER TABLE units ENABLE ROW LEVEL SECURITY;
ALTER TABLE donors ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;

-- RLS Policies (Drop then Create for idempotency)
DROP POLICY IF EXISTS "Allow public read access on committees" ON committees;
CREATE POLICY "Allow public read access on committees" ON committees FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read access on units" ON units;
CREATE POLICY "Allow public read access on units" ON units FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read access on donors" ON donors;
CREATE POLICY "Allow public read access on donors" ON donors FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public donor registration" ON donors;
CREATE POLICY "Allow public donor registration" ON donors FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated full access on committees" ON committees;
CREATE POLICY "Allow authenticated full access on committees" ON committees FOR ALL TO authenticated USING (true);

DROP POLICY IF EXISTS "Allow authenticated full access on units" ON units;
CREATE POLICY "Allow authenticated full access on units" ON units FOR ALL TO authenticated USING (true);

DROP POLICY IF EXISTS "Allow authenticated full access on donors" ON donors;
CREATE POLICY "Allow authenticated full access on donors" ON donors FOR ALL TO authenticated USING (true);

DROP POLICY IF EXISTS "Allow public read access on donations" ON donations;
CREATE POLICY "Allow public read access on donations" ON donations FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert on donations" ON donations;
CREATE POLICY "Allow public insert on donations" ON donations FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated full access on donations" ON donations;
CREATE POLICY "Allow authenticated full access on donations" ON donations FOR ALL TO authenticated USING (true);

-- updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers (Drop then Create)
DROP TRIGGER IF EXISTS update_committees_updated_at ON committees;
CREATE TRIGGER update_committees_updated_at BEFORE UPDATE ON committees FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

DROP TRIGGER IF EXISTS update_units_updated_at ON units;
CREATE TRIGGER update_units_updated_at BEFORE UPDATE ON units FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

DROP TRIGGER IF EXISTS update_donors_updated_at ON donors;
CREATE TRIGGER update_donors_updated_at BEFORE UPDATE ON donors FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Initial Committee Data
INSERT INTO committees (name) VALUES
('Dharmmadam South'),
('Dharmmadam North'),
('Andaloor'),
('Parapram'),
('Pinarayi South'),
('Pinarayi'),
('Eruvatty West'),
('Eruvatty East'),
('Kottayam South'),
('Kottayam'),
('Kinavakkal'),
('Vengad'),
('Paduvilayi'),
('Pathiriyad'),
('Mambaram')
ON CONFLICT (name) DO NOTHING;
