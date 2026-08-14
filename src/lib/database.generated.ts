/**
 * Schema types for supabase-js.
 *
 * Derived from supabase/schema.sql. Refresh from a live project with:
 *   SUPABASE_PROJECT_ID=<ref> npm run db:types
 *
 * Do not edit JSON column overrides here — those live in database.types.ts.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      dogs: {
        Row: {
          breed: string | null;
          created_at: string;
          id: string;
          name: string;
          owner_id: string;
          photo_url: string | null;
        };
        Insert: {
          breed?: string | null;
          created_at?: string;
          id?: string;
          name: string;
          owner_id: string;
          photo_url?: string | null;
        };
        Update: {
          breed?: string | null;
          created_at?: string;
          id?: string;
          name?: string;
          owner_id?: string;
          photo_url?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'dogs_owner_id_fkey';
            columns: ['owner_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      walks: {
        Row: {
          created_at: string;
          distance_metres: number;
          dog_id: string;
          ended_at: string;
          id: string;
          notes: string | null;
          route: Json;
          started_at: string;
          stools: Json;
        };
        Insert: {
          created_at?: string;
          distance_metres?: number;
          dog_id: string;
          ended_at: string;
          id?: string;
          notes?: string | null;
          route?: Json;
          started_at: string;
          stools?: Json;
        };
        Update: {
          created_at?: string;
          distance_metres?: number;
          dog_id?: string;
          ended_at?: string;
          id?: string;
          notes?: string | null;
          route?: Json;
          started_at?: string;
          stools?: Json;
        };
        Relationships: [
          {
            foreignKeyName: 'walks_dog_id_fkey';
            columns: ['dog_id'];
            isOneToOne: false;
            referencedRelation: 'dogs';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
