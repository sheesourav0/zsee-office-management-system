
import { useState } from "react";
import { Box, Stack, Text, Flex, Grid } from "@chakra-ui/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/chakra/Card";
import { Button } from "@/components/chakra/Button";
import { Input } from "@/components/chakra/Input";
import { Badge } from "@/components/chakra/Badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/chakra/Dialog";
import { toast } from "@/hooks/use-toast";
import { Plus, Calendar, Clock, Users } from "lucide-react";
import AddWorkPlanForm from "./AddWorkPlanForm";
import { WorkPlan } from "@/features/team/types/teamTypes";

const WorkPlanManagement = () => {
  const [workPlans, setWorkPlans] = useState<WorkPlan[]>([
    {
      id: "1",
      title: "Site Preparation Phase 1",
      description: "Initial site clearing and foundation work",
      startDate: "2023-12-01",
      endDate: "2023-12-15",
      status: "active",
      priority: "high",
      location: "Site A",
      progress: 65,
      createdAt: "2023-11-20",
      updatedAt: "2023-11-20",
      memberId: "member1",
      period: "daily",
      teamLead: "John Doe"
    },
    {
      id: "2", 
      title: "Equipment Installation",
      description: "Install heavy machinery and equipment",
      startDate: "2023-12-10",
      endDate: "2023-12-25",
      status: "scheduled",
      priority: "medium",
      location: "Site B",
      progress: 0,
      createdAt: "2023-11-22",
      updatedAt: "2023-11-22",
      memberId: "member2",
      period: "weekly",
      teamLead: "Jane Smith"
    },
    {
      id: "3",
      title: "Safety Inspection",
      description: "Comprehensive safety audit and compliance check",
      startDate: "2023-12-05",
      endDate: "2023-12-08",
      status: "scheduled",
      priority: "high",
      location: "All Sites",
      progress: 0,
      createdAt: "2023-11-25",
      updatedAt: "2023-11-25",
      memberId: "member3",
      period: "daily",
      teamLead: "Mike Johnson"
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedWorkPlan, setSelectedWorkPlan] = useState<WorkPlan | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  const filteredWorkPlans = workPlans.filter(plan => {
    const matchesSearch = plan.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plan.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || plan.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge colorScheme="green">Active</Badge>;
      case "scheduled":
        return <Badge colorScheme="blue">Scheduled</Badge>;
      case "completed":
        return <Badge colorScheme="gray">Completed</Badge>;
      case "on-hold":
        return <Badge colorScheme="yellow">On Hold</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge colorScheme="red">High</Badge>;
      case "medium":
        return <Badge colorScheme="yellow">Medium</Badge>;
      case "low":
        return <Badge colorScheme="green">Low</Badge>;
      default:
        return <Badge>{priority}</Badge>;
    }
  };

  const handleAddWorkPlan = () => {
    setIsAddDialogOpen(true);
  };

  const handleWorkPlanAdded = (newWorkPlan: Omit<WorkPlan, "id">) => {
    const workPlanWithId: WorkPlan = {
      ...newWorkPlan,
      id: Date.now().toString()
    };
    setWorkPlans(prev => [...prev, workPlanWithId]);
    setIsAddDialogOpen(false);
    toast.success("Work plan added successfully!");
  };

  const handleWorkPlanClick = (workPlan: WorkPlan) => {
    setSelectedWorkPlan(workPlan);
    setIsDetailDialogOpen(true);
  };

  const handleUpdateStatus = (id: string, newStatus: string) => {
    setWorkPlans(prev => prev.map(plan => 
      plan.id === id ? { ...plan, status: newStatus as any } : plan
    ));
    toast.success("Work plan status updated!");
  };

  const getWorkPlanStats = () => {
    const total = workPlans.length;
    const active = workPlans.filter(plan => plan.status === "active").length;
    const scheduled = workPlans.filter(plan => plan.status === "scheduled").length;
    const completed = workPlans.filter(plan => plan.status === "completed").length;
    
    return { total, active, scheduled, completed };
  };

  const stats = getWorkPlanStats();

  return (
    <Box gap={6}>
      {/* Header */}
      <Flex justify="space-between" align="center" mb={6}>
        <Box>
          <Text fontSize="2xl" fontWeight="bold">Work Plan Management</Text>
          <Text color="gray.600">Organize and track work plans across all projects</Text>
        </Box>
        <Button onClick={handleAddWorkPlan}>
          <Plus className="mr-2 h-4 w-4" />
          Add Work Plan
        </Button>
      </Flex>

      {/* Statistics Cards */}
      <Grid templateColumns="repeat(auto-fit, minmax(200px, 1fr))" gap={4} mb={6}>
        <Card>
          <CardContent className="p-4">
            <Flex align="center" gap={3}>
              <Calendar className="h-8 w-8 text-blue-500" />
              <Box>
                <Text fontSize="sm" color="gray.500">Total Plans</Text>
                <Text fontSize="2xl" fontWeight="bold">{stats.total}</Text>
              </Box>
            </Flex>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <Flex align="center" gap={3}>
              <Clock className="h-8 w-8 text-green-500" />
              <Box>
                <Text fontSize="sm" color="gray.500">Active</Text>
                <Text fontSize="2xl" fontWeight="bold">{stats.active}</Text>
              </Box>
            </Flex>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <Flex align="center" gap={3}>
              <Users className="h-8 w-8 text-blue-500" />
              <Box>
                <Text fontSize="sm" color="gray.500">Scheduled</Text>
                <Text fontSize="2xl" fontWeight="bold">{stats.scheduled}</Text>
              </Box>
            </Flex>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <Flex align="center" gap={3}>
              <Calendar className="h-8 w-8 text-gray-500" />
              <Box>
                <Text fontSize="sm" color="gray.500">Completed</Text>
                <Text fontSize="2xl" fontWeight="bold">{stats.completed}</Text>
              </Box>
            </Flex>
          </CardContent>
        </Card>
      </Grid>

      {/* Filters */}
      <Card mb={6}>
        <CardContent className="p-4">
          <Stack gap={4}>
            <Flex gap={4} flexWrap="wrap">
              <Input
                placeholder="Search work plans..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                maxW="300px"
              />
              <Button
                variant={statusFilter === "all" ? "solid" : "outline"}
                onClick={() => setStatusFilter("all")}
              >
                All
              </Button>
              <Button
                variant={statusFilter === "active" ? "solid" : "outline"}
                onClick={() => setStatusFilter("active")}
              >
                Active
              </Button>
              <Button
                variant={statusFilter === "scheduled" ? "solid" : "outline"}
                onClick={() => setStatusFilter("scheduled")}
              >
                Scheduled
              </Button>
              <Button
                variant={statusFilter === "completed" ? "solid" : "outline"}
                onClick={() => setStatusFilter("completed")}
              >
                Completed
              </Button>
            </Flex>
          </Stack>
        </CardContent>
      </Card>

      {/* Work Plans Grid */}
      <Grid templateColumns="repeat(auto-fill, minmax(350px, 1fr))" gap={6}>
        {filteredWorkPlans.map((workPlan) => (
          <Card
            key={workPlan.id}
            cursor="pointer"
            onClick={() => handleWorkPlanClick(workPlan)}
            _hover={{ shadow: "md" }}
          >
            <CardHeader>
              <Flex justify="space-between" align="start">
                <Box flex={1}>
                  <Text fontWeight="bold" mb={1}>{workPlan.title}</Text>
                  <Text fontSize="sm" color="gray.600" mb={2}>
                    {workPlan.description}
                  </Text>
                </Box>
                <Flex direction="column" gap={2} align="end">
                  {getStatusBadge(workPlan.status)}
                  {getPriorityBadge(workPlan.priority)}
                </Flex>
              </Flex>
            </CardHeader>
            <CardContent>
              <Stack gap={2}>
                <Flex justify="space-between" fontSize="sm">
                  <Text color="gray.600">Start Date:</Text>
                  <Text>{workPlan.startDate}</Text>
                </Flex>
                <Flex justify="space-between" fontSize="sm">
                  <Text color="gray.600">End Date:</Text>
                  <Text>{workPlan.endDate}</Text>
                </Flex>
                <Flex justify="space-between" fontSize="sm">
                  <Text color="gray.600">Location:</Text>
                  <Text>{workPlan.location}</Text>
                </Flex>
                {workPlan.teamLead && (
                  <Flex justify="space-between" fontSize="sm">
                    <Text color="gray.600">Team Lead:</Text>
                    <Text>{workPlan.teamLead}</Text>
                  </Flex>
                )}
                <Flex justify="space-between" fontSize="sm">
                  <Text color="gray.600">Progress:</Text>
                  <Text>{workPlan.progress}%</Text>
                </Flex>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Grid>

      {/* Add Work Plan Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Work Plan</DialogTitle>
          </DialogHeader>
          <AddWorkPlanForm
            onSubmit={handleWorkPlanAdded}
            onCancel={() => setIsAddDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Work Plan Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Work Plan Details</DialogTitle>
          </DialogHeader>
          {selectedWorkPlan && (
            <Stack gap={4}>
              <Box>
                <Text fontWeight="bold" fontSize="lg" mb={2}>
                  {selectedWorkPlan.title}
                </Text>
                <Text color="gray.600" mb={4}>
                  {selectedWorkPlan.description}
                </Text>
              </Box>

              <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                <Box>
                  <Text fontSize="sm" fontWeight="medium" color="gray.500">Start Date</Text>
                  <Text>{selectedWorkPlan.startDate}</Text>
                </Box>
                <Box>
                  <Text fontSize="sm" fontWeight="medium" color="gray.500">End Date</Text>
                  <Text>{selectedWorkPlan.endDate}</Text>
                </Box>
                <Box>
                  <Text fontSize="sm" fontWeight="medium" color="gray.500">Location</Text>
                  <Text>{selectedWorkPlan.location}</Text>
                </Box>
                {selectedWorkPlan.teamLead && (
                  <Box>
                    <Text fontSize="sm" fontWeight="medium" color="gray.500">Team Lead</Text>
                    <Text>{selectedWorkPlan.teamLead}</Text>
                  </Box>
                )}
                <Box>
                  <Text fontSize="sm" fontWeight="medium" color="gray.500">Status</Text>
                  <Box mt={1}>{getStatusBadge(selectedWorkPlan.status)}</Box>
                </Box>
                <Box>
                  <Text fontSize="sm" fontWeight="medium" color="gray.500">Priority</Text>
                  <Box mt={1}>{getPriorityBadge(selectedWorkPlan.priority)}</Box>
                </Box>
              </Grid>

              <Box>
                <Text fontSize="sm" fontWeight="medium" color="gray.500" mb={2}>Progress</Text>
                <Text>{selectedWorkPlan.progress}%</Text>
              </Box>

              <Flex gap={2} justify="flex-end">
                <Button variant="outline" onClick={() => setIsDetailDialogOpen(false)}>
                  Close
                </Button>
                <Button onClick={() => {
                  // Handle edit functionality
                  toast.info("Edit functionality coming soon!");
                }}>
                  Edit Plan
                </Button>
              </Flex>
            </Stack>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default WorkPlanManagement;
