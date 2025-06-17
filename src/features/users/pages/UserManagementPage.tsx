
import { VStack } from "@chakra-ui/react";
import DatabaseAddUserForm from "@/components/users/DatabaseAddUserForm";
import DatabaseUsersList from "@/components/users/DatabaseUsersList";
import ImportUsers from "@/components/users/ImportUsers";

const UserManagementPage = () => {
  return (
    <VStack gap={6} align="stretch">
      <DatabaseAddUserForm />
      <ImportUsers />
      <DatabaseUsersList />
    </VStack>
  );
};

export default UserManagementPage;
