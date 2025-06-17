import React, { useState } from 'react';
import { Box, Flex, Text, VStack, HStack } from '@chakra-ui/react';
import { Button } from '@/components/chakra/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/chakra/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/chakra/Table';
import { Edit, Trash2, UserPlus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const DatabaseUsersList = () => {
  const [users, setUsers] = useState([
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'Project Manager',
      status: 'Active',
      lastLogin: '2024-01-15'
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'Site Engineer',
      status: 'Active',
      lastLogin: '2024-01-14'
    },
    {
      id: '3',
      name: 'Mike Johnson',
      email: 'mike@example.com',
      role: 'Finance Manager',
      status: 'Inactive',
      lastLogin: '2024-01-10'
    }
  ]);

  const handleEditUser = (userId: string) => {
    toast.info(`Edit user functionality for user ${userId} will be implemented`);
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter(user => user.id !== userId));
    toast.success('User deleted successfully');
  };

  const handleAddUser = () => {
    toast.info('Add user functionality will be implemented');
  };

  return (
    <Box>
      <Card>
        <CardHeader>
          <Flex justify="space-between" align="center">
            <Box>
              <CardTitle>Database Users</CardTitle>
              <CardDescription>Manage database user accounts and permissions</CardDescription>
            </Box>
            <Button onClick={handleAddUser}>
              <UserPlus style={{ marginRight: '8px', width: '16px', height: '16px' }} />
              Add User
            </Button>
          </Flex>
        </CardHeader>
        <CardContent>
          <VStack gap={4} align="stretch">
            <VStack gap={2}>
              <Text fontSize="lg" fontWeight="semibold">Current Users</Text>
              <Text fontSize="sm" color="gray.600">
                Users with access to the database
              </Text>
            </VStack>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell fontWeight="medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>
                      <Box
                        as="span"
                        px={2}
                        py={1}
                        bg={user.status === 'Active' ? 'green.100' : 'red.100'}
                        color={user.status === 'Active' ? 'green.800' : 'red.800'}
                        borderRadius="full"
                        fontSize="xs"
                        fontWeight="medium"
                      >
                        {user.status}
                      </Box>
                    </TableCell>
                    <TableCell>{user.lastLogin}</TableCell>
                    <TableCell>
                      <HStack gap={2}>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditUser(user.id)}
                        >
                          <Edit style={{ width: '14px', height: '14px' }} />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          <Trash2 style={{ width: '14px', height: '14px' }} />
                        </Button>
                      </HStack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </VStack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default DatabaseUsersList;
