-- Create invitation_views table for tracking page visits
CREATE TABLE invitation_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_hash TEXT NOT NULL,
  user_agent TEXT,
  referer TEXT
);

-- Create indexes for better query performance
CREATE INDEX idx_invitation_views_event_id ON invitation_views(event_id);
CREATE INDEX idx_invitation_views_viewed_at ON invitation_views(viewed_at);
CREATE INDEX idx_invitation_views_ip_hash ON invitation_views(ip_hash);

-- Enable RLS for invitation_views
ALTER TABLE invitation_views ENABLE ROW LEVEL SECURITY;

-- Allow public inserts (for tracking views from public invitation pages)
CREATE POLICY "Public can insert views" ON invitation_views
  FOR INSERT WITH CHECK (true);

-- Users can view stats for their own events
CREATE POLICY "Users can view stats for their events" ON invitation_views
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = invitation_views.event_id
      AND events.user_id = auth.uid()
    )
  );

-- Add comments to document the table
COMMENT ON TABLE invitation_views IS 'Tracks invitation page views for analytics';
COMMENT ON COLUMN invitation_views.event_id IS 'Reference to the event being viewed';
COMMENT ON COLUMN invitation_views.viewed_at IS 'Timestamp when the invitation was viewed';
COMMENT ON COLUMN invitation_views.ip_hash IS 'Hashed IP address for privacy (SHA-256)';
COMMENT ON COLUMN invitation_views.user_agent IS 'Browser user agent string';
COMMENT ON COLUMN invitation_views.referer IS 'HTTP referer header';
