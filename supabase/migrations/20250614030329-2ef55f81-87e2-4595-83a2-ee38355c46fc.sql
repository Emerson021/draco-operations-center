
-- Criar enum para cargos
CREATE TYPE public.cargo_type AS ENUM ('agente', 'delegado');

-- Criar enum para status de casos
CREATE TYPE public.status_caso AS ENUM ('ativo', 'investigacao', 'suspenso', 'fechado');

-- Criar enum para prioridade
CREATE TYPE public.prioridade_type AS ENUM ('baixa', 'media', 'alta', 'urgente');

-- Tabela de perfis de usuários
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

-- Tabela de casos/inquéritos
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

-- Tabela de evidências
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

-- Tabela de chat/comunicações
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

-- Tabela de operações
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

-- Tabela de documentos
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

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.casos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evidencias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mensagens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.operacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documentos ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para profiles
CREATE POLICY "Usuários podem ver todos os perfis" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Usuários podem atualizar próprio perfil" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Políticas RLS para casos
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

-- Políticas RLS para evidências
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

-- Políticas RLS para mensagens
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

-- Políticas RLS para operações
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

-- Políticas RLS para documentos
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

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_casos_updated_at
  BEFORE UPDATE ON public.casos
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Função para criar perfil automaticamente ao registrar
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

-- Trigger para criar perfil automaticamente
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
