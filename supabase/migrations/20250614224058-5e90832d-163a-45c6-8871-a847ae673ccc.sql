
-- Criar enum para cargos apenas se não existir
DO $$ BEGIN
  CREATE TYPE public.cargo_type AS ENUM ('agente', 'delegado');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Criar enum para status de casos apenas se não existir
DO $$ BEGIN
  CREATE TYPE public.status_caso AS ENUM ('ativo', 'investigacao', 'suspenso', 'fechado');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Criar enum para prioridade apenas se não existir
DO $$ BEGIN
  CREATE TYPE public.prioridade_type AS ENUM ('baixa', 'media', 'alta', 'urgente');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Atualizar a função handle_new_user para garantir que funcione corretamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, numero_placa, nome_completo, cargo, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'numero_placa', 'TEMP-' || substr(NEW.id::text, 1, 8)),
    COALESCE(NEW.raw_user_meta_data->>'nome_completo', 'Usuário'),
    COALESCE((NEW.raw_user_meta_data->>'cargo')::cargo_type, 'agente'),
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recriar o trigger se necessário
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
