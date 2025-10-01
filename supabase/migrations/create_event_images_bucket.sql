-- Create the event-images storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'event-images',
  'event-images',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload images to their event folders
CREATE POLICY "Users can upload images to their events"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'event-images' AND
  (storage.foldername(name))[1] IN (
    SELECT id::text FROM events WHERE user_id = auth.uid()
  )
);

-- Allow authenticated users to update their own event images
CREATE POLICY "Users can update their event images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'event-images' AND
  (storage.foldername(name))[1] IN (
    SELECT id::text FROM events WHERE user_id = auth.uid()
  )
);

-- Allow authenticated users to delete their own event images
CREATE POLICY "Users can delete their event images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'event-images' AND
  (storage.foldername(name))[1] IN (
    SELECT id::text FROM events WHERE user_id = auth.uid()
  )
);

-- Allow everyone to view public images (for the public invitation page)
CREATE POLICY "Anyone can view event images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'event-images');
