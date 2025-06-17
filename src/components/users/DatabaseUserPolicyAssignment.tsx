
import React, { useState } from 'react';
import { Box, VStack, HStack, Text, Flex } from '@chakra-ui/react';
import { useDisclosure } from '@chakra-ui/react';
import { Button } from '@/components/chakra/Button';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton } from '@/components/chakra/Modal';
import { Select } from '@/components/chakra/Select';
import { Checkbox } from '@/components/chakra/Checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/chakra/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/chakra/Table';
import { Settings, Shield, Plus } from 'lucide-react';
import { toast } from 'sonner';

interface Policy {
  id: string;
  name: string;
  description: string;
  permissions: string[];
}

interface UserPolicy {
  userId: string;
  userName: string;
  policies: string[];
}

const DatabaseUserPolicyAssignment = () => {
  const { open, onOpen, onClose } = useDisclosure();
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedPolicy, setSelectedPolicy] = useState('');
  const [userPolicies, setUserPolicies] = useState<UserPolicy[]>([
    {
      userId: '1',
      userName: 'John Doe',
      policies: ['read-only', 'basic-write']
    },
    {
      userId: '2',
      userName: 'Jane Smith',
      policies: ['admin', 'read-only']
    }
  ]);

  const policies: Policy[] = [
    {
      id: 'read-only',
      name: 'Read Only',
      description: 'Can view all data but cannot make changes',
      permissions: ['SELECT']
    },
    {
      id: 'basic-write',
      name: 'Basic Write',
      description: 'Can read and write basic data',
      permissions: ['SELECT', 'INSERT', 'UPDATE']
    },
    {
      id: 'admin',
      name: 'Administrator',
      description: 'Full access to all database operations',
      permissions: ['SELECT', 'INSERT', 'UPDATE', 'DELETE', 'CREATE', 'DROP']
    }
  ];

  const users = [
    { id: '1', name: 'John Doe' },
    { id: '2', name: 'Jane Smith' },
    { id: '3', name: 'Mike Johnson' }
  ];

  const handleAssignPolicy = async () => {
    if (!selectedUser || !selectedPolicy) {
      toast.error('Please select both user and policy');
      return;
    }

    // Update user policies
    setUserPolicies(prevPolicies => {
      const existingUserIndex = prevPolicies.findIndex(up => up.userId === selectedUser);
      const userName = users.find(u => u.id === selectedUser)?.name || '';
      
      if (existingUserIndex >= 0) {
        const updatedPolicies = [...prevPolicies];
        if (!updatedPolicies[existingUserIndex].policies.includes(selectedPolicy)) {
          updatedPolicies[existingUserIndex].policies.push(selectedPolicy);
        }
        return updatedPolicies;
      } else {
        return [...prevPolicies, {
          userId: selectedUser,
          userName,
          policies: [selectedPolicy]
        }];
      }
    });

    toast.success('Policy assigned successfully');
    onClose();
    setSelectedUser('');
    setSelectedPolicy('');
  };

  const handleRemovePolicy = (userId: string, policyId: string) => {
    setUserPolicies(prevPolicies => {
      return prevPolicies.map(up => {
        if (up.userId === userId) {
          return {
            ...up,
            policies: up.policies.filter(p => p !== policyId)
          };
        }
        return up;
      }).filter(up => up.policies.length > 0);
    });
    toast.success('Policy removed successfully');
  };

  return (
    <Box>
      <Card>
        <CardHeader>
          <Flex justify="space-between" align="center">
            <Box>
              <CardTitle>
                <Shield style={{ display: 'inline', marginRight: '8px', width: '20px', height: '20px' }} />
                Database Policy Assignment
              </CardTitle>
              <CardDescription>Assign and manage database access policies for users</CardDescription>
            </Box>
            <Button onClick={onOpen}>
              <Plus style={{ marginRight: '8px', width: '16px', height: '16px' }} />
              Assign Policy
            </Button>
          </Flex>
        </CardHeader>
        <CardContent>
          <VStack gap={6} align="stretch">
            <Box>
              <Text fontSize="lg" fontWeight="semibold" mb={4}>Current Policy Assignments</Text>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Assigned Policies</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userPolicies.map((userPolicy) => (
                    <TableRow key={userPolicy.userId}>
                      <TableCell fontWeight="medium">{userPolicy.userName}</TableCell>
                      <TableCell>
                        <HStack gap={2} flexWrap="wrap">
                          {userPolicy.policies.map((policyId) => {
                            const policy = policies.find(p => p.id === policyId);
                            return (
                              <Box
                                key={policyId}
                                px={3}
                                py={1}
                                bg="blue.100"
                                color="blue.800"
                                borderRadius="full"
                                fontSize="sm"
                                fontWeight="medium"
                              >
                                {policy?.name}
                              </Box>
                            );
                          })}
                        </HStack>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                        >
                          <Settings style={{ width: '14px', height: '14px' }} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>

            <Box>
              <Text fontSize="lg" fontWeight="semibold" mb={4}>Available Policies</Text>
              <VStack gap={4} align="stretch">
                {policies.map((policy) => (
                  <Card key={policy.id} variant="outline">
                    <CardHeader>
                      <CardTitle fontSize="md">{policy.name}</CardTitle>
                      <CardDescription>{policy.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Text fontSize="sm" fontWeight="medium" mb={2}>Permissions:</Text>
                      <HStack gap={2} flexWrap="wrap">
                        {policy.permissions.map((permission) => (
                          <Box
                            key={permission}
                            px={2}
                            py={1}
                            bg="gray.100"
                            color="gray.800"
                            borderRadius="md"
                            fontSize="xs"
                            fontWeight="medium"
                          >
                            {permission}
                          </Box>
                        ))}
                      </HStack>
                    </CardContent>
                  </Card>
                ))}
              </VStack>
            </Box>
          </VStack>
        </CardContent>
      </Card>

      <Modal open={open} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Assign Policy to User</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack gap={4} align="stretch">
              <Box>
                <Text fontSize="sm" fontWeight="medium" mb={2}>Select User</Text>
                <Select
                  placeholder="Choose a user"
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                >
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </Select>
              </Box>

              <Box>
                <Text fontSize="sm" fontWeight="medium" mb={2}>Select Policy</Text>
                <Select
                  placeholder="Choose a policy"
                  value={selectedPolicy}
                  onChange={(e) => setSelectedPolicy(e.target.value)}
                >
                  {policies.map((policy) => (
                    <option key={policy.id} value={policy.id}>
                      {policy.name}
                    </option>
                  ))}
                </Select>
              </Box>

              {selectedPolicy && (
                <Box p={4} bg="gray.50" borderRadius="md">
                  <Text fontSize="sm" fontWeight="medium" mb={2}>Policy Details:</Text>
                  {(() => {
                    const policy = policies.find(p => p.id === selectedPolicy);
                    return policy ? (
                      <VStack gap={2} align="start">
                        <Text fontSize="sm">{policy.description}</Text>
                        <Box>
                          <Text fontSize="xs" fontWeight="medium" mb={1}>Permissions:</Text>
                          <HStack gap={1} flexWrap="wrap">
                            {policy.permissions.map((permission) => (
                              <Checkbox key={permission} checked readOnly>
                                {permission}
                              </Checkbox>
                            ))}
                          </HStack>
                        </Box>
                      </VStack>
                    ) : null;
                  })()}
                </Box>
              )}
            </VStack>
          </ModalBody>
          <ModalFooter>
            <HStack gap={2}>
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleAssignPolicy} loading={false}>
                Assign Policy
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default DatabaseUserPolicyAssignment;
