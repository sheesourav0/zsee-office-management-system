
import { Box, VStack, Heading, Text } from "@chakra-ui/react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@/components/chakra/Tabs";
import DatabaseAddUserForm from "@/components/users/DatabaseAddUserForm";
import DatabaseUsersList from "@/components/users/DatabaseUsersList";
import DatabasePolicyManagement from "@/components/users/DatabasePolicyManagement";
import ImportUsers from "@/components/users/ImportUsers";
import DatabaseUserPolicyAssignment from "@/components/users/DatabaseUserPolicyAssignment";

const UserManagementPage = () => {
  return (
    <VStack spacing={6} align="stretch">
      <Box>
        <Heading size="lg" mb={2}>User Management</Heading>
        <Text color="gray.600">Manage users, department-based policies and permissions with Supabase</Text>
      </Box>

      <Tabs>
        <TabList>
          <Tab>User List</Tab>
          <Tab>Add User</Tab>
          <Tab>Policy Management</Tab>
          <Tab>Policy Assignments</Tab>
          <Tab>Import Users</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <DatabaseUsersList />
          </TabPanel>
          <TabPanel>
            <DatabaseAddUserForm />
          </TabPanel>
          <TabPanel>
            <DatabasePolicyManagement />
          </TabPanel>
          <TabPanel>
            <DatabaseUserPolicyAssignment />
          </TabPanel>
          <TabPanel>
            <ImportUsers />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </VStack>
  );
};

export default UserManagementPage;
