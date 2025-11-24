-- Add whatsapp_number field to events table
ALTER TABLE events ADD COLUMN IF NOT EXISTS whatsapp_number TEXT;

-- Add comment to explain the column
COMMENT ON COLUMN events.whatsapp_number IS 'WhatsApp number for event confirmations (optional, format: +57...)';
