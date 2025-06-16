
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

// Extract table names from the Database type
type TableName = keyof Database['public']['Tables'];
type TableRow<T extends TableName> = Database['public']['Tables'][T]['Row'];
type TableInsert<T extends TableName> = Database['public']['Tables'][T]['Insert'];
type TableUpdate<T extends TableName> = Database['public']['Tables'][T]['Update'];

// Generic hook for Supabase SELECT queries with proper typing
export const useSupabaseQuery = <T extends TableName>(
  queryKey: string[],
  tableName: T,
  selectQuery?: string,
  filters?: Record<string, any>
) => {
  return useQuery({
    queryKey,
    queryFn: async (): Promise<TableRow<T>[]> => {
      let query = supabase.from(tableName).select(selectQuery || '*');
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            query = query.eq(key, value);
          }
        });
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return (data || []) as TableRow<T>[];
    },
  });
};

// Hook for single record queries with proper typing
export const useSupabaseQuerySingle = <T extends TableName>(
  queryKey: string[],
  tableName: T,
  selectQuery?: string,
  filters?: Record<string, any>
) => {
  return useQuery({
    queryKey,
    queryFn: async (): Promise<TableRow<T> | null> => {
      let query = supabase.from(tableName).select(selectQuery || '*');
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            query = query.eq(key, value);
          }
        });
      }
      
      const { data, error } = await query.single();
      if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "not found"
      return (data || null) as TableRow<T> | null;
    },
  });
};

// Hook for Supabase INSERT mutations with proper typing
export const useSupabaseInsert = <T extends TableName>(
  tableName: T, 
  onSuccessCallback?: () => void
) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: TableInsert<T>): Promise<TableRow<T>> => {
      const { data: result, error } = await supabase
        .from(tableName)
        .insert(data)
        .select()
        .single();
      
      if (error) throw error;
      return result as TableRow<T>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [tableName] });
      onSuccessCallback?.();
    },
  });
};

// Hook for Supabase UPDATE mutations with proper typing
export const useSupabaseUpdate = <T extends TableName>(
  tableName: T, 
  onSuccessCallback?: () => void
) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: TableUpdate<T> }): Promise<TableRow<T>> => {
      const { data: result, error } = await supabase
        .from(tableName)
        .update(data)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return result as TableRow<T>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [tableName] });
      onSuccessCallback?.();
    },
  });
};

// Hook for Supabase DELETE mutations
export const useSupabaseDelete = <T extends TableName>(
  tableName: T, 
  onSuccessCallback?: () => void
) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [tableName] });
      onSuccessCallback?.();
    },
  });
};
