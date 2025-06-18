
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';

export interface Policy {
  id: string;
  name: string;
  description: string;
  permissions: string[];
}

export const usePolicies = () => {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(false);

  const createPolicy = async (policy: Omit<Policy, 'id'>) => {
    setLoading(true);
    try {
      const newPolicy = { ...policy, id: Date.now().toString() };
      setPolicies(prev => [...prev, newPolicy]);
      toast.success('Policy created successfully');
      return newPolicy;
    } catch (error) {
      toast.error('Failed to create policy');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updatePolicy = async (id: string, updates: Partial<Policy>) => {
    setLoading(true);
    try {
      setPolicies(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
      toast.success('Policy updated successfully');
    } catch (error) {
      toast.error('Failed to update policy');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deletePolicy = async (id: string) => {
    setLoading(true);
    try {
      setPolicies(prev => prev.filter(p => p.id !== id));
      toast.success('Policy deleted successfully');
    } catch (error) {
      toast.error('Failed to delete policy');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    policies,
    loading,
    createPolicy,
    updatePolicy,
    deletePolicy
  };
};
