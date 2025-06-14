
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { 
  FileText, 
  Users, 
  AlertTriangle, 
  Clock, 
  Plus,
  LogOut,
  Shield,
  MessageSquare,
  Upload,
  Search
} from 'lucide-react';

import ChatSystem from './ChatSystem';
import EvidenceUpload from './EvidenceUpload';
import CaseForm from './CaseForm';
import SearchAndFilters from './SearchAndFilters';

interface Caso {
  id: string;
  numero_inquerito: string;
  titulo: string;
  status: 'ativo' | 'investigacao' | 'suspenso' | 'fechado';
  prioridade: 'baixa' | 'media' | 'alta' | 'urgente';
  data_abertura: string;
  agente_responsavel: string;
  delegado_supervisor?: string;
  agente_profile?: { nome_completo: string; numero_placa: string };
  delegado_profile?: { nome_completo: string; numero_placa: string };
}

interface SearchFilters {
  search: string;
  status: string;
  prioridade: string;
  agente: string;
}

const RealDashboard = () => {
  const { user, profile, signOut, isDelegado, isAgente } = useAuth();
  const [casos, setCasos] = useState<Caso[]>([]);
  const [filteredCasos, setFilteredCasos] = useState<Caso[]>([]);
  const [agentes, setAgentes] = useState<Array<{ id: string; nome_completo: string; numero_placa: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCaseForEvidence, setSelectedCaseForEvidence] = useState<string | null>(null);
  const [showCaseForm, setShowCaseForm] = useState(false);
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
      fetchAgentes();
      fetchStats();
    }
  }, [user]);

  useEffect(() => {
    setFilteredCasos(casos);
  }, [casos]);

  const fetchAgentes = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, nome_completo, numero_placa')
        .eq('status_ativo', true);

      if (error) throw error;
      setAgentes(data || []);
    } catch (error) {
      console.error('Error fetching agentes:', error);
    }
  };

  const fetchCasos = async () => {
    try {
      let query = supabase
        .from('casos')
        .select(`
          *,
          agente_profile:profiles!agente_responsavel(nome_completo, numero_placa),
          delegado_profile:profiles!delegado_supervisor(nome_completo, numero_placa)
        `)
        .order('created_at', { ascending: false });

      // Se for agente, só mostra casos onde ele está envolvido
      if (isAgente && !isDelegado) {
        query = query.eq('agente_responsavel', user?.id);
      }

      const { data, error } = await query;

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
      let query = supabase.from('casos').select('status, prioridade');

      // Se for agente, só conta casos onde ele está envolvido
      if (isAgente && !isDelegado) {
        query = query.eq('agente_responsavel', user?.id);
      }

      const { data, error } = await query;

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

  const handleFiltersChange = (filters: SearchFilters) => {
    let filtered = [...casos];

    // Filtro de busca
    if (filters.search) {
      filtered = filtered.filter(caso => 
        caso.titulo.toLowerCase().includes(filters.search.toLowerCase()) ||
        caso.numero_inquerito.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Filtro de status
    if (filters.status) {
      filtered = filtered.filter(caso => caso.status === filters.status);
    }

    // Filtro de prioridade
    if (filters.prioridade) {
      filtered = filtered.filter(caso => caso.prioridade === filters.prioridade);
    }

    // Filtro de agente
    if (filters.agente) {
      filtered = filtered.filter(caso => caso.agente_responsavel === filters.agente);
    }

    setFilteredCasos(filtered);
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
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="bg-draco-gray-700">
            <TabsTrigger 
              value="dashboard"
              className="data-[state=active]:bg-draco-gold-500 data-[state=active]:text-draco-black"
            >
              Dashboard
            </TabsTrigger>
            <TabsTrigger 
              value="chat"
              className="data-[state=active]:bg-draco-gold-500 data-[state=active]:text-draco-black"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Chat
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
            <div className="flex flex-col sm:flex-row gap-4">
              <Dialog open={showCaseForm} onOpenChange={setShowCaseForm}>
                <DialogTrigger asChild>
                  <Button className="draco-button">
                    <Plus className="w-4 h-4 mr-2" />
                    Novo Caso
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Criar Novo Caso</DialogTitle>
                  </DialogHeader>
                  <CaseForm onCaseCreated={() => {
                    setShowCaseForm(false);
                    fetchCasos();
                    fetchStats();
                  }} />
                </DialogContent>
              </Dialog>
            </div>

            {/* Search and Filters */}
            <SearchAndFilters 
              onFiltersChange={handleFiltersChange}
              agentes={agentes}
            />

            {/* Cases List */}
            <Card className="draco-card">
              <CardHeader>
                <CardTitle className="text-draco-gold-400">Casos</CardTitle>
                <CardDescription>
                  {filteredCasos.length === casos.length 
                    ? `${casos.length} casos encontrados`
                    : `${filteredCasos.length} de ${casos.length} casos (filtrados)`
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                {filteredCasos.length === 0 ? (
                  <p className="text-draco-gray-400 text-center py-8">
                    {casos.length === 0 
                      ? "Nenhum caso encontrado. Você pode criar um novo caso clicando no botão acima."
                      : "Nenhum caso corresponde aos filtros aplicados."
                    }
                  </p>
                ) : (
                  <div className="space-y-4">
                    {filteredCasos.map((caso) => (
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
                            <p className="text-sm text-draco-gray-300 mb-1">
                              Agente: {caso.agente_profile?.nome_completo} ({caso.agente_profile?.numero_placa})
                            </p>
                            <p className="text-xs text-draco-gray-400">
                              Aberto em: {new Date(caso.data_abertura).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="border-draco-gray-600 text-draco-gray-300"
                                  onClick={() => setSelectedCaseForEvidence(caso.id)}
                                >
                                  <Upload className="w-4 h-4 mr-2" />
                                  Evidência
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>Adicionar Evidência</DialogTitle>
                                </DialogHeader>
                                {selectedCaseForEvidence && (
                                  <EvidenceUpload 
                                    casoId={selectedCaseForEvidence}
                                    onEvidenceAdded={() => {
                                      toast({
                                        title: "Evidência adicionada",
                                        description: "A evidência foi salva com sucesso."
                                      });
                                    }}
                                  />
                                )}
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="chat" className="space-y-6">
            <div className="h-[600px]">
              <ChatSystem />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default RealDashboard;
