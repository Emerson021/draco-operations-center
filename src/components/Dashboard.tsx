
import { useState } from 'react';
import { Shield, Search, Plus, Filter, Eye, Clock, User, FileText, AlertTriangle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Case {
  id: string;
  number: string;
  title: string;
  officer: string;
  status: 'active' | 'investigation' | 'closed' | 'suspended';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdDate: string;
  lastUpdate: string;
  description: string;
  evidence: number;
}

interface Officer {
  id: string;
  badge: string;
  name: string;
  rank: string;
  status: 'active' | 'offline' | 'busy';
  cases: number;
  lastSeen: string;
}

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [cases] = useState<Case[]>([
    {
      id: '1',
      number: 'INQ-2024-001',
      title: 'Operação Tempestade - Lavagem de Dinheiro',
      officer: 'Agente Silva',
      status: 'investigation',
      priority: 'urgent',
      createdDate: '2024-06-01',
      lastUpdate: '2024-06-14',
      description: 'Investigação de esquema de lavagem de dinheiro envolvendo empresas de fachada',
      evidence: 15
    },
    {
      id: '2',
      number: 'INQ-2024-002',
      title: 'Tráfico Internacional de Drogas',
      officer: 'Agente Santos',
      status: 'active',
      priority: 'high',
      createdDate: '2024-06-05',
      lastUpdate: '2024-06-13',
      description: 'Rede de tráfico com conexões internacionais através do Porto de Santos',
      evidence: 8
    },
    {
      id: '3',
      number: 'INQ-2024-003',
      title: 'Corrupção em Licitações Públicas',
      officer: 'Agente Oliveira',
      status: 'closed',
      priority: 'medium',
      createdDate: '2024-05-15',
      lastUpdate: '2024-06-10',
      description: 'Esquema de corrupção em processos licitatórios municipais',
      evidence: 22
    }
  ]);

  const [officers] = useState<Officer[]>([
    {
      id: '1',
      badge: 'AG-001234',
      name: 'Carlos Silva',
      rank: 'Investigador',
      status: 'active',
      cases: 3,
      lastSeen: '2024-06-14T10:30:00'
    },
    {
      id: '2',
      badge: 'AG-001235',
      name: 'Maria Santos',
      rank: 'Investigadora Senior',
      status: 'busy',
      cases: 2,
      lastSeen: '2024-06-14T09:15:00'
    },
    {
      id: '3',
      badge: 'AG-001236',
      name: 'João Oliveira',
      rank: 'Investigador',
      status: 'offline',
      cases: 1,
      lastSeen: '2024-06-13T18:45:00'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-600';
      case 'investigation': return 'bg-yellow-600';
      case 'closed': return 'bg-green-600';
      case 'suspended': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-600';
      case 'high': return 'bg-orange-600';
      case 'medium': return 'bg-yellow-600';
      case 'low': return 'bg-green-600';
      default: return 'bg-gray-600';
    }
  };

  const getOfficerStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'busy': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const filteredCases = cases.filter(case_ =>
    case_.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    case_.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    case_.officer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-draco-black via-draco-gray-900 to-draco-gray-800 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="draco-badge w-12 h-12">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-draco-gold-400">
                Dashboard DRACO
              </h1>
              <p className="text-draco-gray-400">
                Central de Comando e Controle
              </p>
            </div>
          </div>
          <Button className="draco-button">
            <Plus className="w-4 h-4 mr-2" />
            Novo Caso
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="draco-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-draco-gray-300">
                Casos Ativos
              </CardTitle>
              <FileText className="h-4 w-4 text-draco-gold-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-draco-gold-400">
                {cases.filter(c => c.status === 'active' || c.status === 'investigation').length}
              </div>
              <p className="text-xs text-draco-gray-500">
                +2 desde ontem
              </p>
            </CardContent>
          </Card>

          <Card className="draco-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-draco-gray-300">
                Agentes Ativos
              </CardTitle>
              <User className="h-4 w-4 text-draco-gold-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-draco-gold-400">
                {officers.filter(o => o.status === 'active' || o.status === 'busy').length}
              </div>
              <p className="text-xs text-draco-gray-500">
                {officers.length} total
              </p>
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
              <div className="text-2xl font-bold text-red-400">
                {cases.filter(c => c.priority === 'urgent').length}
              </div>
              <p className="text-xs text-draco-gray-500">
                Requer atenção imediata
              </p>
            </CardContent>
          </Card>

          <Card className="draco-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-draco-gray-300">
                Casos Resolvidos
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">
                {cases.filter(c => c.status === 'closed').length}
              </div>
              <p className="text-xs text-draco-gray-500">
                Este mês
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="cases" className="space-y-6">
          <TabsList className="bg-draco-gray-700">
            <TabsTrigger 
              value="cases"
              className="data-[state=active]:bg-draco-gold-500 data-[state=active]:text-draco-black"
            >
              Casos
            </TabsTrigger>
            <TabsTrigger 
              value="officers"
              className="data-[state=active]:bg-draco-gold-500 data-[state=active]:text-draco-black"
            >
              Agentes
            </TabsTrigger>
          </TabsList>

          {/* Cases Tab */}
          <TabsContent value="cases" className="space-y-6">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-draco-gray-400" />
                <Input
                  placeholder="Buscar casos por título, número ou agente..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-draco-gray-700 border-draco-gray-600 text-draco-gray-100"
                />
              </div>
              <Button variant="outline" className="border-draco-gold-500 text-draco-gold-400">
                <Filter className="w-4 h-4 mr-2" />
                Filtros
              </Button>
            </div>

            {/* Cases List */}
            <div className="grid gap-6">
              {filteredCases.map((case_) => (
                <Card key={case_.id} className="draco-case hover:shadow-lg hover:shadow-draco-gold-500/20">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-3">
                          <Badge className={`${getStatusColor(case_.status)} text-white`}>
                            {case_.status.toUpperCase()}
                          </Badge>
                          <Badge className={`${getPriorityColor(case_.priority)} text-white`}>
                            {case_.priority.toUpperCase()}
                          </Badge>
                        </div>
                        <CardTitle className="text-draco-gold-400">
                          {case_.title}
                        </CardTitle>
                        <CardDescription className="text-draco-gray-400">
                          {case_.number} • {case_.officer}
                        </CardDescription>
                      </div>
                      <Button variant="ghost" size="sm" className="text-draco-gold-400">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-draco-gray-300 mb-4">
                      {case_.description}
                    </p>
                    <div className="flex items-center justify-between text-sm text-draco-gray-400">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          Criado: {new Date(case_.createdDate).toLocaleDateString('pt-BR')}
                        </div>
                        <div className="flex items-center">
                          <FileText className="w-4 h-4 mr-1" />
                          {case_.evidence} evidências
                        </div>
                      </div>
                      <div className="text-draco-gold-400">
                        Atualizado: {new Date(case_.lastUpdate).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Officers Tab */}
          <TabsContent value="officers" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {officers.map((officer) => (
                <Card key={officer.id} className="draco-card">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <div className="draco-badge">
                            <User className="w-5 h-5" />
                          </div>
                          <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-draco-gray-800 ${getOfficerStatusColor(officer.status)}`}></div>
                        </div>
                        <div>
                          <CardTitle className="text-draco-gold-400 text-lg">
                            {officer.name}
                          </CardTitle>
                          <CardDescription className="text-draco-gray-400">
                            {officer.badge} • {officer.rank}
                          </CardDescription>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-draco-gray-300">Status:</span>
                        <Badge className={`${getOfficerStatusColor(officer.status)} text-white`}>
                          {officer.status.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-draco-gray-300">Casos Ativos:</span>
                        <span className="text-draco-gold-400 font-medium">{officer.cases}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-draco-gray-300">Último Acesso:</span>
                        <span className="text-draco-gray-400 text-sm">
                          {new Date(officer.lastSeen).toLocaleString('pt-BR')}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
