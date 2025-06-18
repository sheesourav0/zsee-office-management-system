import { useState, useEffect } from "react";
import { Box, Flex, Heading } from "@chakra-ui/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/chakra/Card";
import { Button } from "@/components/chakra/Button";
import { Input } from "@/components/chakra/Input";
import { Badge } from "@/components/chakra/Badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/chakra/Table";
import { Plus, Search, Edit, Trash2, Eye } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/chakra/Dialog";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@/components/chakra/Tabs";
import { toast } from "@/hooks/use-toast";
import AddWorkPlanForm from "./AddWorkPlanForm";

// Mock data for work plans
const mockWorkPlans = [
  {
    id: "WP001",
    title: "Site Preparation",
    teamMember: "John Doe",
    startDate: "2023-01-15",
    endDate: "2023-02-28",
    status: "in-progress",
    description: "Prepare the construction site for the main building.",
  },
  {
    id: "WP002",
    title: "Foundation Work",
    teamMember: "Alice Smith",
    startDate: "2023-03-01",
    endDate: "2023-04-30",
    status: "completed",
    description: "Complete the foundation work for the building.",
  },
  {
    id: "WP003",
    title: "Electrical Wiring",
    teamMember: "Bob Johnson",
    startDate: "2023-05-01",
    endDate: "2023-06-30",
    status: "pending",
    description: "Install electrical wiring throughout the building.",
  },
  {
    id: "WP004",
    title: "Plumbing Installation",
    teamMember: "Emily Clark",
    startDate: "2023-07-01",
    endDate: "2023-08-31",
    status: "in-progress",
    description: "Install plumbing systems in the building.",
  },
];

// Mock type for work plan
interface WorkPlan {
  id: string;
  title: string;
  teamMember: string;
  startDate: string;
  endDate: string;
  status: string;
  description: string;
}

const WorkPlanManagement = () => {
  const [workPlans, setWorkPlans] = useState<WorkPlan[]>(mockWorkPlans);
  const [filteredWorkPlans, setFilteredWorkPlans] = useState<WorkPlan[]>(mockWorkPlans);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedWorkPlan, setSelectedWorkPlan] = useState<WorkPlan | null>(null);

  useEffect(() => {
    filterWorkPlans();
  }, [searchQuery, statusFilter]);

  const filterWorkPlans = () => {
    let result = [...workPlans];

    if (statusFilter !== "all") {
      result = result.filter(wp => wp.status === statusFilter);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(wp =>
        wp.title.toLowerCase().includes(query) ||
        wp.teamMember.toLowerCase().includes(query)
      );
    }

    setFilteredWorkPlans(result);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "in-progress":
        return <Badge colorScheme="yellow">In Progress</Badge>;
      case "completed":
        return <Badge colorScheme="green">Completed</Badge>;
      case "pending":
        return <Badge colorScheme="gray">Pending</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const handleAddWorkPlanSuccess = (newWorkPlan: WorkPlan) => {
    setWorkPlans([...workPlans, newWorkPlan]);
    setFilteredWorkPlans([...workPlans, newWorkPlan]);
    setIsAddDialogOpen(false);
    toast.success("Work plan created successfully!");
  };

  const handleEditWorkPlan = (workPlanId: string) => {
    toast.info(`Editing work plan ${workPlanId}`);
  };

  const handleDeleteWorkPlan = (workPlanId: string) => {
    toast.success(`Deleting work plan ${workPlanId}`);
  };

  const handleViewWorkPlan = (workPlanId: string) => {
    const workPlan = workPlans.find(wp => wp.id === workPlanId);
    setSelectedWorkPlan(workPlan || null);
  };

  const handleCloseViewDialog = () => {
    setSelectedWorkPlan(null);
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
        <Heading size="lg">Work Plans</Heading>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus style={{ marginRight: '8px', width: '16px', height: '16px' }} />
          Create Work Plan
        </Button>
      </Flex>

      <Card>
        <CardHeader>
          <CardTitle>Work Plan Management</CardTitle>
          <CardDescription>View and manage work plans for team members</CardDescription>
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
                  <Tab value="pending">Pending</Tab>
                </TabList>
              </Tabs>
              
              <Box position="relative" w={{ base: "full", md: "64" }}>
                <Search style={{ position: 'absolute', left: '8px', top: '10px', width: '16px', height: '16px', color: '#A0AEC0' }} />
                <Input
                  placeholder="Search work plans..."
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
                    <TableHead>Title</TableHead>
                    <TableHead>Team Member</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead textAlign="right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredWorkPlans.map((workPlan) => (
                    <TableRow key={workPlan.id}>
                      <TableCell fontWeight="medium">{workPlan.title}</TableCell>
                      <TableCell>{workPlan.teamMember}</TableCell>
                      <TableCell>{workPlan.startDate}</TableCell>
                      <TableCell>{workPlan.endDate}</TableCell>
                      <TableCell>{getStatusBadge(workPlan.status)}</TableCell>
                      <TableCell textAlign="right">
                        <Flex gap={2} justify="flex-end">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleViewWorkPlan(workPlan.id)}
                          >
                            <Eye style={{ width: '16px', height: '16px' }} />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleEditWorkPlan(workPlan.id)}
                          >
                            <Edit style={{ width: '16px', height: '16px' }} />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDeleteWorkPlan(workPlan.id)}
                          >
                            <Trash2 style={{ width: '16px', height: '16px' }} />
                          </Button>
                        </Flex>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent maxW="700px" maxH="90vh" overflowY="auto">
          <DialogHeader>
            <DialogTitle>Create Work Plan</DialogTitle>
          </DialogHeader>
          <AddWorkPlanForm 
            onSubmit={handleAddWorkPlanSuccess} 
            onCancel={() => setIsAddDialogOpen(false)} 
          />
        </DialogContent>
      </Dialog>

      <Dialog open={selectedWorkPlan !== null} onOpenChange={() => setSelectedWorkPlan(null)}>
        <DialogContent maxW="700px" maxH="90vh" overflowY="auto">
          <DialogHeader>
            <DialogTitle>Work Plan Details</DialogTitle>
          </DialogHeader>
          {selectedWorkPlan && (
            <Box>
              <Text fontWeight="bold">Title:</Text>
              <Text>{selectedWorkPlan.title}</Text>
              <Text fontWeight="bold">Team Member:</Text>
              <Text>{selectedWorkPlan.teamMember}</Text>
              <Text fontWeight="bold">Start Date:</Text>
              <Text>{selectedWorkPlan.startDate}</Text>
              <Text fontWeight="bold">End Date:</Text>
              <Text>{selectedWorkPlan.endDate}</Text>
              <Text fontWeight="bold">Status:</Text>
              <Text>{selectedWorkPlan.status}</Text>
              <Text fontWeight="bold">Description:</Text>
              <Text>{selectedWorkPlan.description}</Text>
            </Box>
          )}
          <Button onClick={handleCloseViewDialog}>Close</Button>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default WorkPlanManagement;
