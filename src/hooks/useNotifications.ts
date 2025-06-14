
import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

// Tipos de notificações
export type NotificationType = "info" | "success" | "warning" | "error";

export interface DracoNotification {
  id: string;
  user_id: string;
  titulo: string;
  mensagem: string | null;
  tipo: NotificationType | string;
  lida: boolean;
  created_at: string;
}

export const useNotifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<DracoNotification[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('notificacoes')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    if (!error) setNotifications(data as DracoNotification[] || []);
    setLoading(false);
  }, [user]);

  const markAsRead = async (id: string) => {
    await supabase.from('notificacoes').update({ lida: true }).eq('id', id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, lida: true } : n))
    );
  };

  const removeNotification = async (id: string) => {
    await supabase.from('notificacoes').delete().eq('id', id);
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const createNotification = async (
    titulo: string,
    mensagem: string,
    tipo: NotificationType = "info"
  ) => {
    if (!user) return;
    const { data } = await supabase
      .from('notificacoes')
      .insert([{ user_id: user.id, titulo, mensagem, tipo }])
      .select()
      .single();
    if (data) setNotifications((prev) => [data as DracoNotification, ...prev]);
  };

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const unreadCount = notifications.filter((n) => !n.lida).length;

  return {
    notifications,
    loading,
    fetchNotifications,
    markAsRead,
    removeNotification,
    createNotification,
    unreadCount,
  };
};
