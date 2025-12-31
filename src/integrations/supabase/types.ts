export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      book_answers: {
        Row: {
          ai_enhanced: boolean | null
          answer: string | null
          book_id: string
          created_at: string
          id: string
          question_id: string
          updated_at: string
        }
        Insert: {
          ai_enhanced?: boolean | null
          answer?: string | null
          book_id: string
          created_at?: string
          id?: string
          question_id: string
          updated_at?: string
        }
        Update: {
          ai_enhanced?: boolean | null
          answer?: string | null
          book_id?: string
          created_at?: string
          id?: string
          question_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "book_answers_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
        ]
      }
      book_collaborators: {
        Row: {
          accepted_at: string | null
          book_id: string
          email: string
          id: string
          invited_at: string
          role: Database["public"]["Enums"]["collaboration_role"]
          user_id: string | null
        }
        Insert: {
          accepted_at?: string | null
          book_id: string
          email: string
          id?: string
          invited_at?: string
          role?: Database["public"]["Enums"]["collaboration_role"]
          user_id?: string | null
        }
        Update: {
          accepted_at?: string | null
          book_id?: string
          email?: string
          id?: string
          invited_at?: string
          role?: Database["public"]["Enums"]["collaboration_role"]
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "book_collaborators_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
        ]
      }
      books: {
        Row: {
          book_type: Database["public"]["Enums"]["book_type"]
          cover_color: string | null
          created_at: string
          custom_chapters: Json | null
          dedication: string | null
          id: string
          status: Database["public"]["Enums"]["book_status"]
          subtitle: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          book_type?: Database["public"]["Enums"]["book_type"]
          cover_color?: string | null
          created_at?: string
          custom_chapters?: Json | null
          dedication?: string | null
          id?: string
          status?: Database["public"]["Enums"]["book_status"]
          subtitle?: string | null
          title?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          book_type?: Database["public"]["Enums"]["book_type"]
          cover_color?: string | null
          created_at?: string
          custom_chapters?: Json | null
          dedication?: string | null
          id?: string
          status?: Database["public"]["Enums"]["book_status"]
          subtitle?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      collaborator_contributions: {
        Row: {
          book_id: string
          collaborator_id: string
          contribution: string
          created_at: string
          id: string
          question_id: string | null
        }
        Insert: {
          book_id: string
          collaborator_id: string
          contribution: string
          created_at?: string
          id?: string
          question_id?: string | null
        }
        Update: {
          book_id?: string
          collaborator_id?: string
          contribution?: string
          created_at?: string
          id?: string
          question_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "collaborator_contributions_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collaborator_contributions_collaborator_id_fkey"
            columns: ["collaborator_id"]
            isOneToOne: false
            referencedRelation: "book_collaborators"
            referencedColumns: ["id"]
          },
        ]
      }
      digital_twin_comparisons: {
        Row: {
          adjustments: Json
          book_id: string | null
          compared_model: string
          created_at: string
          decision_posture_data: Json
          digital_twin_profile: string
          id: string
          knowledge_depth_data: Json
          match_summary: string | null
          overall_alignment: number
          refinement_count: number
          relational_style_data: Json
          updated_at: string
          user_id: string
          values_intent_data: Json
          voice_tone_data: Json
        }
        Insert: {
          adjustments?: Json
          book_id?: string | null
          compared_model: string
          created_at?: string
          decision_posture_data?: Json
          digital_twin_profile: string
          id?: string
          knowledge_depth_data?: Json
          match_summary?: string | null
          overall_alignment: number
          refinement_count?: number
          relational_style_data?: Json
          updated_at?: string
          user_id: string
          values_intent_data?: Json
          voice_tone_data?: Json
        }
        Update: {
          adjustments?: Json
          book_id?: string | null
          compared_model?: string
          created_at?: string
          decision_posture_data?: Json
          digital_twin_profile?: string
          id?: string
          knowledge_depth_data?: Json
          match_summary?: string | null
          overall_alignment?: number
          refinement_count?: number
          relational_style_data?: Json
          updated_at?: string
          user_id?: string
          values_intent_data?: Json
          voice_tone_data?: Json
        }
        Relationships: [
          {
            foreignKeyName: "digital_twin_comparisons_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          display_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      publishing_settings: {
        Row: {
          book_description: string | null
          book_id: string | null
          categories: string[] | null
          created_at: string
          currency: string | null
          distribution_service: string | null
          ebook_price: number | null
          export_epub: boolean | null
          export_pdf: boolean | null
          export_print_ready: boolean | null
          id: string
          isbn_ebook: string | null
          isbn_print: string | null
          keywords: string[] | null
          language: string | null
          marketplace_links: Json | null
          pod_service: string | null
          print_price: number | null
          published_at: string | null
          status: string
          unpublished_at: string | null
          updated_at: string
          use_free_isbn: boolean | null
          user_id: string
        }
        Insert: {
          book_description?: string | null
          book_id?: string | null
          categories?: string[] | null
          created_at?: string
          currency?: string | null
          distribution_service?: string | null
          ebook_price?: number | null
          export_epub?: boolean | null
          export_pdf?: boolean | null
          export_print_ready?: boolean | null
          id?: string
          isbn_ebook?: string | null
          isbn_print?: string | null
          keywords?: string[] | null
          language?: string | null
          marketplace_links?: Json | null
          pod_service?: string | null
          print_price?: number | null
          published_at?: string | null
          status?: string
          unpublished_at?: string | null
          updated_at?: string
          use_free_isbn?: boolean | null
          user_id: string
        }
        Update: {
          book_description?: string | null
          book_id?: string | null
          categories?: string[] | null
          created_at?: string
          currency?: string | null
          distribution_service?: string | null
          ebook_price?: number | null
          export_epub?: boolean | null
          export_pdf?: boolean | null
          export_print_ready?: boolean | null
          id?: string
          isbn_ebook?: string | null
          isbn_print?: string | null
          keywords?: string[] | null
          language?: string | null
          marketplace_links?: Json | null
          pod_service?: string | null
          print_price?: number | null
          published_at?: string | null
          status?: string
          unpublished_at?: string | null
          updated_at?: string
          use_free_isbn?: boolean | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "publishing_settings_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: true
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      book_status: "draft" | "in_progress" | "completed" | "published"
      book_type:
        | "autobiography"
        | "memoir"
        | "fiction"
        | "fairy_tale"
        | "love_story"
        | "professional"
        | "legacy"
      collaboration_role: "contributor" | "editor" | "viewer"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      book_status: ["draft", "in_progress", "completed", "published"],
      book_type: [
        "autobiography",
        "memoir",
        "fiction",
        "fairy_tale",
        "love_story",
        "professional",
        "legacy",
      ],
      collaboration_role: ["contributor", "editor", "viewer"],
    },
  },
} as const
