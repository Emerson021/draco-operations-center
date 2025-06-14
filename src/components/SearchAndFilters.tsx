
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Filter, X } from 'lucide-react';

interface SearchFilters {
  search: string;
  status: string;
  prioridade: string;
  agente: string;
}

interface SearchAndFiltersProps {
  onFiltersChange: (filters: SearchFilters) => void;
  agentes?: Array<{ id: string; nome_completo: string; numero_placa: string }>;
}

const SearchAndFilters = ({ onFiltersChange, agentes = [] }: SearchAndFiltersProps) => {
  const [filters, setFilters] = useState<SearchFilters>({
    search: '',
    status: '',
    prioridade: '',
    agente: ''
  });

  const updateFilters = (newFilters: Partial<SearchFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFiltersChange(updatedFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      search: '',
      status: '',
      prioridade: '',
      agente: ''
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const hasActiveFilters = filters.status || filters.prioridade || filters.agente;

  return (
    <Card className="draco-card mb-6">
      <CardContent className="p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-draco-gray-400" />
            <Input
              placeholder="Buscar por título, número do inquérito..."
              value={filters.search}
              onChange={(e) => updateFilters({ search: e.target.value })}
              className="pl-10 bg-draco-gray-700 border-draco-gray-600 text-draco-gray-100"
            />
          </div>

          {/* Status Filter */}
          <Select 
            value={filters.status} 
            onValueChange={(value) => updateFilters({ status: value })}
          >
            <SelectTrigger className="w-full lg:w-48 bg-draco-gray-700 border-draco-gray-600 text-draco-gray-100">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos os Status</SelectItem>
              <SelectItem value="ativo">Ativo</SelectItem>
              <SelectItem value="investigacao">Investigação</SelectItem>
              <SelectItem value="suspenso">Suspenso</SelectItem>
              <SelectItem value="fechado">Fechado</SelectItem>
            </SelectContent>
          </Select>

          {/* Priority Filter */}
          <Select 
            value={filters.prioridade} 
            onValueChange={(value) => updateFilters({ prioridade: value })}
          >
            <SelectTrigger className="w-full lg:w-48 bg-draco-gray-700 border-draco-gray-600 text-draco-gray-100">
              <SelectValue placeholder="Prioridade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todas as Prioridades</SelectItem>
              <SelectItem value="baixa">Baixa</SelectItem>
              <SelectItem value="media">Média</SelectItem>
              <SelectItem value="alta">Alta</SelectItem>
              <SelectItem value="urgente">Urgente</SelectItem>
            </SelectContent>
          </Select>

          {/* Agent Filter */}
          <Select 
            value={filters.agente} 
            onValueChange={(value) => updateFilters({ agente: value })}
          >
            <SelectTrigger className="w-full lg:w-48 bg-draco-gray-700 border-draco-gray-600 text-draco-gray-100">
              <SelectValue placeholder="Agente" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos os Agentes</SelectItem>
              {agentes.map((agente) => (
                <SelectItem key={agente.id} value={agente.id}>
                  {agente.nome_completo} ({agente.numero_placa})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <Button
              variant="outline"
              onClick={clearFilters}
              className="border-draco-gray-600 text-draco-gray-300 hover:bg-draco-gray-700"
            >
              <X className="w-4 h-4 mr-2" />
              Limpar
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SearchAndFilters;
