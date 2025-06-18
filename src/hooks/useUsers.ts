
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  department?: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const createUser = async (user: Omit<User, 'id' | 'createdAt'>) => {
    setLoading(true);
    try {
      const newUser = { 
        ...user, 
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };
      setUsers(prev => [...prev, newUser]);
      toast.success('User created successfully');
      return newUser;
    } catch (error) {
      toast.error('Failed to create user');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (id: string, updates: Partial<User>) => {
    setLoading(true);
    try {
      setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u));
      toast.success('User updated successfully');
    } catch (error) {
      toast.error('Failed to update user');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id: string) => {
    setLoading(true);
    try {
      setUsers(prev => prev.filter(u => u.id !== id));
      toast.success('User deleted successfully');
    } catch (error) {
      toast.error('Failed to delete user');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    users,
    loading,
    createUser,
    updateUser,
    deleteUser
  };
};
