
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

type Profile = Database['public']['Tables']['profiles']['Row'];
type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

type Department = Database['public']['Tables']['departments']['Row'];
type Policy = Database['public']['Tables']['policies']['Row'];
type PolicyInsert = Database['public']['Tables']['policies']['Insert'];
type UserPolicyAssignment = Database['public']['Tables']['user_policy_assignments']['Row'];
type UserPolicyAssignmentInsert = Database['public']['Tables']['user_policy_assignments']['Insert'];

// User/Profile Services
export const profileService = {
  async getAll() {
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        *,
        departments(name, code)
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        *,
        departments(name, code)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async create(profile: ProfileInsert) {
    const { data, error } = await supabase
      .from('profiles')
      .insert(profile)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, updates: ProfileUpdate) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// Department Services
export const departmentService = {
  async getAll() {
    const { data, error } = await supabase
      .from('departments')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data;
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('departments')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async create(department: Omit<Department, 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('departments')
      .insert(department)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<Department>) {
    const { data, error } = await supabase
      .from('departments')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

// Policy Services
export const policyService = {
  async getAll() {
    const { data, error } = await supabase
      .from('policies')
      .select(`
        *,
        departments(name, code)
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async getByDepartment(departmentId: string) {
    const { data, error } = await supabase
      .from('policies')
      .select('*')
      .eq('department_id', departmentId);
    
    if (error) throw error;
    return data;
  },

  async getGlobal() {
    const { data, error } = await supabase
      .from('policies')
      .select('*')
      .is('department_id', null);
    
    if (error) throw error;
    return data;
  },

  async create(policy: PolicyInsert) {
    const { data, error } = await supabase
      .from('policies')
      .insert(policy)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<Policy>) {
    const { data, error } = await supabase
      .from('policies')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('policies')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// User Policy Assignment Services
export const userPolicyService = {
  async getUserPolicies(userId: string) {
    const { data, error } = await supabase
      .from('user_policy_assignments')
      .select(`
        *,
        policies(*),
        departments(name, code)
      `)
      .eq('user_id', userId);
    
    if (error) throw error;
    return data;
  },

  async assignPolicy(assignment: UserPolicyAssignmentInsert) {
    const { data, error } = await supabase
      .from('user_policy_assignments')
      .insert(assignment)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async removeAssignment(userId: string, policyId: string) {
    const { error } = await supabase
      .from('user_policy_assignments')
      .delete()
      .eq('user_id', userId)
      .eq('policy_id', policyId);
    
    if (error) throw error;
  },

  async getUserPermissions(userId: string, departmentId?: string) {
    let query = supabase
      .from('user_policy_assignments')
      .select(`
        policies(permissions, department_id)
      `)
      .eq('user_id', userId);

    if (departmentId) {
      query = query.or(`department_id.eq.${departmentId},department_id.is.null`);
    }

    const { data, error } = await query;
    
    if (error) throw error;
    
    const allPermissions = new Set<string>();
    data?.forEach(assignment => {
      if (assignment.policies) {
        assignment.policies.permissions.forEach(permission => {
          allPermissions.add(permission);
        });
      }
    });
    
    return Array.from(allPermissions);
  }
};

// Auth Services
export const authService = {
  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },

  async signUp(email: string, password: string, metadata?: any) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    });
    
    if (error) throw error;
    return data;
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw error;
    return data;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }
};
