
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Send, Users } from 'lucide-react';

interface Message {
  id: string;
  remetente_id: string;
  destinatario_id: string | null;
  caso_id: string | null;
  conteudo: string;
  created_at: string;
  remetente: {
    nome_completo: string;
    numero_placa: string;
    cargo: string;
  };
}

interface ChatUser {
  id: string;
  nome_completo: string;
  numero_placa: string;
  cargo: string;
  status_ativo: boolean;
}

const ChatSystem = () => {
  const { user, profile } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [users, setUsers] = useState<ChatUser[]>([]);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchUsers();
      setupRealtimeSubscription();
    }
  }, [user]);

  useEffect(() => {
    if (selectedUser) {
      fetchMessages();
    }
  }, [selectedUser]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, nome_completo, numero_placa, cargo, status_ativo')
        .eq('status_ativo', true)
        .neq('id', user?.id);

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    if (!selectedUser || !user) return;

    try {
      const { data, error } = await supabase
        .from('mensagens')
        .select(`
          *,
          remetente:profiles!remetente_id(nome_completo, numero_placa, cargo)
        `)
        .or(`and(remetente_id.eq.${user.id},destinatario_id.eq.${selectedUser}),and(remetente_id.eq.${selectedUser},destinatario_id.eq.${user.id})`)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('chat-messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'mensagens'
        },
        (payload) => {
          const newMessage = payload.new as any;
          if (
            (newMessage.remetente_id === user?.id || newMessage.destinatario_id === user?.id) &&
            (newMessage.remetente_id === selectedUser || newMessage.destinatario_id === selectedUser)
          ) {
            fetchMessages();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedUser || !user) return;

    try {
      const { error } = await supabase
        .from('mensagens')
        .insert({
          remetente_id: user.id,
          destinatario_id: selectedUser,
          conteudo: newMessage.trim(),
          tipo_mensagem: 'texto'
        });

      if (error) throw error;

      setNewMessage('');
      toast({
        title: "Mensagem enviada",
        description: "Sua mensagem foi enviada com sucesso."
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Erro",
        description: "Não foi possível enviar a mensagem.",
        variant: "destructive"
      });
    }
  };

  const getSelectedUserName = () => {
    const user = users.find(u => u.id === selectedUser);
    return user ? `${user.nome_completo} (${user.numero_placa})` : 'Selecionar usuário';
  };

  if (loading) {
    return <div className="text-draco-gold-400">Carregando chat...</div>;
  }

  return (
    <div className="h-full flex">
      {/* Users List */}
      <div className="w-1/3 border-r border-draco-gray-700">
        <Card className="draco-card h-full">
          <CardHeader>
            <CardTitle className="text-draco-gold-400 flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Agentes Online
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-96">
              <div className="space-y-2">
                {users.map((user) => (
                  <div
                    key={user.id}
                    onClick={() => setSelectedUser(user.id)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedUser === user.id
                        ? 'bg-draco-gold-500/20 border border-draco-gold-500'
                        : 'bg-draco-gray-800 hover:bg-draco-gray-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-draco-gold-400 font-medium">{user.nome_completo}</p>
                        <p className="text-draco-gray-400 text-sm">{user.numero_placa}</p>
                      </div>
                      <Badge className={user.cargo === 'delegado' ? 'bg-purple-500' : 'bg-blue-500'}>
                        {user.cargo}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        <Card className="draco-card h-full flex flex-col">
          <CardHeader>
            <CardTitle className="text-draco-gold-400">
              {selectedUser ? `Chat com ${getSelectedUserName()}` : 'Selecione um agente para conversar'}
            </CardTitle>
          </CardHeader>
          
          {selectedUser ? (
            <>
              <CardContent className="flex-1">
                <ScrollArea className="h-96">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.remetente_id === user?.id ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.remetente_id === user?.id
                              ? 'bg-draco-gold-500 text-draco-black'
                              : 'bg-draco-gray-700 text-draco-gray-100'
                          }`}
                        >
                          {message.remetente_id !== user?.id && (
                            <p className="text-xs text-draco-gray-400 mb-1">
                              {message.remetente?.nome_completo}
                            </p>
                          )}
                          <p>{message.conteudo}</p>
                          <p className={`text-xs mt-1 ${
                            message.remetente_id === user?.id ? 'text-draco-black/70' : 'text-draco-gray-400'
                          }`}>
                            {new Date(message.created_at).toLocaleTimeString('pt-BR', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
              </CardContent>

              <div className="p-4 border-t border-draco-gray-700">
                <div className="flex space-x-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Digite sua mensagem..."
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    className="flex-1 bg-draco-gray-700 border-draco-gray-600 text-draco-gray-100"
                  />
                  <Button onClick={sendMessage} className="draco-button">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <CardContent className="flex-1 flex items-center justify-center">
              <p className="text-draco-gray-400">Selecione um agente na lista para iniciar uma conversa</p>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ChatSystem;
