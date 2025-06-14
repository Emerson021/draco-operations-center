
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Plus, Save } from 'lucide-react';

interface CaseFormProps {
  onCaseCreated?: () => void;
}

const CaseForm = ({ onCaseCreated }: CaseFormProps) => {
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    prioridade: 'media' as 'baixa' | 'media' | 'alta' | 'urgente',
    localizacao: ''
  });
  const { toast } = useToast();

  const generateInqueritoNumber = () => {
    const year = new Date().getFullYear();
    const timestamp = Date.now().toString().slice(-6);
    return `INQ-${year}-${timestamp}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !formData.titulo.trim()) return;

    setLoading(true);

    try {
      const { error } = await supabase
        .from('casos')
        .insert({
          numero_inquerito: generateInqueritoNumber(),
          titulo: formData.titulo.trim(),
          descricao: formData.descricao.trim() || null,
          agente_responsavel: user.id,
          prioridade: formData.prioridade,
          localizacao: formData.localizacao.trim() || null,
          status: 'ativo'
        });

      if (error) throw error;

      toast({
        title: "Caso criado",
        description: "O novo caso foi criado com sucesso."
      });

      // Limpar formulário
      setFormData({
        titulo: '',
        descricao: '',
        prioridade: 'media',
        localizacao: ''
      });

      onCaseCreated?.();

    } catch (error) {
      console.error('Error creating case:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar o caso.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="draco-card">
      <CardHeader>
        <CardTitle className="text-draco-gold-400 flex items-center">
          <Plus className="w-5 h-5 mr-2" />
          Novo Caso
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="titulo" className="text-draco-gray-300">
              Título do Caso *
            </Label>
            <Input
              id="titulo"
              value={formData.titulo}
              onChange={(e) => setFormData(prev => ({ ...prev, titulo: e.target.value }))}
              placeholder="Ex: Operação Lavagem de Dinheiro..."
              className="bg-draco-gray-700 border-draco-gray-600 text-draco-gray-100"
              required
            />
          </div>

          <div>
            <Label htmlFor="descricao" className="text-draco-gray-300">
              Descrição
            </Label>
            <Textarea
              id="descricao"
              value={formData.descricao}
              onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
              placeholder="Descrição detalhada do caso..."
              className="bg-draco-gray-700 border-draco-gray-600 text-draco-gray-100"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="prioridade" className="text-draco-gray-300">
                Prioridade
              </Label>
              <Select 
                value={formData.prioridade} 
                onValueChange={(value: 'baixa' | 'media' | 'alta' | 'urgente') => 
                  setFormData(prev => ({ ...prev, prioridade: value }))
                }
              >
                <SelectTrigger className="bg-draco-gray-700 border-draco-gray-600 text-draco-gray-100">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="baixa">Baixa</SelectItem>
                  <SelectItem value="media">Média</SelectItem>
                  <SelectItem value="alta">Alta</SelectItem>
                  <SelectItem value="urgente">Urgente</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="localizacao" className="text-draco-gray-300">
                Localização
              </Label>
              <Input
                id="localizacao"
                value={formData.localizacao}
                onChange={(e) => setFormData(prev => ({ ...prev, localizacao: e.target.value }))}
                placeholder="Local do caso..."
                className="bg-draco-gray-700 border-draco-gray-600 text-draco-gray-100"
              />
            </div>
          </div>

          <Button type="submit" disabled={loading || !formData.titulo.trim()} className="draco-button w-full">
            {loading ? (
              <>Criando...</>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Criar Caso
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CaseForm;
