export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      casos: {
        Row: {
          agente_responsavel: string
          created_at: string | null
          data_abertura: string | null
          data_fechamento: string | null
          delegado_supervisor: string | null
          descricao: string | null
          id: string
          localizacao: string | null
          numero_inquerito: string
          prioridade: Database["public"]["Enums"]["prioridade_type"] | null
          status: Database["public"]["Enums"]["status_caso"] | null
          suspeitos: Json | null
          titulo: string
          updated_at: string | null
        }
        Insert: {
          agente_responsavel: string
          created_at?: string | null
          data_abertura?: string | null
          data_fechamento?: string | null
          delegado_supervisor?: string | null
          descricao?: string | null
          id?: string
          localizacao?: string | null
          numero_inquerito: string
          prioridade?: Database["public"]["Enums"]["prioridade_type"] | null
          status?: Database["public"]["Enums"]["status_caso"] | null
          suspeitos?: Json | null
          titulo: string
          updated_at?: string | null
        }
        Update: {
          agente_responsavel?: string
          created_at?: string | null
          data_abertura?: string | null
          data_fechamento?: string | null
          delegado_supervisor?: string | null
          descricao?: string | null
          id?: string
          localizacao?: string | null
          numero_inquerito?: string
          prioridade?: Database["public"]["Enums"]["prioridade_type"] | null
          status?: Database["public"]["Enums"]["status_caso"] | null
          suspeitos?: Json | null
          titulo?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "casos_agente_responsavel_fkey"
            columns: ["agente_responsavel"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "casos_delegado_supervisor_fkey"
            columns: ["delegado_supervisor"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      documentos: {
        Row: {
          arquivo_url: string | null
          assinado_por: string[] | null
          caso_id: string
          conteudo: string | null
          created_at: string | null
          criado_por: string
          id: string
          tipo_documento: string
          titulo: string
        }
        Insert: {
          arquivo_url?: string | null
          assinado_por?: string[] | null
          caso_id: string
          conteudo?: string | null
          created_at?: string | null
          criado_por: string
          id?: string
          tipo_documento: string
          titulo: string
        }
        Update: {
          arquivo_url?: string | null
          assinado_por?: string[] | null
          caso_id?: string
          conteudo?: string | null
          created_at?: string | null
          criado_por?: string
          id?: string
          tipo_documento?: string
          titulo?: string
        }
        Relationships: [
          {
            foreignKeyName: "documentos_caso_id_fkey"
            columns: ["caso_id"]
            isOneToOne: false
            referencedRelation: "casos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documentos_criado_por_fkey"
            columns: ["criado_por"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      evidencias: {
        Row: {
          arquivo_nome: string | null
          arquivo_url: string | null
          cadeia_custodia: Json | null
          caso_id: string
          coletado_por: string
          created_at: string | null
          data_coleta: string | null
          descricao: string
          id: string
          tipo_evidencia: string
        }
        Insert: {
          arquivo_nome?: string | null
          arquivo_url?: string | null
          cadeia_custodia?: Json | null
          caso_id: string
          coletado_por: string
          created_at?: string | null
          data_coleta?: string | null
          descricao: string
          id?: string
          tipo_evidencia: string
        }
        Update: {
          arquivo_nome?: string | null
          arquivo_url?: string | null
          cadeia_custodia?: Json | null
          caso_id?: string
          coletado_por?: string
          created_at?: string | null
          data_coleta?: string | null
          descricao?: string
          id?: string
          tipo_evidencia?: string
        }
        Relationships: [
          {
            foreignKeyName: "evidencias_caso_id_fkey"
            columns: ["caso_id"]
            isOneToOne: false
            referencedRelation: "casos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "evidencias_coletado_por_fkey"
            columns: ["coletado_por"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      mensagens: {
        Row: {
          caso_id: string | null
          conteudo: string
          created_at: string | null
          destinatario_id: string | null
          id: string
          is_grupo: boolean | null
          remetente_id: string
          tipo_mensagem: string | null
        }
        Insert: {
          caso_id?: string | null
          conteudo: string
          created_at?: string | null
          destinatario_id?: string | null
          id?: string
          is_grupo?: boolean | null
          remetente_id: string
          tipo_mensagem?: string | null
        }
        Update: {
          caso_id?: string | null
          conteudo?: string
          created_at?: string | null
          destinatario_id?: string | null
          id?: string
          is_grupo?: boolean | null
          remetente_id?: string
          tipo_mensagem?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mensagens_caso_id_fkey"
            columns: ["caso_id"]
            isOneToOne: false
            referencedRelation: "casos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mensagens_destinatario_id_fkey"
            columns: ["destinatario_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mensagens_remetente_id_fkey"
            columns: ["remetente_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      operacoes: {
        Row: {
          agentes_envolvidos: string[] | null
          casos_relacionados: string[] | null
          coordenador: string
          created_at: string | null
          data_fim: string | null
          data_inicio: string | null
          descricao: string | null
          id: string
          nome_operacao: string
          status: string | null
        }
        Insert: {
          agentes_envolvidos?: string[] | null
          casos_relacionados?: string[] | null
          coordenador: string
          created_at?: string | null
          data_fim?: string | null
          data_inicio?: string | null
          descricao?: string | null
          id?: string
          nome_operacao: string
          status?: string | null
        }
        Update: {
          agentes_envolvidos?: string[] | null
          casos_relacionados?: string[] | null
          coordenador?: string
          created_at?: string | null
          data_fim?: string | null
          data_inicio?: string | null
          descricao?: string | null
          id?: string
          nome_operacao?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "operacoes_coordenador_fkey"
            columns: ["coordenador"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          cargo: Database["public"]["Enums"]["cargo_type"]
          created_at: string | null
          data_ingresso: string | null
          email: string | null
          id: string
          nome_completo: string
          numero_placa: string
          status_ativo: boolean | null
          telefone: string | null
          unidade: string | null
          updated_at: string | null
        }
        Insert: {
          cargo?: Database["public"]["Enums"]["cargo_type"]
          created_at?: string | null
          data_ingresso?: string | null
          email?: string | null
          id: string
          nome_completo: string
          numero_placa: string
          status_ativo?: boolean | null
          telefone?: string | null
          unidade?: string | null
          updated_at?: string | null
        }
        Update: {
          cargo?: Database["public"]["Enums"]["cargo_type"]
          created_at?: string | null
          data_ingresso?: string | null
          email?: string | null
          id?: string
          nome_completo?: string
          numero_placa?: string
          status_ativo?: boolean | null
          telefone?: string | null
          unidade?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      cargo_type: "agente" | "delegado"
      prioridade_type: "baixa" | "media" | "alta" | "urgente"
      status_caso: "ativo" | "investigacao" | "suspenso" | "fechado"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      cargo_type: ["agente", "delegado"],
      prioridade_type: ["baixa", "media", "alta", "urgente"],
      status_caso: ["ativo", "investigacao", "suspenso", "fechado"],
    },
  },
} as const
