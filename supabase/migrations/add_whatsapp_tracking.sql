-- Add WhatsApp tracking fields to guests table
ALTER TABLE guests
ADD COLUMN IF NOT EXISTS whatsapp_sent BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS whatsapp_sent_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS invitation_opened BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS invitation_opened_at TIMESTAMP WITH TIME ZONE;

-- Create index for better performance on whatsapp_sent queries
CREATE INDEX IF NOT EXISTS idx_guests_whatsapp_sent ON guests(whatsapp_sent);
CREATE INDEX IF NOT EXISTS idx_guests_invitation_opened ON guests(invitation_opened);

-- Add comment to document the new fields
COMMENT ON COLUMN guests.whatsapp_sent IS 'Indicates if WhatsApp invitation has been sent to this guest';
COMMENT ON COLUMN guests.whatsapp_sent_at IS 'Timestamp when WhatsApp invitation was sent';
COMMENT ON COLUMN guests.invitation_opened IS 'Indicates if guest has opened the invitation link';
COMMENT ON COLUMN guests.invitation_opened_at IS 'Timestamp when guest first opened the invitation';
