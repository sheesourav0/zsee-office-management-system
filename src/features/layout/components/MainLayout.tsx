
import React from 'react';
import { Outlet } from 'react-router-dom';
import MainNavigation from './MainNavigation';
import { Box, Flex } from '@chakra-ui/react';

const MainLayout = () => {
  return (
    <Flex minH="100vh">
      <Box as="aside" w="250px" bg="gray.50" borderRight="1px" borderColor="gray.200">
        <MainNavigation />
      </Box>
      <Box flex={1} p={6} bg="white">
        <Outlet />
      </Box>
    </Flex>
  );
};

export default MainLayout;
