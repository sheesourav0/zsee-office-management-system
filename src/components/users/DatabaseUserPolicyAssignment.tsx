
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/chakra/Button';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/chakra/Card';
import { VStack, HStack, SimpleGrid, NativeSelectRoot, NativeSelectField, Checkbox } from '@chakra-ui/react';
import { toast } from '@/hooks/use-toast';

interface User {
  id: string;
  email: string;
  raw_user_meta_data?: {
    full_name?: string;
  };
}

interface Policy {
  id: string;
  name: string;
  description: string;
}

interface DatabaseUserPolicyAssignmentProps {
  users: User[];
  policies: Policy[];
  userPolicies: { [userId: string]: string[] };
  onAssignPolicy: (userId: string, policyId: string) => void;
  onUnassignPolicy: (userId: string, policyId: string) => void;
}

const DatabaseUserPolicyAssignment = ({
  users,
  policies,
  userPolicies,
  onAssignPolicy,
  onUnassignPolicy
}: DatabaseUserPolicyAssignmentProps) => {
  const [selectedUser, setSelectedUser] = useState<string>('');

  const handlePolicyToggle = (policyId: string, isChecked: boolean) => {
    if (!selectedUser) return;

    if (isChecked) {
      onAssignPolicy(selectedUser, policyId);
      toast.success('Policy assigned successfully');
    } else {
      onUnassignPolicy(selectedUser, policyId);
      toast.success('Policy unassigned successfully');
    }
  };

  const selectedUserPolicies = selectedUser ? userPolicies[selectedUser] || [] : [];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Database User Policy Assignment</CardTitle>
        </CardHeader>
        <CardContent>
          <VStack gap={6} align="stretch">
            <div>
              <label className="block text-sm font-medium mb-2">Select User</label>
              <NativeSelectRoot>
                <NativeSelectField
                  placeholder="Choose a user..."
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                >
                  <option value="">Select a user...</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.raw_user_meta_data?.full_name || user.email}
                    </option>
                  ))}
                </NativeSelectField>
              </NativeSelectRoot>
            </div>

            {selectedUser && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Available Policies</h3>
                <SimpleGrid columns={{ sm: 1, md: 2 }} gap={4}>
                  {policies.map((policy) => (
                    <Checkbox.Root
                      key={policy.id}
                      checked={selectedUserPolicies.includes(policy.id)}
                      onCheckedChange={(checked) => handlePolicyToggle(policy.id, checked.checked as boolean)}
                    >
                      <Checkbox.Indicator />
                      <div className="ml-2">
                        <div className="font-medium">{policy.name}</div>
                        <div className="text-sm text-gray-600">{policy.description}</div>
                      </div>
                    </Checkbox.Root>
                  ))}
                </SimpleGrid>
              </div>
            )}
          </VStack>
        </CardContent>
      </Card>
    </div>
  );
};

export default DatabaseUserPolicyAssignment;
