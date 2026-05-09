-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create committees table (formerly megalas)
CREATE TABLE committees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create units table
CREATE TABLE units (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  committee_id UUID REFERENCES committees(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(committee_id, name)
);

-- Create donors table
CREATE TABLE donors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  committee_id UUID REFERENCES committees(id) ON DELETE SET NULL,
  unit_id UUID REFERENCES units(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  blood_group TEXT NOT NULL,
  dob DATE,
  phone TEXT NOT NULL,
  last_blood_donating_date DATE NULL,
  available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE committees ENABLE ROW LEVEL SECURITY;
ALTER TABLE units ENABLE ROW LEVEL SECURITY;
ALTER TABLE donors ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Public read access for all tables
CREATE POLICY "Allow public read access on committees" ON committees FOR SELECT USING (true);
CREATE POLICY "Allow public read access on units" ON units FOR SELECT USING (true);
CREATE POLICY "Allow public read access on donors" ON donors FOR SELECT USING (true);

-- Allow public donor registration (Insert only)
CREATE POLICY "Allow public donor registration" ON donors FOR INSERT WITH CHECK (true);

-- Admin policies (Authenticated users can do everything)
CREATE POLICY "Allow authenticated full access on committees" ON committees FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated full access on units" ON units FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated full access on donors" ON donors FOR ALL TO authenticated USING (true);

-- updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_committees_updated_at BEFORE UPDATE ON committees FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_units_updated_at BEFORE UPDATE ON units FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
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
('Mambaram');

