-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enums
CREATE TYPE guest_status AS ENUM ('pending', 'confirmed', 'declined');
CREATE TYPE template_type AS ENUM ('wedding', 'birthday', 'corporate');
CREATE TYPE response_type AS ENUM ('yes', 'no', 'maybe');

-- Create events table
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  location TEXT NOT NULL,
  description TEXT,
  template_id UUID,
  settings JSONB NOT NULL DEFAULT '{
    "allowPlusOnes": true,
    "requirePhone": false,
    "requireEmail": true,
    "maxGuestsPerInvite": 2,
    "customFields": [],
    "colors": {
      "primary": "#8B4B6B",
      "secondary": "#F5F1E8",
      "accent": "#D4A574"
    }
  }'::jsonb,
  sheets_url TEXT,
  public_url TEXT NOT NULL,
  whatsapp_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create guests table
CREATE TABLE guests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  status guest_status DEFAULT 'pending',
  guest_count INTEGER DEFAULT 1,
  message TEXT,
  dietary_restrictions TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create templates table
CREATE TABLE templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type template_type NOT NULL,
  html_content TEXT NOT NULL,
  css_styles TEXT NOT NULL,
  preview_image TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create confirmations table
CREATE TABLE confirmations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  guest_id UUID REFERENCES guests(id) ON DELETE SET NULL,
  response response_type NOT NULL,
  confirmed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  additional_notes TEXT,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  guest_count INTEGER DEFAULT 1,
  dietary_restrictions TEXT,
  custom_responses JSONB
);

-- Create indexes for better performance
CREATE INDEX idx_events_user_id ON events(user_id);
CREATE INDEX idx_events_date ON events(date);
CREATE INDEX idx_guests_event_id ON guests(event_id);
CREATE INDEX idx_guests_status ON guests(status);
CREATE INDEX idx_confirmations_event_id ON confirmations(event_id);
CREATE INDEX idx_confirmations_response ON confirmations(response);
CREATE INDEX idx_templates_type ON templates(type);
CREATE INDEX idx_templates_is_active ON templates(is_active);

-- Set up Row Level Security (RLS)
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE confirmations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for events
CREATE POLICY "Users can view their own events" ON events
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own events" ON events
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own events" ON events
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own events" ON events
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for guests
CREATE POLICY "Users can view guests of their events" ON guests
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM events 
      WHERE events.id = guests.event_id 
      AND events.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage guests of their events" ON guests
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM events 
      WHERE events.id = guests.event_id 
      AND events.user_id = auth.uid()
    )
  );

-- RLS Policies for templates (public read, admin write)
CREATE POLICY "Anyone can view active templates" ON templates
  FOR SELECT USING (is_active = true);

-- RLS Policies for confirmations
CREATE POLICY "Public can create confirmations" ON confirmations
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view confirmations for their events" ON confirmations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM events 
      WHERE events.id = confirmations.event_id 
      AND events.user_id = auth.uid()
    )
  );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for events table
CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

-- Insert default templates
INSERT INTO templates (name, type, html_content, css_styles, preview_image, is_active) VALUES
(
  'Elegante Boda',
  'wedding',
  '<div class="invitation-wrapper">
    <div class="header">
      <h1>{{event_title}}</h1>
      <p class="subtitle">Nos complace invitarte a nuestra boda</p>
    </div>
    <div class="details">
      <div class="date-time">
        <p><strong>Fecha:</strong> {{event_date}}</p>
        <p><strong>Hora:</strong> {{event_time}}</p>
      </div>
      <div class="location">
        <p><strong>Lugar:</strong> {{event_location}}</p>
      </div>
      <div class="description">
        <p>{{event_description}}</p>
      </div>
    </div>
    <div class="rsvp-section">
      <p>Por favor confirma tu asistencia</p>
    </div>
  </div>',
  '.invitation-wrapper {
    max-width: 600px;
    margin: 0 auto;
    background: linear-gradient(135deg, #8B4B6B 0%, #A0516F 100%);
    color: #F5F1E8;
    padding: 40px;
    border-radius: 15px;
    text-align: center;
    font-family: "Georgia", serif;
  }
  .header h1 {
    font-size: 2.5rem;
    margin-bottom: 10px;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
  }
  .subtitle {
    font-style: italic;
    font-size: 1.1rem;
    margin-bottom: 30px;
  }
  .details {
    background: rgba(245, 241, 232, 0.1);
    padding: 25px;
    border-radius: 10px;
    margin: 25px 0;
  }
  .date-time, .location, .description {
    margin-bottom: 15px;
  }
  .rsvp-section {
    margin-top: 30px;
    font-size: 1.1rem;
    font-weight: bold;
  }',
  null,
  true
),
(
  'Fiesta de Cumpleaños',
  'birthday',
  '<div class="invitation-wrapper">
    <div class="header">
      <h1>¡Celebremos Juntos!</h1>
      <h2>{{event_title}}</h2>
    </div>
    <div class="party-details">
      <div class="when-where">
        <p><strong>📅 Cuándo:</strong> {{event_date}} a las {{event_time}}</p>
        <p><strong>📍 Dónde:</strong> {{event_location}}</p>
      </div>
      <div class="description">
        <p>{{event_description}}</p>
      </div>
    </div>
    <div class="rsvp-section">
      <p>¡Confirma tu asistencia!</p>
    </div>
  </div>',
  '.invitation-wrapper {
    max-width: 600px;
    margin: 0 auto;
    background: linear-gradient(45deg, #FF6B6B, #4ECDC4, #45B7D1);
    background-size: 300% 300%;
    animation: gradientShift 3s ease infinite;
    color: white;
    padding: 40px;
    border-radius: 20px;
    text-align: center;
    font-family: "Arial", sans-serif;
  }
  @keyframes gradientShift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  .header h1 {
    font-size: 2.2rem;
    margin-bottom: 10px;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
  }
  .header h2 {
    font-size: 1.8rem;
    margin-bottom: 25px;
  }
  .party-details {
    background: rgba(255, 255, 255, 0.2);
    padding: 25px;
    border-radius: 15px;
    margin: 25px 0;
  }
  .when-where p {
    font-size: 1.1rem;
    margin-bottom: 10px;
  }
  .rsvp-section {
    margin-top: 30px;
    font-size: 1.2rem;
    font-weight: bold;
  }',
  null,
  true
),
(
  'Evento Corporativo',
  'corporate',
  '<div class="invitation-wrapper">
    <div class="header">
      <div class="logo-section">
        <h1>Catalina Lezama Eventos</h1>
      </div>
      <h2>{{event_title}}</h2>
    </div>
    <div class="event-details">
      <div class="info-grid">
        <div class="info-item">
          <strong>Fecha:</strong> {{event_date}}
        </div>
        <div class="info-item">
          <strong>Hora:</strong> {{event_time}}
        </div>
        <div class="info-item">
          <strong>Ubicación:</strong> {{event_location}}
        </div>
      </div>
      <div class="description">
        <p>{{event_description}}</p>
      </div>
    </div>
    <div class="rsvp-section">
      <p>Se requiere confirmación de asistencia</p>
    </div>
  </div>',
  '.invitation-wrapper {
    max-width: 600px;
    margin: 0 auto;
    background: linear-gradient(135deg, #2C3E50 0%, #34495E 100%);
    color: #ECF0F1;
    padding: 40px;
    border-radius: 8px;
    font-family: "Helvetica", sans-serif;
  }
  .header {
    text-align: center;
    border-bottom: 2px solid #8B4B6B;
    padding-bottom: 20px;
    margin-bottom: 30px;
  }
  .logo-section h1 {
    color: #8B4B6B;
    font-size: 1.3rem;
    margin-bottom: 15px;
    font-weight: 300;
  }
  .header h2 {
    font-size: 2rem;
    margin: 0;
    font-weight: 400;
  }
  .event-details {
    margin-bottom: 30px;
  }
  .info-grid {
    display: grid;
    gap: 15px;
    margin-bottom: 25px;
  }
  .info-item {
    padding: 12px;
    background: rgba(139, 75, 107, 0.1);
    border-left: 4px solid #8B4B6B;
    font-size: 1rem;
  }
  .description {
    background: rgba(255, 255, 255, 0.05);
    padding: 20px;
    border-radius: 4px;
  }
  .rsvp-section {
    text-align: center;
    padding: 20px;
    background: #8B4B6B;
    border-radius: 4px;
    font-weight: 500;
  }',
  null,
  true
);