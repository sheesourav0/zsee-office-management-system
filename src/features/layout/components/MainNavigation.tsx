
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Button } from '@/components/chakra/Button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/chakra/Avatar';
import { VStack, HStack, Box, Text } from '@chakra-ui/react';
import {
  Home,
  FileText,
  CreditCard,
  Users,
  Settings,
  Truck,
  Calculator,
  Building,
  Receipt,
  BarChart3,
  DollarSign,
} from 'lucide-react';

const navigationItems = [
  { icon: Home, label: 'Dashboard', path: '/' },
  { icon: FileText, label: 'Projects', path: '/projects' },
  { icon: CreditCard, label: 'Payments', path: '/payments' },
  { icon: DollarSign, label: 'Project Billing', path: '/project-billing' },
  { icon: Receipt, label: 'Purchase & Billing', path: '/purchase-billing' },
  { icon: Calculator, label: 'Expenses', path: '/expenses' },
  { icon: Users, label: 'Team Management', path: '/team' },
  { icon: Truck, label: 'Transportation', path: '/transportation' },
  { icon: Building, label: 'User Management', path: '/users' },
  { icon: BarChart3, label: 'Reports', path: '/reports' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

const MainNavigation = () => {
  const location = useLocation();

  return (
    <Box h="100vh" p={4}>
      <VStack gap={6} align="stretch" h="100%">
        <Box>
          <HStack gap={3} mb={6}>
            <Avatar size="md">
              <AvatarImage src="/placeholder.svg" alt="User" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <Box>
              <Text fontWeight="semibold">Admin User</Text>
              <Text fontSize="sm" color="gray.600">admin@company.com</Text>
            </Box>
          </HStack>
        </Box>

        <VStack gap={1} align="stretch" flex={1}>
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Button
                key={item.path}
                as={NavLink}
                to={item.path}
                variant={isActive ? 'solid' : 'ghost'}
                justifyContent="flex-start"
                leftIcon={<Icon size={18} />}
                size="md"
                width="100%"
              >
                {item.label}
              </Button>
            );
          })}
        </VStack>
      </VStack>
    </Box>
  );
};

export default MainNavigation;
