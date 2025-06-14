
import { useState, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Upload, FileText, Image, Video } from 'lucide-react';

interface EvidenceUploadProps {
  casoId: string;
  onEvidenceAdded?: () => void;
}

const EvidenceUpload = ({ casoId, onEvidenceAdded }: EvidenceUploadProps) => {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [tipoEvidencia, setTipoEvidencia] = useState('');
  const [descricao, setDescricao] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    if (!tipoEvidencia || !descricao.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha o tipo de evidência e a descrição.",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);

    try {
      // Upload do arquivo para o Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
      const filePath = `evidencias/${casoId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('evidencias')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Obter URL pública do arquivo
      const { data: { publicUrl } } = supabase.storage
        .from('evidencias')
        .getPublicUrl(filePath);

      // Salvar informações da evidência no banco
      const { error: dbError } = await supabase
        .from('evidencias')
        .insert({
          caso_id: casoId,
          tipo_evidencia: tipoEvidencia,
          descricao: descricao.trim(),
          arquivo_url: publicUrl,
          arquivo_nome: file.name,
          coletado_por: user.id,
          cadeia_custodia: [{
            acao: 'upload',
            usuario: user.id,
            data: new Date().toISOString(),
            observacao: 'Upload inicial da evidência'
          }]
        });

      if (dbError) throw dbError;

      toast({
        title: "Evidência adicionada",
        description: "A evidência foi carregada com sucesso."
      });

      // Limpar formulário
      setTipoEvidencia('');
      setDescricao('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      onEvidenceAdded?.();

    } catch (error) {
      console.error('Error uploading evidence:', error);
      toast({
        title: "Erro no upload",
        description: "Não foi possível carregar a evidência.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '')) {
      return <Image className="w-4 h-4" />;
    }
    if (['mp4', 'avi', 'mov', 'wmv'].includes(ext || '')) {
      return <Video className="w-4 h-4" />;
    }
    return <FileText className="w-4 h-4" />;
  };

  return (
    <Card className="draco-card">
      <CardHeader>
        <CardTitle className="text-draco-gold-400 flex items-center">
          <Upload className="w-5 h-5 mr-2" />
          Upload de Evidência
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="tipo-evidencia" className="text-draco-gray-300">
            Tipo de Evidência *
          </Label>
          <Select value={tipoEvidencia} onValueChange={setTipoEvidencia}>
            <SelectTrigger className="bg-draco-gray-700 border-draco-gray-600 text-draco-gray-100">
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="documento">Documento</SelectItem>
              <SelectItem value="foto">Fotografia</SelectItem>
              <SelectItem value="video">Vídeo</SelectItem>
              <SelectItem value="audio">Áudio</SelectItem>
              <SelectItem value="digital">Evidência Digital</SelectItem>
              <SelectItem value="fisico">Objeto Físico (Foto)</SelectItem>
              <SelectItem value="outro">Outro</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="descricao" className="text-draco-gray-300">
            Descrição da Evidência *
          </Label>
          <Textarea
            id="descricao"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Descreva a evidência, sua origem e relevância para o caso..."
            className="bg-draco-gray-700 border-draco-gray-600 text-draco-gray-100"
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="arquivo" className="text-draco-gray-300">
            Arquivo
          </Label>
          <Input
            ref={fileInputRef}
            id="arquivo"
            type="file"
            onChange={handleFileUpload}
            disabled={uploading}
            className="bg-draco-gray-700 border-draco-gray-600 text-draco-gray-100 file:bg-draco-gold-500 file:text-draco-black file:border-0 file:rounded file:px-3 file:py-1"
            accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
          />
          <p className="text-xs text-draco-gray-400 mt-1">
            Formatos aceitos: Imagens, vídeos, áudios, PDF, DOC, TXT
          </p>
        </div>

        <Button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading || !tipoEvidencia || !descricao.trim()}
          className="draco-button w-full"
        >
          {uploading ? (
            <>Carregando...</>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              Selecionar e Carregar Arquivo
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default EvidenceUpload;
