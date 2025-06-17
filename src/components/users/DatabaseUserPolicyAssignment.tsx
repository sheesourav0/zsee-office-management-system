import React, { useState, useEffect } from 'react';
import { Box, VStack, Heading, Text, SimpleGrid, Checkbox } from '@chakra-ui/react';
import { Button } from '@/components/chakra/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/chakra/Card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@chakra-ui/react';
import { Users, Shield, Check } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface User {
  id: string;
  name: string;
  email: string;
}

interface Policy {
  id: string;
  name: string;
  description: string;
}

const DatabaseUserPolicyAssignment = () => {
  const [users, setUsers] = useState<User[]>([
    { id: '1', name: 'John Doe', email: 'john.doe@example.com' },
    { id: '2', name: 'Jane Smith', email: 'jane.smith@example.com' },
    { id: '3', name: 'Alice Johnson', email: 'alice.johnson@example.com' },
  ]);
  const [policies, setPolicies] = useState<Policy[]>([
    { id: '101', name: 'Read Only', description: 'Allows read-only access to the database' },
    { id: '102', name: 'Write Access', description: 'Allows write access to the database' },
    { id: '103', name: 'Admin Access', description: 'Allows full admin access to the database' },
  ]);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [assignedPolicies, setAssignedPolicies] = useState<string[]>([]);

  useEffect(() => {
    // Simulate loading assigned policies for the selected user from a database
    if (selectedUser) {
      // In a real application, you would fetch this data from a database
      const simulatedAssignedPolicies = ['101', '102']; // Example policies for user ID 1
      setAssignedPolicies(simulatedAssignedPolicies);
    } else {
      setAssignedPolicies([]);
    }
  }, [selectedUser]);

  const handleUserChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedUser(event.target.value);
  };

  const handlePolicyChange = (policyId: string) => {
    if (assignedPolicies.includes(policyId)) {
      setAssignedPolicies(assignedPolicies.filter((id) => id !== policyId));
    } else {
      setAssignedPolicies([...assignedPolicies, policyId]);
    }
  };

  const handleSave = () => {
    if (!selectedUser) {
      toast.error('Please select a user.');
      return;
    }

    // In a real application, you would save the assignedPolicies to a database
    toast.success(`Policies assigned to user ${selectedUser} successfully!`);
  };

  return (
    <Box p={4}>
      <Card>
        <CardHeader>
          <CardTitle>Database User Policy Assignment</CardTitle>
          <CardDescription>Assign policies to users for database access control</CardDescription>
        </CardHeader>
        <CardContent>
          <VStack spacing={6} align="stretch">
            <Box>
              <Heading size="md">
                <Users style={{ marginRight: '8px', width: '20px', height: '20px', display: 'inline-block' }} />
                Select User
              </Heading>
              <Select onChange={handleUserChange} value={selectedUser}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a user" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Box>

            <Box>
              <Heading size="md">
                <Shield style={{ marginRight: '8px', width: '20px', height: '20px', display: 'inline-block' }} />
                Assign Policies
              </Heading>
              <SimpleGrid columns={{ sm: 1, md: 2 }} spacing={4}>
                {policies.map((policy) => (
                  <Box key={policy.id} display="flex" alignItems="center">
                    <Checkbox
                      id={`policy-${policy.id}`}
                      isChecked={assignedPolicies.includes(policy.id)}
                      onChange={() => handlePolicyChange(policy.id)}
                    >
                      <Check style={{ marginRight: '8px', width: '16px', height: '16px' }} />
                      {policy.name}
                    </Checkbox>
                    <Text fontSize="sm" color="gray.600" ml={2}>
                      {policy.description}
                    </Text>
                  </Box>
                ))}
              </SimpleGrid>
            </Box>

            <Button colorScheme="blue" onClick={handleSave} disabled={!selectedUser}>
              Save Assignments
            </Button>
          </VStack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default DatabaseUserPolicyAssignment;
