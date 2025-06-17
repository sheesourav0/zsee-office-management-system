
import { useState, useEffect } from "react";
import { 
  Box, 
  Flex, 
  Input, 
  Button as ChakraButton, 
  Text,
  VStack,
  HStack
} from "@chakra-ui/react";
import { Button } from "@/components/chakra/Button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/chakra/Table";
import { Badge } from "@/components/chakra/Badge";
import { Search, Edit, Trash2, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { profileService, departmentService } from "@/lib/supabase-services";

interface User {
  id: string;
  name: string;
  email: string;
  department_id: string | null;
  is_active: boolean;
  join_date: string | null;
  departments?: {
    name: string;
    code: string;
  } | null;
}

const DatabaseUsersList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [usersData, deptData] = await Promise.all([
        profileService.getAll(),
        departmentService.getAll()
      ]);
      
      setUsers(usersData || []);
      setDepartments(deptData || []);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    
    try {
      await profileService.delete(userId);
      toast.success('User deleted successfully');
      loadData();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    }
  };

  const handleToggleStatus = async (userId: string, currentStatus: boolean) => {
    try {
      await profileService.update(userId, { is_active: !currentStatus });
      toast.success(`User ${currentStatus ? 'deactivated' : 'activated'} successfully`);
      loadData();
    } catch (error) {
      console.error('Error updating user status:', error);
      toast.error('Failed to update user status');
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.departments?.name && user.departments.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return <Flex align="center" justify="center" p={8}><Text>Loading users...</Text></Flex>;
  }

  return (
    <VStack spacing={4} align="stretch">
      <HStack spacing={4}>
        <Box position="relative" flex={1}>
          <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#A0AEC0', width: '16px', height: '16px' }} />
          <Input
            placeholder="Search users by name, email, or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            pl="40px"
          />
        </Box>
        <Button leftIcon={<UserPlus />} onClick={loadData}>
          Refresh
        </Button>
      </HStack>

      <Box border="1px" borderColor="gray.200" borderRadius="md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Join Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} textAlign="center" py={8}>
                  <Text>No users found. {searchTerm && "Try adjusting your search terms."}</Text>
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell fontWeight="medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {user.departments ? (
                      <Badge variant="outline">
                        {user.departments.code} - {user.departments.name}
                      </Badge>
                    ) : (
                      <Text color="gray.500">No Department</Text>
                    )}
                  </TableCell>
                  <TableCell>
                    {user.join_date ? new Date(user.join_date).toLocaleDateString() : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      colorScheme={user.is_active ? "green" : "gray"}
                      cursor="pointer"
                      onClick={() => handleToggleStatus(user.id, user.is_active)}
                    >
                      {user.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <HStack spacing={2}>
                      <ChakraButton variant="outline" size="sm">
                        <Edit size={16} />
                      </ChakraButton>
                      <ChakraButton 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        <Trash2 size={16} />
                      </ChakraButton>
                    </HStack>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Box>

      <Text fontSize="sm" color="gray.500">
        Total users: {filteredUsers.length}
      </Text>
    </VStack>
  );
};

export default DatabaseUsersList;
