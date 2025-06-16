
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

// Extract table names from the Database type
type TableName = keyof Database['public']['Tables'];

// Generic hook for Supabase SELECT queries
export const useSupabaseQuery = <T extends TableName>(
  queryKey: string[],
  tableName: T,
  selectQuery?: string,
  filters?: Record<string, any>
) => {
  return useQuery({
    queryKey,
    queryFn: async () => {
      let query = supabase.from(tableName as any).select(selectQuery || '*');
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            query = query.eq(key, value);
          }
        });
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data as any[];
    },
  });
};

// Hook for single record queries
export const useSupabaseQuerySingle = <T extends TableName>(
  queryKey: string[],
  tableName: T,
  selectQuery?: string,
  filters?: Record<string, any>
) => {
  return useQuery({
    queryKey,
    queryFn: async () => {
      let query = supabase.from(tableName as any).select(selectQuery || '*');
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            query = query.eq(key, value);
          }
        });
      }
      
      const { data, error } = await query.maybeSingle();
      if (error) throw error;
      return data as any;
    },
  });
};

// Hook for Supabase INSERT mutations
export const useSupabaseInsert = <T extends TableName>(
  tableName: T, 
  onSuccessCallback?: () => void
) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: any) => {
      const { data: result, error } = await supabase
        .from(tableName as any)
        .insert(data)
        .select()
        .single();
      
      if (error) throw error;
      return result as any;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [tableName] });
      onSuccessCallback?.();
    },
  });
};

// Hook for Supabase UPDATE mutations
export const useSupabaseUpdate = <T extends TableName>(
  tableName: T, 
  onSuccessCallback?: () => void
) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const { data: result, error } = await supabase
        .from(tableName as any)
        .update(data)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return result as any;
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
        .from(tableName as any)
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
