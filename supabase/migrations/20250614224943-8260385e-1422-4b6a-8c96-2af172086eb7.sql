
-- Primeiro, vamos remover a função existente e recriar do zero
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- Recriar os tipos com mais segurança
DROP TYPE IF EXISTS public.cargo_type CASCADE;
CREATE TYPE public.cargo_type AS ENUM ('agente', 'delegado');

DROP TYPE IF EXISTS public.status_caso CASCADE;
CREATE TYPE public.status_caso AS ENUM ('ativo', 'investigacao', 'suspenso', 'fechado');

DROP TYPE IF EXISTS public.prioridade_type CASCADE;
CREATE TYPE public.prioridade_type AS ENUM ('baixa', 'media', 'alta', 'urgente');

-- Recriar a função handle_new_user com verificação mais robusta
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    user_cargo cargo_type;
BEGIN
    -- Determinar o cargo com valor padrão seguro
    BEGIN
        user_cargo := COALESCE((NEW.raw_user_meta_data->>'cargo')::cargo_type, 'agente'::cargo_type);
    EXCEPTION WHEN others THEN
        user_cargo := 'agente'::cargo_type;
    END;
    
    -- Inserir o perfil
    INSERT INTO public.profiles (
        id, 
        numero_placa, 
        nome_completo, 
        cargo, 
        email
    )
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'numero_placa', 'TEMP-' || substr(NEW.id::text, 1, 8)),
        COALESCE(NEW.raw_user_meta_data->>'nome_completo', 'Usuário'),
        user_cargo,
        NEW.email
    );
    
    RETURN NEW;
EXCEPTION WHEN others THEN
    -- Em caso de erro, ainda permitir que o usuário seja criado
    RAISE WARNING 'Erro ao criar perfil para usuário %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recriar o trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
