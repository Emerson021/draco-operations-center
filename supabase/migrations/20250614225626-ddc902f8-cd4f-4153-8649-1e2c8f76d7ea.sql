
-- Limpar todo o banco de dados e recriar do zero

-- 1. Remover todas as políticas RLS existentes
DROP POLICY IF EXISTS "Usuários podem ver todos os perfis" ON public.profiles;
DROP POLICY IF EXISTS "Usuários podem atualizar próprio perfil" ON public.profiles;
DROP POLICY IF EXISTS "Agentes podem ver casos onde estão envolvidos" ON public.casos;
DROP POLICY IF EXISTS "Agentes podem criar casos" ON public.casos;
DROP POLICY IF EXISTS "Responsáveis podem atualizar casos" ON public.casos;
DROP POLICY IF EXISTS "Acesso às evidências baseado no caso" ON public.evidencias;
DROP POLICY IF EXISTS "Usuários veem mensagens enviadas ou recebidas" ON public.mensagens;
DROP POLICY IF EXISTS "Usuários podem enviar mensagens" ON public.mensagens;
DROP POLICY IF EXISTS "Delegados e coordenadores veem operações" ON public.operacoes;
DROP POLICY IF EXISTS "Delegados podem criar operações" ON public.operacoes;
DROP POLICY IF EXISTS "Acesso aos documentos baseado no caso" ON public.documentos;
DROP POLICY IF EXISTS "Usuário pode ver suas próprias notificações" ON public.notificacoes;
DROP POLICY IF EXISTS "Usuário pode criar suas próprias notificações" ON public.notificacoes;
DROP POLICY IF EXISTS "Usuário pode atualizar notificações próprias" ON public.notificacoes;
DROP POLICY IF EXISTS "Usuário pode deletar notificações próprias" ON public.notificacoes;

-- 2. Remover todos os triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
DROP TRIGGER IF EXISTS update_casos_updated_at ON public.casos;

-- 3. Remover todas as funções
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.handle_updated_at() CASCADE;

-- 4. Remover todas as tabelas
DROP TABLE IF EXISTS public.documentos CASCADE;
DROP TABLE IF EXISTS public.operacoes CASCADE;
DROP TABLE IF EXISTS public.mensagens CASCADE;
DROP TABLE IF EXISTS public.evidencias CASCADE;
DROP TABLE IF EXISTS public.casos CASCADE;
DROP TABLE IF EXISTS public.notificacoes CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- 5. Remover todos os tipos enum
DROP TYPE IF EXISTS public.cargo_type CASCADE;
DROP TYPE IF EXISTS public.status_caso CASCADE;
DROP TYPE IF EXISTS public.prioridade_type CASCADE;

-- 6. Recriar os tipos enum
CREATE TYPE public.cargo_type AS ENUM ('agente', 'delegado');
CREATE TYPE public.status_caso AS ENUM ('ativo', 'investigacao', 'suspenso', 'fechado');
CREATE TYPE public.prioridade_type AS ENUM ('baixa', 'media', 'alta', 'urgente');

-- 7. Recriar a tabela de perfis
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  numero_placa TEXT NOT NULL UNIQUE,
  nome_completo TEXT NOT NULL,
  cargo cargo_type NOT NULL DEFAULT 'agente',
  unidade TEXT DEFAULT 'DRACO',
  telefone TEXT,
  email TEXT,
  data_ingresso DATE DEFAULT CURRENT_DATE,
  status_ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Recriar a tabela de casos
CREATE TABLE public.casos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  numero_inquerito TEXT NOT NULL UNIQUE,
  titulo TEXT NOT NULL,
  descricao TEXT,
  agente_responsavel UUID REFERENCES public.profiles(id) NOT NULL,
  delegado_supervisor UUID REFERENCES public.profiles(id),
  status status_caso DEFAULT 'ativo',
  prioridade prioridade_type DEFAULT 'media',
  data_abertura TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  data_fechamento TIMESTAMP WITH TIME ZONE,
  localizacao TEXT,
  suspeitos JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Recriar a tabela de evidências
CREATE TABLE public.evidencias (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  caso_id UUID REFERENCES public.casos(id) ON DELETE CASCADE NOT NULL,
  tipo_evidencia TEXT NOT NULL,
  descricao TEXT NOT NULL,
  arquivo_url TEXT,
  arquivo_nome TEXT,
  coletado_por UUID REFERENCES public.profiles(id) NOT NULL,
  data_coleta TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  cadeia_custodia JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. Recriar a tabela de mensagens
CREATE TABLE public.mensagens (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  remetente_id UUID REFERENCES public.profiles(id) NOT NULL,
  destinatario_id UUID REFERENCES public.profiles(id),
  caso_id UUID REFERENCES public.casos(id),
  conteudo TEXT NOT NULL,
  tipo_mensagem TEXT DEFAULT 'texto',
  is_grupo BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. Recriar a tabela de operações
CREATE TABLE public.operacoes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome_operacao TEXT NOT NULL,
  descricao TEXT,
  coordenador UUID REFERENCES public.profiles(id) NOT NULL,
  data_inicio TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  data_fim TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'planejamento',
  casos_relacionados UUID[] DEFAULT '{}',
  agentes_envolvidos UUID[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 12. Recriar a tabela de documentos
CREATE TABLE public.documentos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  caso_id UUID REFERENCES public.casos(id) ON DELETE CASCADE NOT NULL,
  tipo_documento TEXT NOT NULL,
  titulo TEXT NOT NULL,
  conteudo TEXT,
  arquivo_url TEXT,
  criado_por UUID REFERENCES public.profiles(id) NOT NULL,
  assinado_por UUID[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 13. Recriar a tabela de notificações
CREATE TABLE public.notificacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  titulo TEXT NOT NULL,
  mensagem TEXT,
  tipo TEXT DEFAULT 'info',
  lida BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 14. Habilitar RLS em todas as tabelas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.casos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evidencias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mensagens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.operacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notificacoes ENABLE ROW LEVEL SECURITY;

-- 15. Recriar todas as políticas RLS
CREATE POLICY "Usuários podem ver todos os perfis" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Usuários podem atualizar próprio perfil" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Agentes podem ver casos onde estão envolvidos" ON public.casos
  FOR SELECT USING (
    agente_responsavel = auth.uid() OR 
    delegado_supervisor = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND cargo = 'delegado'
    )
  );

CREATE POLICY "Agentes podem criar casos" ON public.casos
  FOR INSERT WITH CHECK (agente_responsavel = auth.uid());

CREATE POLICY "Responsáveis podem atualizar casos" ON public.casos
  FOR UPDATE USING (
    agente_responsavel = auth.uid() OR 
    delegado_supervisor = auth.uid()
  );

CREATE POLICY "Acesso às evidências baseado no caso" ON public.evidencias
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.casos 
      WHERE id = caso_id AND (
        agente_responsavel = auth.uid() OR 
        delegado_supervisor = auth.uid() OR
        EXISTS (
          SELECT 1 FROM public.profiles 
          WHERE id = auth.uid() AND cargo = 'delegado'
        )
      )
    )
  );

CREATE POLICY "Usuários veem mensagens enviadas ou recebidas" ON public.mensagens
  FOR SELECT USING (
    remetente_id = auth.uid() OR 
    destinatario_id = auth.uid() OR
    (caso_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM public.casos 
      WHERE id = caso_id AND (
        agente_responsavel = auth.uid() OR 
        delegado_supervisor = auth.uid()
      )
    ))
  );

CREATE POLICY "Usuários podem enviar mensagens" ON public.mensagens
  FOR INSERT WITH CHECK (remetente_id = auth.uid());

CREATE POLICY "Delegados e coordenadores veem operações" ON public.operacoes
  FOR SELECT USING (
    coordenador = auth.uid() OR
    auth.uid() = ANY(agentes_envolvidos) OR
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND cargo = 'delegado'
    )
  );

CREATE POLICY "Delegados podem criar operações" ON public.operacoes
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND cargo = 'delegado'
    )
  );

CREATE POLICY "Acesso aos documentos baseado no caso" ON public.documentos
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.casos 
      WHERE id = caso_id AND (
        agente_responsavel = auth.uid() OR 
        delegado_supervisor = auth.uid() OR
        EXISTS (
          SELECT 1 FROM public.profiles 
          WHERE id = auth.uid() AND cargo = 'delegado'
        )
      )
    )
  );

CREATE POLICY "Usuário pode ver suas próprias notificações" ON public.notificacoes
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Usuário pode criar suas próprias notificações" ON public.notificacoes
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Usuário pode atualizar notificações próprias" ON public.notificacoes
  FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Usuário pode deletar notificações próprias" ON public.notificacoes
  FOR DELETE USING (auth.uid()::text = user_id::text);

-- 16. Recriar funções
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    user_cargo cargo_type;
BEGIN
    BEGIN
        user_cargo := COALESCE((NEW.raw_user_meta_data->>'cargo')::cargo_type, 'agente'::cargo_type);
    EXCEPTION WHEN others THEN
        user_cargo := 'agente'::cargo_type;
    END;
    
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
    RAISE WARNING 'Erro ao criar perfil para usuário %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 17. Recriar triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_casos_updated_at
  BEFORE UPDATE ON public.casos
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 18. Configurar bucket de storage (se necessário)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('evidencias', 'evidencias', true)
ON CONFLICT (id) DO NOTHING;

-- 19. Habilitar realtime para mensagens
ALTER TABLE public.mensagens REPLICA IDENTITY FULL;
ALTER publication supabase_realtime ADD TABLE public.mensagens;
