import type { Coordinate, StoolLog } from '@/features/walks/types/walk';
import type { Database as DatabaseGenerated } from '@/lib/database.generated';

export type { Json } from '@/lib/database.generated';

type WalksGenerated = DatabaseGenerated['public']['Tables']['walks'];

type Walks = {
  Row: Omit<WalksGenerated['Row'], 'route' | 'stools'> & {
    route: Coordinate[];
    stools: StoolLog[];
  };
  Insert: Omit<WalksGenerated['Insert'], 'route' | 'stools'> & {
    route?: Coordinate[];
    stools?: StoolLog[];
  };
  Update: Omit<WalksGenerated['Update'], 'route' | 'stools'> & {
    route?: Coordinate[];
    stools?: StoolLog[];
  };
  Relationships: WalksGenerated['Relationships'];
};

export type Database = Omit<DatabaseGenerated, 'public'> & {
  public: Omit<DatabaseGenerated['public'], 'Tables'> & {
    Tables: Omit<DatabaseGenerated['public']['Tables'], 'walks'> & {
      walks: Walks;
    };
  };
};

type PublicTables = Database['public']['Tables'];

export type Tables<T extends keyof PublicTables> = PublicTables[T]['Row'];
export type TablesInsert<T extends keyof PublicTables> =
  PublicTables[T]['Insert'];
export type TablesUpdate<T extends keyof PublicTables> =
  PublicTables[T]['Update'];
