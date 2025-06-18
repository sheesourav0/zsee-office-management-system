
import { useState, useEffect } from "react";
import { Box, Flex, Heading } from "@chakra-ui/react";
import { Button } from "@/components/chakra/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/chakra/Card";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@/components/chakra/Tabs";
import { Input } from "@/components/chakra/Input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/chakra/Table";
import { Badge } from "@/components/chakra/Badge";
import { Progress } from "@/components/chakra/Progress";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Simulated data for departments
const departments = [
  {
    id: "civil",
    name: "Civil",
    manager: "John Doe",
    ongoingProjects: 4,
    totalProjects: 8
  },
  {
    id: "mechanical",
    name: "Mechanical",
    manager: "Sarah Johnson",
    ongoingProjects: 3,
    totalProjects: 5
  },
  {
    id: "design",
    name: "Design",
    manager: "Mike Chen",
    ongoingProjects: 2,
    totalProjects: 6
  },
  {
    id: "accounts",
    name: "Accounts",
    manager: "Lisa Wong",
    ongoingProjects: 1,
    totalProjects: 3
  },
  {
    id: "tender",
    name: "Tender",
    manager: "Robert Singh",
    ongoingProjects: 2,
    totalProjects: 4
  },
  {
    id: "purchase",
    name: "Purchase",
    manager: "James Miller",
    ongoingProjects: 3,
    totalProjects: 5
  },
  {
    id: "automation",
    name: "Automation",
    manager: "Emily Clark",
    ongoingProjects: 5,
    totalProjects: 7
  }
];

// Simulated data - in a real app, this would come from an API
const generateMockProjects = (department?: string) => {
  const projects = [
    {
      id: "1",
      name: "Amrit WTP",
      department: "civil",
      totalBudget: 7500000,
      spent: 4875000,
      remaining: 2625000,
      status: "in-progress",
      progress: 65,
      startDate: "15/1/2023",
      endDate: "30/7/2023",
      paymentsCount: 10,
      pendingPayments: 3
    },
    {
      id: "2",
      name: "YACHULI",
      department: "mechanical",
      totalBudget: 3500000,
      spent: 2800000,
      remaining: 700000,
      status: "in-progress",
      progress: 80,
      startDate: "10/2/2023",
      endDate: "20/5/2023",
      paymentsCount: 12,
      pendingPayments: 2
    },
    {
      id: "3",
      name: "Sample Testing",
      department: "design",
      totalBudget: 450000,
      spent: 450000,
      remaining: 0,
      status: "completed",
      progress: 100,
      startDate: "1/2/2023",
      endDate: "15/3/2023",
      paymentsCount: 4,
      pendingPayments: 0
    },
    {
      id: "4",
      name: "Piyong IoT",
      department: "automation",
      totalBudget: 1200000,
      spent: 360000,
      remaining: 840000,
      status: "in-progress",
      progress: 30,
      startDate: "20/3/2023",
      endDate: "10/6/2023",
      paymentsCount: 5,
      pendingPayments: 4
    },
    {
      id: "5",
      name: "Machuika",
      department: "civil",
      totalBudget: 2200000,
      spent: 990000,
      remaining: 1210000,
      status: "in-progress",
      progress: 45,
      startDate: "1/3/2023",
      endDate: "30/9/2023",
      paymentsCount: 8,
      pendingPayments: 5
    }
  ];

  if (department) {
    return projects.filter(p => p.department === department);
  }
  
  return projects;
};

const DepartmentProjects = () => {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [projects, setProjects] = useState<any[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<any[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);

  useEffect(() => {
    // Get user's department from localStorage (in a real app)
    const userData = localStorage.getItem("user");
    let user = null;
    if (userData) {
      user = JSON.parse(userData);
    }
    
    // Here we'd normally fetch the user's department projects
    // For now, just get all projects
    const allProjects = generateMockProjects(selectedDepartment || undefined);
    setProjects(allProjects);
    filterProjects(allProjects, statusFilter, searchQuery);
  }, [statusFilter, searchQuery, selectedDepartment]);

  const filterProjects = (projects: any[], status: string, query: string) => {
    let result = [...projects];
    
    // Filter by status
    if (status !== "all") {
      result = result.filter(project => project.status === status);
    }
    
    // Filter by search query
    if (query) {
      const queryLower = query.toLowerCase();
      result = result.filter(project => 
        project.name.toLowerCase().includes(queryLower)
      );
    }
    
    setFilteredProjects(result);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge colorScheme="green">Completed</Badge>;
      case "in-progress":
        return <Badge colorScheme="yellow">In Progress</Badge>;
      case "on-hold":
        return <Badge colorScheme="orange">On Hold</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const handleDepartmentSelect = (deptId: string) => {
    setSelectedDepartment(deptId);
  };

  const handleDepartmentAction = (deptId: string, action: string) => {
    if (action === 'payments') {
      navigate('/payments');
    } else if (action === 'projects') {
      setSelectedDepartment(deptId);
    }
  };

  return (
    <Box gap={6}>
      <Flex 
        direction={{ base: "column", md: "row" }} 
        align={{ md: "center" }} 
        justify={{ md: "space-between" }} 
        gap={4}
        mb={6}
      >
        <Heading size="lg">Department Projects</Heading>
      </Flex>
      
      {!selectedDepartment ? (
        <Card>
          <CardHeader>
            <CardTitle>Departments Overview</CardTitle>
            <CardDescription>View and manage departments and their projects</CardDescription>
          </CardHeader>
          <CardContent>
            <Box display="grid" gridTemplateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={4}>
              {departments.map(dept => (
                <Card key={dept.id} cursor="pointer" _hover={{ boxShadow: "md" }} transition="box-shadow 0.2s">
                  <CardHeader pb={2}>
                    <CardTitle>{dept.name}</CardTitle>
                    <CardDescription>Manager: {dept.manager}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Box gap={2}>
                      <Flex justify="space-between" align="center">
                        <Box as="span" fontSize="sm" color="gray.600">Ongoing Projects:</Box>
                        <Badge variant="outline">{dept.ongoingProjects} / {dept.totalProjects}</Badge>
                      </Flex>
                      <Progress value={(dept.ongoingProjects / dept.totalProjects) * 100} size="sm" />
                      <Flex justify="space-between" mt={4}>
                        <Button size="sm" variant="outline" onClick={() => handleDepartmentAction(dept.id, 'projects')}>
                          View Projects
                        </Button>
                        <Button size="sm" onClick={() => handleDepartmentAction(dept.id, 'payments')}>
                          Payments
                        </Button>
                      </Flex>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <Flex align="center" justify="space-between">
              <Box>
                <CardTitle>Project Management</CardTitle>
                <CardDescription>
                  {departments.find(d => d.id === selectedDepartment)?.name} Department Projects
                </CardDescription>
              </Box>
              <Button variant="outline" onClick={() => setSelectedDepartment(null)}>
                Back to Departments
              </Button>
            </Flex>
          </CardHeader>
          <CardContent>
            <Box gap={6}>
              <Flex 
                direction={{ base: "column", md: "row" }} 
                align={{ md: "center" }} 
                justify={{ md: "space-between" }} 
                gap={4}
              >
                <Tabs value={statusFilter} onValueChange={setStatusFilter}>
                  <TabList>
                    <Tab value="all">All</Tab>
                    <Tab value="in-progress">In Progress</Tab>
                    <Tab value="completed">Completed</Tab>
                    <Tab value="on-hold">On Hold</Tab>
                  </TabList>
                </Tabs>
                
                <Box position="relative" w={{ base: "full", md: "64" }}>
                  <Search style={{ position: 'absolute', left: '8px', top: '10px', width: '16px', height: '16px', color: '#A0AEC0' }} />
                  <Input
                    placeholder="Search projects..."
                    paddingLeft="32px"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </Box>
              </Flex>
              
              <Box borderWidth={1} borderRadius="md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Project Name</TableHead>
                      <TableHead>Budget</TableHead>
                      <TableHead>Spent</TableHead>
                      <TableHead>Remaining</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>End Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProjects.map((project) => (
                      <TableRow key={project.id}>
                        <TableCell fontWeight="medium">{project.name}</TableCell>
                        <TableCell>₹{project.totalBudget.toLocaleString()}</TableCell>
                        <TableCell>₹{project.spent.toLocaleString()}</TableCell>
                        <TableCell>₹{project.remaining.toLocaleString()}</TableCell>
                        <TableCell>
                          <Flex align="center" gap={2}>
                            <Progress value={project.progress} size="sm" w="20" />
                            <Box as="span" fontSize="xs">{project.progress}%</Box>
                          </Flex>
                        </TableCell>
                        <TableCell>{getStatusBadge(project.status)}</TableCell>
                        <TableCell>{project.startDate}</TableCell>
                        <TableCell>{project.endDate}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default DepartmentProjects;
