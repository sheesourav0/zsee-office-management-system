
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Generic hook for Supabase SELECT queries
export const useSupabaseQuery = <T>(
  queryKey: string[],
  tableName: string,
  selectQuery?: string,
  filters?: Record<string, any>
) => {
  return useQuery({
    queryKey,
    queryFn: async (): Promise<T[]> => {
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
      return data || [];
    },
  });
};

// Hook for single record queries
export const useSupabaseQuerySingle = <T>(
  queryKey: string[],
  tableName: string,
  selectQuery?: string,
  filters?: Record<string, any>
) => {
  return useQuery({
    queryKey,
    queryFn: async (): Promise<T | null> => {
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
      return data || null;
    },
  });
};

// Hook for Supabase INSERT mutations
export const useSupabaseInsert = <T>(tableName: string, onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: Partial<T>): Promise<T> => {
      const { data: result, error } = await supabase
        .from(tableName)
        .insert(data)
        .select()
        .single();
      
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [tableName] });
      onSuccessCallback?.();
    },
  });
};

// Hook for Supabase UPDATE mutations
export const useSupabaseUpdate = <T>(tableName: string, onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<T> }): Promise<T> => {
      const { data: result, error } = await supabase
        .from(tableName)
        .update(data)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [tableName] });
      onSuccessCallback?.();
    },
  });
};

// Hook for Supabase DELETE mutations
export const useSupabaseDelete = (tableName: string, onSuccessCallback?: () => void) => {
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
