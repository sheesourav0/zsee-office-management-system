
import { useState } from "react";
import { 
  Box, 
  Flex, 
  Heading, 
  Text, 
  Button as ChakraButton,
  Icon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Select,
  Checkbox,
  VStack,
  HStack,
  useDisclosure
} from "@chakra-ui/react";
import { Button } from "@/components/chakra/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/chakra/Table";
import { Badge } from "@/components/chakra/Badge";
import { Plus, Trash2, Shield, User, Building2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { departmentService } from "@/lib/supabase-services";
import { useUsers } from "@/hooks/useUsers";
import { usePolicies, useAssignPolicy, useRemovePolicyAssignment, useUserPolicies } from "@/hooks/usePolicies";

const userTypes = {
  'department-staff': {
    name: 'Department Staff',
    description: 'Regular employees working within a specific department',
    departmentSpecific: true,
    level: 'basic'
  },
  'department-manager': {
    name: 'Department Manager',
    description: 'Managers overseeing a specific department',
    departmentSpecific: true,
    level: 'manager'
  },
  'department-supervisor': {
    name: 'Department Supervisor',
    description: 'Senior staff with supervisory roles within a department',
    departmentSpecific: true,
    level: 'supervisor'
  },
  'global-admin': {
    name: 'Global Administrator',
    description: 'System administrators with cross-department access',
    departmentSpecific: false,
    level: 'admin'
  },
  'accountant': {
    name: 'Accountant',
    description: 'Financial specialist with cross-department financial access',
    departmentSpecific: false,
    level: 'specialist'
  },
  'hr-manager': {
    name: 'HR Manager',
    description: 'Human resources manager with user management access',
    departmentSpecific: false,
    level: 'specialist'
  },
  'viewer': {
    name: 'Viewer',
    description: 'Read-only access user for reports and monitoring',
    departmentSpecific: false,
    level: 'viewer'
  }
};

const DatabaseUserPolicyAssignment = () => {
  const { data: users = [], isLoading: usersLoading } = useUsers();
  const { data: policies = [], isLoading: policiesLoading } = usePolicies();
  const { data: departments = [] } = useQuery({
    queryKey: ['departments'],
    queryFn: departmentService.getAll,
  });

  const assignPolicyMutation = useAssignPolicy();
  const removePolicyMutation = useRemovePolicyAssignment();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [selectedPolicies, setSelectedPolicies] = useState<string[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");

  const getDepartmentName = (departmentId?: string) => {
    if (!departmentId) return "Global";
    const department = departments.find(d => d.id === departmentId);
    return department ? department.name : "Unknown Department";
  };

  const getAvailablePolicies = () => {
    if (!selectedUser) return [];
    
    return policies.filter(policy => {
      if (selectedDepartment === "no-department") {
        return !policy.department_id;
      }
      return !policy.department_id || policy.department_id === selectedDepartment;
    });
  };

  const handleAssignPolicies = async () => {
    if (!selectedUser || selectedPolicies.length === 0) {
      return;
    }

    try {
      for (const policyId of selectedPolicies) {
        await assignPolicyMutation.mutateAsync({
          user_id: selectedUser,
          policy_id: policyId,
          department_id: selectedDepartment === "no-department" ? null : selectedDepartment,
        });
      }

      onClose();
      setSelectedUser("");
      setSelectedPolicies([]);
      setSelectedDepartment("");
    } catch (error) {
      console.error("Error assigning policies:", error);
    }
  };

  const handleRemoveAssignment = async (userId: string, policyId: string) => {
    removePolicyMutation.mutate({ userId, policyId });
  };

  const togglePolicySelection = (policyId: string) => {
    setSelectedPolicies(prev => {
      if (prev.includes(policyId)) {
        return prev.filter(id => id !== policyId);
      } else {
        return [...prev, policyId];
      }
    });
  };

  const availablePolicies = getAvailablePolicies();

  if (usersLoading || policiesLoading) {
    return <Flex align="center" justify="center" p={8}><Text>Loading...</Text></Flex>;
  }

  return (
    <VStack spacing={6} align="stretch">
      <Flex justify="space-between" align="center">
        <Box>
          <Heading size="md" mb={2}>Database User Policy Assignments</Heading>
          <Text color="gray.600" fontSize="sm">
            Assign department-specific or global policies to users for granular permission control
          </Text>
        </Box>
        <Button leftIcon={<Plus />} onClick={onOpen}>
          Assign Policies
        </Button>
      </Flex>

      <Box border="1px" borderColor="gray.200" borderRadius="md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Join Date</TableHead>
              <TableHead w="100px">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} textAlign="center" py={4}>
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Flex align="center" gap={2}>
                      <Icon as={User} color="gray.500" />
                      <Box>
                        <Text fontWeight="medium">{user.name}</Text>
                        <Text fontSize="sm" color="gray.500">{user.email}</Text>
                      </Box>
                    </Flex>
                  </TableCell>
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
                    <Badge colorScheme={user.is_active ? "green" : "gray"}>
                      {user.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {user.join_date ? new Date(user.join_date).toLocaleDateString() : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <ChakraButton 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        setSelectedUser(user.id);
                        setSelectedPolicies([]);
                        setSelectedDepartment("");
                        onOpen();
                      }}
                    >
                      <Icon as={Plus} />
                    </ChakraButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose} size="3xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Assign Database-Stored Policies to User</ModalHeader>
          <ModalCloseButton />
          
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <Box>
                <Text fontSize="sm" fontWeight="medium" mb={2}>Select User</Text>
                <Select 
                  placeholder="Choose a user" 
                  value={selectedUser} 
                  onChange={(e) => setSelectedUser(e.target.value)}
                >
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </option>
                  ))}
                </Select>
              </Box>

              <Box>
                <Text fontSize="sm" fontWeight="medium" mb={2}>Department Context (Optional)</Text>
                <Select 
                  placeholder="Select department for department-specific policies"
                  value={selectedDepartment} 
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                >
                  <option value="no-department">Global (No specific department)</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name} ({dept.code})
                    </option>
                  ))}
                </Select>
              </Box>

              <Box>
                <Text fontSize="sm" fontWeight="medium" mb={2}>Select Policies</Text>
                <Box 
                  border="1px" 
                  borderColor="gray.200" 
                  borderRadius="md" 
                  p={4} 
                  maxH="64" 
                  overflowY="auto"
                >
                  <VStack spacing={3} align="stretch">
                    {availablePolicies.length === 0 ? (
                      <Text fontSize="sm" color="gray.500">
                        {selectedUser ? "No policies available for the selected department context" : "Please select a user first"}
                      </Text>
                    ) : (
                      availablePolicies.map((policy) => {
                        const userTypeInfo = userTypes[policy.user_type as keyof typeof userTypes];
                        const policyPermissions = Array.isArray(policy.permissions) ? policy.permissions : [];
                        return (
                          <Flex key={policy.id} align="flex-start" gap={3}>
                            <Checkbox
                              id={policy.id}
                              isChecked={selectedPolicies.includes(policy.id)}
                              onChange={() => togglePolicySelection(policy.id)}
                              mt={1}
                            />
                            <VStack spacing={1} align="flex-start" flex={1}>
                              <Text fontSize="sm" fontWeight="medium">
                                {policy.name}
                              </Text>
                              <Text fontSize="xs" color="gray.500">{policy.description}</Text>
                              <HStack spacing={1} mt={1}>
                                <Badge variant="outline" fontSize="xs">
                                  {policyPermissions.length} permissions
                                </Badge>
                                <Badge colorScheme="blue" fontSize="xs">
                                  {userTypeInfo?.name}
                                </Badge>
                                {policy.department_id && (
                                  <Badge variant="outline" fontSize="xs">
                                    <Icon as={Building2} mr={1} />
                                    {getDepartmentName(policy.department_id)}
                                  </Badge>
                                )}
                              </HStack>
                            </VStack>
                          </Flex>
                        );
                      })
                    )}
                  </VStack>
                </Box>
              </Box>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <ChakraButton variant="outline" mr={3} onClick={onClose}>
              Cancel
            </ChakraButton>
            <Button 
              onClick={handleAssignPolicies} 
              isLoading={assignPolicyMutation.isPending}
              isDisabled={!selectedUser || selectedPolicies.length === 0}
            >
              {assignPolicyMutation.isPending ? 'Assigning...' : 'Assign Policies'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  );
};

export default DatabaseUserPolicyAssignment;
