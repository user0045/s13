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
      demand: {
        Row: {
          content_type: Database["public"]["Enums"]["content_type_enum"]
          created_at: string | null
          date: string | null
          description: string | null
          id: string
          title: string
          updated_at: string | null
          user_ip: unknown | null
        }
        Insert: {
          content_type: Database["public"]["Enums"]["content_type_enum"]
          created_at?: string | null
          date?: string | null
          description?: string | null
          id?: string
          title: string
          updated_at?: string | null
          user_ip?: unknown | null
        }
        Update: {
          content_type?: Database["public"]["Enums"]["content_type_enum"]
          created_at?: string | null
          date?: string | null
          description?: string | null
          id?: string
          title?: string
          updated_at?: string | null
          user_ip?: unknown | null
        }
        Relationships: []
      }
      episode: {
        Row: {
          created_at: string | null
          description: string | null
          duration: number | null
          episode_id: string
          thumbnail_url: string | null
          title: string
          updated_at: string | null
          video_url: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          duration?: number | null
          episode_id?: string
          thumbnail_url?: string | null
          title: string
          updated_at?: string | null
          video_url?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          duration?: number | null
          episode_id?: string
          thumbnail_url?: string | null
          title?: string
          updated_at?: string | null
          video_url?: string | null
        }
        Relationships: []
      }
      movie: {
        Row: {
          cast_members: string[] | null
          content_id: string
          created_at: string | null
          description: string | null
          director: string[] | null
          duration: number | null
          feature_in: string[] | null
          rating: number | null
          rating_type: Database["public"]["Enums"]["rating_type_enum"] | null
          release_year: number | null
          thumbnail_url: string | null
          trailer_url: string | null
          updated_at: string | null
          video_url: string | null
          views: number | null
          writer: string[] | null
        }
        Insert: {
          cast_members?: string[] | null
          content_id?: string
          created_at?: string | null
          description?: string | null
          director?: string[] | null
          duration?: number | null
          feature_in?: string[] | null
          rating?: number | null
          rating_type?: Database["public"]["Enums"]["rating_type_enum"] | null
          release_year?: number | null
          thumbnail_url?: string | null
          trailer_url?: string | null
          updated_at?: string | null
          video_url?: string | null
          views?: number | null
          writer?: string[] | null
        }
        Update: {
          cast_members?: string[] | null
          content_id?: string
          created_at?: string | null
          description?: string | null
          director?: string[] | null
          duration?: number | null
          feature_in?: string[] | null
          rating?: number | null
          rating_type?: Database["public"]["Enums"]["rating_type_enum"] | null
          release_year?: number | null
          thumbnail_url?: string | null
          trailer_url?: string | null
          updated_at?: string | null
          video_url?: string | null
          views?: number | null
          writer?: string[] | null
        }
        Relationships: []
      }
      season: {
        Row: {
          cast_members: string[] | null
          created_at: string | null
          director: string[] | null
          episode_id_list: string[] | null
          feature_in: string[] | null
          rating: number | null
          rating_type: Database["public"]["Enums"]["rating_type_enum"] | null
          release_year: number | null
          season_description: string | null
          season_id: string
          thumbnail_url: string | null
          trailer_url: string | null
          updated_at: string | null
          writer: string[] | null
        }
        Insert: {
          cast_members?: string[] | null
          created_at?: string | null
          director?: string[] | null
          episode_id_list?: string[] | null
          feature_in?: string[] | null
          rating?: number | null
          rating_type?: Database["public"]["Enums"]["rating_type_enum"] | null
          release_year?: number | null
          season_description?: string | null
          season_id?: string
          thumbnail_url?: string | null
          trailer_url?: string | null
          updated_at?: string | null
          writer?: string[] | null
        }
        Update: {
          cast_members?: string[] | null
          created_at?: string | null
          director?: string[] | null
          episode_id_list?: string[] | null
          feature_in?: string[] | null
          rating?: number | null
          rating_type?: Database["public"]["Enums"]["rating_type_enum"] | null
          release_year?: number | null
          season_description?: string | null
          season_id?: string
          thumbnail_url?: string | null
          trailer_url?: string | null
          updated_at?: string | null
          writer?: string[] | null
        }
        Relationships: []
      }
      show: {
        Row: {
          cast_members: string[] | null
          content_type: Database["public"]["Enums"]["content_type_enum"] | null
          created_at: string | null
          description: string | null
          directors: string[] | null
          episode_id_list: string[] | null
          feature_in: string[] | null
          genres: string[] | null
          id: string
          rating: number | null
          rating_type: Database["public"]["Enums"]["rating_type_enum"] | null
          release_year: number | null
          thumbnail_url: string | null
          title: string
          trailer_url: string | null
          updated_at: string | null
          writers: string[] | null
        }
        Insert: {
          cast_members?: string[] | null
          content_type?: Database["public"]["Enums"]["content_type_enum"] | null
          created_at?: string | null
          description?: string | null
          directors?: string[] | null
          episode_id_list?: string[] | null
          feature_in?: string[] | null
          genres?: string[] | null
          id?: string
          rating?: number | null
          rating_type?: Database["public"]["Enums"]["rating_type_enum"] | null
          release_year?: number | null
          thumbnail_url?: string | null
          title: string
          trailer_url?: string | null
          updated_at?: string | null
          writers?: string[] | null
        }
        Update: {
          cast_members?: string[] | null
          content_type?: Database["public"]["Enums"]["content_type_enum"] | null
          created_at?: string | null
          description?: string | null
          directors?: string[] | null
          episode_id_list?: string[] | null
          feature_in?: string[] | null
          genres?: string[] | null
          id?: string
          rating?: number | null
          rating_type?: Database["public"]["Enums"]["rating_type_enum"] | null
          release_year?: number | null
          thumbnail_url?: string | null
          title?: string
          trailer_url?: string | null
          updated_at?: string | null
          writers?: string[] | null
        }
        Relationships: []
      }
      upcoming_content: {
        Row: {
          cast_members: string[] | null
          content_order: number | null
          content_type: Database["public"]["Enums"]["content_type_enum"]
          created_at: string | null
          description: string | null
          directors: string[] | null
          genre: string[] | null
          id: string
          rating_type: Database["public"]["Enums"]["rating_type_enum"] | null
          release_date: string
          thumbnail_url: string | null
          title: string
          trailer_url: string | null
          updated_at: string | null
          writers: string[] | null
        }
        Insert: {
          cast_members?: string[] | null
          content_order?: number | null
          content_type: Database["public"]["Enums"]["content_type_enum"]
          created_at?: string | null
          description?: string | null
          directors?: string[] | null
          genre?: string[] | null
          id?: string
          rating_type?: Database["public"]["Enums"]["rating_type_enum"] | null
          release_date: string
          thumbnail_url?: string | null
          title: string
          trailer_url?: string | null
          updated_at?: string | null
          writers?: string[] | null
        }
        Update: {
          cast_members?: string[] | null
          content_order?: number | null
          content_type?: Database["public"]["Enums"]["content_type_enum"]
          created_at?: string | null
          description?: string | null
          directors?: string[] | null
          genre?: string[] | null
          id?: string
          rating_type?: Database["public"]["Enums"]["rating_type_enum"] | null
          release_date?: string
          thumbnail_url?: string | null
          title?: string
          trailer_url?: string | null
          updated_at?: string | null
          writers?: string[] | null
        }
        Relationships: []
      }
      upload_content: {
        Row: {
          content_id: string
          content_type: Database["public"]["Enums"]["content_type_enum"]
          created_at: string | null
          genre: string[] | null
          id: string
          title: string
          updated_at: string | null
        }
        Insert: {
          content_id: string
          content_type: Database["public"]["Enums"]["content_type_enum"]
          created_at?: string | null
          genre?: string[] | null
          id?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          content_id?: string
          content_type?: Database["public"]["Enums"]["content_type_enum"]
          created_at?: string | null
          genre?: string[] | null
          id?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_upload_content_movie"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "movie"
            referencedColumns: ["content_id"]
          },
        ]
      }
      web_series: {
        Row: {
          content_id: string
          created_at: string | null
          season_id_list: string[] | null
          updated_at: string | null
        }
        Insert: {
          content_id?: string
          created_at?: string | null
          season_id_list?: string[] | null
          updated_at?: string | null
        }
        Update: {
          content_id?: string
          created_at?: string | null
          season_id_list?: string[] | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_content_by_type: {
        Args: {
          content_type_filter: Database["public"]["Enums"]["content_type_enum"]
        }
        Returns: {
          id: string
          title: string
          content_type: Database["public"]["Enums"]["content_type_enum"]
          thumbnail_url: string
          rating: number
          release_year: number
        }[]
      }
      increment_movie_views: {
        Args: { movie_content_id: string }
        Returns: undefined
      }
    }
    Enums: {
      content_type_enum: "Movie" | "Web Series" | "Show"
      rating_type_enum:
        | "G"
        | "PG"
        | "PG-13"
        | "R"
        | "NC-17"
        | "TV-Y"
        | "TV-Y7"
        | "TV-G"
        | "TV-PG"
        | "TV-14"
        | "TV-MA"
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
      content_type_enum: ["Movie", "Web Series", "Show"],
      rating_type_enum: [
        "G",
        "PG",
        "PG-13",
        "R",
        "NC-17",
        "TV-Y",
        "TV-Y7",
        "TV-G",
        "TV-PG",
        "TV-14",
        "TV-MA",
      ],
    },
  },
} as const
