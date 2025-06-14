
-- Criação da tabela de notificações
CREATE TABLE public.notificacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  titulo TEXT NOT NULL,
  mensagem TEXT,
  tipo TEXT DEFAULT 'info',
  lida BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Ativar RLS
ALTER TABLE public.notificacoes ENABLE ROW LEVEL SECURITY;

-- Ver suas próprias notificações
CREATE POLICY "Usuário pode ver suas próprias notificações"
  ON public.notificacoes
  FOR SELECT
  USING (auth.uid() = user_id);

-- Inserir sua própria notificação (por código)
CREATE POLICY "Usuário pode criar suas próprias notificações"
  ON public.notificacoes
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Usuário pode marcar como lida sua própria notificação
CREATE POLICY "Usuário pode atualizar notificações próprias"
  ON public.notificacoes
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Usuário pode deletar notificações próprias (opcional)
CREATE POLICY "Usuário pode deletar notificações próprias"
  ON public.notificacoes
  FOR DELETE
  USING (auth.uid() = user_id);
