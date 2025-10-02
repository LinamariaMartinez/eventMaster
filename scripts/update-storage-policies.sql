-- Drop existing policies
DROP POLICY IF EXISTS "Users can upload images to their events" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their event images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their event images" ON storage.objects;

-- Recreate with temp folder support
CREATE POLICY "Users can upload images to their events"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'event-images' AND
  (
    (storage.foldername(name))[1] IN (
      SELECT id::text FROM events WHERE user_id = auth.uid()
    )
    OR
    (storage.foldername(name))[1] = 'temp'
  )
);

CREATE POLICY "Users can update their event images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'event-images' AND
  (
    (storage.foldername(name))[1] IN (
      SELECT id::text FROM events WHERE user_id = auth.uid()
    )
    OR
    (storage.foldername(name))[1] = 'temp'
  )
);

CREATE POLICY "Users can delete their event images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'event-images' AND
  (
    (storage.foldername(name))[1] IN (
      SELECT id::text FROM events WHERE user_id = auth.uid()
    )
    OR
    (storage.foldername(name))[1] = 'temp'
  )
);
