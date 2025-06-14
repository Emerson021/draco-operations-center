
import { useState } from 'react';
import { Shield, Users, FileText, MessageSquare, Calendar, Award, ChevronRight, Eye, Clock, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Operation {
  id: string;
  name: string;
  date: string;
  status: 'active' | 'completed' | 'classified';
  location: string;
  description: string;
}

interface News {
  id: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
}

const Homepage = () => {
  const [operations] = useState<Operation[]>([
    {
      id: '1',
      name: 'Operação Tempestade',
      date: '2024-06-10',
      status: 'active',
      location: 'São Paulo - Capital',
      description: 'Investigação de organização criminosa especializada em lavagem de dinheiro'
    },
    {
      id: '2',
      name: 'Operação Vigilante',
      date: '2024-06-08',
      status: 'completed',
      location: 'Santos - SP',
      description: 'Desarticulação de esquema de tráfico internacional'
    },
    {
      id: '3',
      name: 'Operação Guardião',
      date: '2024-06-05',
      status: 'classified',
      location: 'Classificado',
      description: 'Operação em andamento - detalhes classificados'
    }
  ]);

  const [news] = useState<News[]>([
    {
      id: '1',
      title: 'Nova parceria com Interpol fortalece investigações',
      date: '2024-06-12',
      category: 'Institucional',
      excerpt: 'DRACO firma acordo de cooperação internacional para combate ao crime organizado transnacional.'
    },
    {
      id: '2',
      title: 'Treinamento avançado em cibercrime',
      date: '2024-06-10',
      category: 'Capacitação',
      excerpt: 'Agentes participam de curso especializado em investigação digital e crimes cibernéticos.'
    },
    {
      id: '3',
      title: 'Apreensão record em operação anti-drogas',
      date: '2024-06-08',
      category: 'Operações',
      excerpt: 'DRACO registra maior apreensão de entorpecentes do ano em ação coordenada.'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-red-600';
      case 'completed': return 'bg-green-600';
      case 'classified': return 'bg-draco-gold-600';
      default: return 'bg-gray-600';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'ATIVA';
      case 'completed': return 'CONCLUÍDA';
      case 'classified': return 'CLASSIFICADA';
      default: return 'DESCONHECIDA';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-draco-black via-draco-gray-900 to-draco-gray-800">
      {/* Hero Section */}
      <section className="relative py-20 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-draco-gold-600/10 to-transparent"></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="flex items-center justify-center mb-6">
            <div className="draco-badge w-16 h-16 text-2xl mr-4">
              <Shield className="w-8 h-8" />
            </div>
            <div className="text-left">
              <h1 className="text-4xl md:text-6xl font-bold text-draco-gold-400 mb-2">
                DRACO
              </h1>
              <p className="text-draco-gray-300 text-lg">
                Divisão de Repressão e Análise ao Crime Organizado
              </p>
            </div>
          </div>
          
          <p className="text-xl text-draco-gray-300 mb-8 leading-relaxed">
            Elite da Polícia Civil de São Paulo no combate ao crime organizado, 
            lavagem de dinheiro e investigações complexas.
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center">
            <Button className="draco-button">
              <Users className="w-5 h-5 mr-2" />
              Área do Agente
            </Button>
            <Button variant="outline" className="border-draco-gold-500 text-draco-gold-400 hover:bg-draco-gold-500 hover:text-draco-black">
              <Shield className="w-5 h-5 mr-2" />
              Área do Delegado
            </Button>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-draco-gold-400">
            Nossa Missão
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="draco-card group">
              <CardHeader>
                <div className="draco-badge mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Shield className="w-5 h-5" />
                </div>
                <CardTitle className="text-draco-gold-400">Investigação</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-draco-gray-300">
                  Conduzir investigações complexas contra organizações criminosas 
                  utilizando técnicas especializadas e tecnologia avançada.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="draco-card group">
              <CardHeader>
                <div className="draco-badge mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Eye className="w-5 h-5" />
                </div>
                <CardTitle className="text-draco-gold-400">Inteligência</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-draco-gray-300">
                  Análise de dados e produção de inteligência policial para 
                  identificar padrões criminais e redes organizadas.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="draco-card group">
              <CardHeader>
                <div className="draco-badge mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Award className="w-5 h-5" />
                </div>
                <CardTitle className="text-draco-gold-400">Excelência</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-draco-gray-300">
                  Manter os mais altos padrões de qualidade e ética nas 
                  investigações, garantindo a segurança da sociedade.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Recent Operations */}
      <section className="py-16 px-6 bg-draco-gray-900/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-draco-gold-400">
            Operações Recentes
          </h2>
          
          <div className="grid gap-6">
            {operations.map((operation) => (
              <Card key={operation.id} className="draco-card hover:shadow-lg hover:shadow-draco-gold-500/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <div className="flex items-center space-x-4">
                    <Badge className={`${getStatusColor(operation.status)} text-white`}>
                      {getStatusText(operation.status)}
                    </Badge>
                    <CardTitle className="text-draco-gold-400">{operation.name}</CardTitle>
                  </div>
                  <div className="flex items-center text-draco-gray-400 text-sm">
                    <Calendar className="w-4 h-4 mr-2" />
                    {new Date(operation.date).toLocaleDateString('pt-BR')}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-draco-gray-400 text-sm mb-3">
                    <MapPin className="w-4 h-4 mr-2" />
                    {operation.location}
                  </div>
                  <CardDescription className="text-draco-gray-300 mb-4">
                    {operation.description}
                  </CardDescription>
                  <Button variant="ghost" className="text-draco-gold-400 hover:text-draco-gold-300 p-0">
                    Ver detalhes
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-draco-gold-400">
            Notícias RP
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((item) => (
              <Card key={item.id} className="draco-card hover:shadow-lg hover:shadow-draco-gold-500/20">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className="border-draco-gold-500 text-draco-gold-400">
                      {item.category}
                    </Badge>
                    <div className="flex items-center text-draco-gray-400 text-sm">
                      <Clock className="w-4 h-4 mr-1" />
                      {new Date(item.date).toLocaleDateString('pt-BR')}
                    </div>
                  </div>
                  <CardTitle className="text-draco-gold-400 text-lg leading-tight">
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-draco-gray-300 mb-4">
                    {item.excerpt}
                  </CardDescription>
                  <Button variant="ghost" className="text-draco-gold-400 hover:text-draco-gold-300 p-0">
                    Ler mais
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-draco-gray-900 py-8 px-6 border-t border-draco-gray-700">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="draco-badge mr-3">
              <Shield className="w-5 h-5" />
            </div>
            <span className="text-draco-gold-400 font-bold text-xl">DRACO</span>
          </div>
          <p className="text-draco-gray-400 text-sm">
            Polícia Civil do Estado de São Paulo - Divisão de Repressão e Análise ao Crime Organizado
          </p>
          <p className="text-draco-gray-500 text-xs mt-2">
            Sistema de Roleplay - Versão 1.0 | Todos os direitos reservados
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;
