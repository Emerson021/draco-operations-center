
-- Criar bucket para evidências
INSERT INTO storage.buckets (id, name, public) 
VALUES ('evidencias', 'evidencias', true);

-- Políticas para o bucket de evidências
CREATE POLICY "Authenticated users can upload evidence" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'evidencias' AND 
    auth.role() = 'authenticated'
  );

CREATE POLICY "Users can view evidence they have access to" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'evidencias' AND
    auth.role() = 'authenticated'
  );

CREATE POLICY "Users can update evidence they uploaded" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'evidencias' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete evidence they uploaded" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'evidencias' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Habilitar realtime para mensagens
ALTER TABLE public.mensagens REPLICA IDENTITY FULL;
ALTER publication supabase_realtime ADD TABLE public.mensagens;
