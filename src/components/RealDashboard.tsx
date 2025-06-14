
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  FileText, 
  Users, 
  AlertTriangle, 
  Clock, 
  Plus,
  Search,
  Filter,
  LogOut,
  Shield
} from 'lucide-react';

interface Caso {
  id: string;
  numero_inquerito: string;
  titulo: string;
  status: 'ativo' | 'investigacao' | 'suspenso' | 'fechado';
  prioridade: 'baixa' | 'media' | 'alta' | 'urgente';
  data_abertura: string;
  agente_responsavel: string;
  delegado_supervisor?: string;
}

const RealDashboard = () => {
  const { user, profile, signOut, isDelegado, isAgente } = useAuth();
  const [casos, setCasos] = useState<Caso[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCasos: 0,
    casosAtivos: 0,
    casosUrgentes: 0,
    casosEmInvestigacao: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchCasos();
      fetchStats();
    }
  }, [user]);

  const fetchCasos = async () => {
    try {
      const { data, error } = await supabase
        .from('casos')
        .select(`
          *,
          agente_profile:profiles!agente_responsavel(nome_completo),
          delegado_profile:profiles!delegado_supervisor(nome_completo)
        `)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching casos:', error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os casos",
          variant: "destructive"
        });
      } else {
        setCasos(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const { data, error } = await supabase
        .from('casos')
        .select('status, prioridade');

      if (data) {
        const totalCasos = data.length;
        const casosAtivos = data.filter(caso => caso.status === 'ativo').length;
        const casosUrgentes = data.filter(caso => caso.prioridade === 'urgente').length;
        const casosEmInvestigacao = data.filter(caso => caso.status === 'investigacao').length;

        setStats({
          totalCasos,
          casosAtivos,
          casosUrgentes,
          casosEmInvestigacao
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativo': return 'bg-green-500';
      case 'investigacao': return 'bg-blue-500';
      case 'suspenso': return 'bg-yellow-500';
      case 'fechado': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (prioridade: string) => {
    switch (prioridade) {
      case 'urgente': return 'bg-red-500';
      case 'alta': return 'bg-orange-500';
      case 'media': return 'bg-yellow-500';
      case 'baixa': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-draco-black flex items-center justify-center">
        <div className="text-draco-gold-400">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-draco-black">
      {/* Header */}
      <header className="bg-draco-gray-800 border-b border-draco-gray-700 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Shield className="w-8 h-8 text-draco-gold-400" />
            <div>
              <h1 className="text-xl font-bold text-draco-gold-400">DRACO</h1>
              <p className="text-sm text-draco-gray-300">Sistema de Investigação</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-draco-gold-400">{profile?.nome_completo}</p>
              <p className="text-xs text-draco-gray-300">
                {profile?.cargo?.toUpperCase()} - {profile?.numero_placa}
              </p>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={signOut}
              className="border-draco-gray-600 text-draco-gray-300 hover:bg-draco-gray-700"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="draco-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-draco-gray-300">
                Total de Casos
              </CardTitle>
              <FileText className="h-4 w-4 text-draco-gold-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-draco-gold-400">{stats.totalCasos}</div>
            </CardContent>
          </Card>

          <Card className="draco-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-draco-gray-300">
                Casos Ativos
              </CardTitle>
              <Users className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">{stats.casosAtivos}</div>
            </CardContent>
          </Card>

          <Card className="draco-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-draco-gray-300">
                Casos Urgentes
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-400">{stats.casosUrgentes}</div>
            </CardContent>
          </Card>

          <Card className="draco-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-draco-gray-300">
                Em Investigação
              </CardTitle>
              <Clock className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-400">{stats.casosEmInvestigacao}</div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <Button className="draco-button">
            <Plus className="w-4 h-4 mr-2" />
            Novo Caso
          </Button>
          <Button variant="outline" className="border-draco-gray-600 text-draco-gray-300">
            <Search className="w-4 h-4 mr-2" />
            Buscar
          </Button>
          <Button variant="outline" className="border-draco-gray-600 text-draco-gray-300">
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </Button>
        </div>

        {/* Cases List */}
        <Card className="draco-card">
          <CardHeader>
            <CardTitle className="text-draco-gold-400">Casos Recentes</CardTitle>
            <CardDescription>Últimos casos criados ou atualizados</CardDescription>
          </CardHeader>
          <CardContent>
            {casos.length === 0 ? (
              <p className="text-draco-gray-400 text-center py-8">
                Nenhum caso encontrado. {isAgente && "Você pode criar um novo caso clicando no botão acima."}
              </p>
            ) : (
              <div className="space-y-4">
                {casos.map((caso) => (
                  <div key={caso.id} className="border border-draco-gray-700 rounded-lg p-4 hover:bg-draco-gray-800 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-medium text-draco-gold-400">{caso.titulo}</h3>
                          <Badge className={`${getStatusColor(caso.status)} text-white`}>
                            {caso.status}
                          </Badge>
                          <Badge className={`${getPriorityColor(caso.prioridade)} text-white`}>
                            {caso.prioridade}
                          </Badge>
                        </div>
                        <p className="text-sm text-draco-gray-300 mb-1">
                          Inquérito: {caso.numero_inquerito}
                        </p>
                        <p className="text-xs text-draco-gray-400">
                          Aberto em: {new Date(caso.data_abertura).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <Button variant="outline" size="sm" className="border-draco-gray-600 text-draco-gray-300">
                        Ver Detalhes
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RealDashboard;
