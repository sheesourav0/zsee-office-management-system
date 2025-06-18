
import { useState } from "react";
import { Box, Stack, Text, Flex } from "@chakra-ui/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/chakra/Card";
import { Button } from "@/components/chakra/Button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/chakra/Dialog";
import { Alert } from "@/components/chakra/Alert";
import { Badge } from "@/components/chakra/Badge";
import { Progress } from "@/components/chakra/Progress";
import { Calendar, Clock, Users, AlertTriangle } from "lucide-react";

const TeamMonitoring = () => {
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  // Mock data for team monitoring
  const teamStats = {
    totalMembers: 25,
    activeMembers: 18,
    tasksInProgress: 12,
    overdueTasks: 3
  };

  const recentActivities = [
    {
      id: 1,
      member: "John Doe",
      action: "Completed task: Site Survey",
      timestamp: "2 hours ago",
      type: "completion"
    },
    {
      id: 2,
      member: "Jane Smith",
      action: "Started work on: Equipment Installation",
      timestamp: "4 hours ago",
      type: "start"
    },
    {
      id: 3,
      member: "Mike Johnson",
      action: "Updated progress on: Safety Inspection",
      timestamp: "6 hours ago",
      type: "update"
    }
  ];

  const activeTasks = [
    {
      id: 1,
      title: "Site Preparation",
      assignee: "John Doe",
      progress: 75,
      dueDate: "2023-12-15",
      priority: "High",
      status: "in-progress"
    },
    {
      id: 2,
      title: "Equipment Setup",
      assignee: "Jane Smith",
      progress: 45,
      dueDate: "2023-12-20",
      priority: "Medium",
      status: "in-progress"
    },
    {
      id: 3,
      title: "Quality Check",
      assignee: "Mike Johnson",
      progress: 20,
      dueDate: "2023-12-10",
      priority: "High",
      status: "overdue"
    }
  ];

  const handleTaskClick = (task: any) => {
    setSelectedTask(task);
    setIsDetailDialogOpen(true);
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "High":
        return <Badge colorScheme="red">{priority}</Badge>;
      case "Medium":
        return <Badge colorScheme="yellow">{priority}</Badge>;
      case "Low":
        return <Badge colorScheme="green">{priority}</Badge>;
      default:
        return <Badge>{priority}</Badge>;
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "completion":
        return <Calendar className="h-4 w-4 text-green-500" />;
      case "start":
        return <Clock className="h-4 w-4 text-blue-500" />;
      case "update":
        return <Users className="h-4 w-4 text-orange-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <Box gap={6}>
      {/* Team Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-blue-500" />
              <div>
                <Text fontSize="sm" color="gray.500">Total Members</Text>
                <Text fontSize="2xl" fontWeight="bold">{teamStats.totalMembers}</Text>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-green-500" />
              <div>
                <Text fontSize="sm" color="gray.500">Active Members</Text>
                <Text fontSize="2xl" fontWeight="bold">{teamStats.activeMembers}</Text>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-orange-500" />
              <div>
                <Text fontSize="sm" color="gray.500">In Progress</Text>
                <Text fontSize="2xl" fontWeight="bold">{teamStats.tasksInProgress}</Text>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-8 w-8 text-red-500" />
              <div>
                <Text fontSize="sm" color="gray.500">Overdue</Text>
                <Text fontSize="2xl" fontWeight="bold">{teamStats.overdueTasks}</Text>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alert for overdue tasks */}
      {teamStats.overdueTasks > 0 && (
        <Alert status="info" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <Text>You have {teamStats.overdueTasks} overdue tasks that need attention.</Text>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Tasks */}
        <Card>
          <CardHeader>
            <CardTitle>Active Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <Stack gap={4}>
              {activeTasks.map((task) => (
                <Flex
                  key={task.id}
                  p={3}
                  border="1px"
                  borderColor="gray.200"
                  borderRadius="md"
                  cursor="pointer"
                  onClick={() => handleTaskClick(task)}
                  _hover={{ bg: "gray.50" }}
                >
                  <Box flex={1}>
                    <Flex justify="space-between" align="center" mb={2}>
                      <Text fontWeight="medium">{task.title}</Text>
                      {getPriorityBadge(task.priority)}
                    </Flex>
                    <Text fontSize="sm" color="gray.600" mb={2}>
                      Assigned to: {task.assignee}
                    </Text>
                    <Flex align="center" gap={2}>
                      <Progress value={task.progress} size="sm" flex={1} />
                      <Text fontSize="sm">{task.progress}%</Text>
                    </Flex>
                    <Text fontSize="xs" color="gray.500" mt={1}>
                      Due: {task.dueDate}
                    </Text>
                  </Box>
                </Flex>
              ))}
            </Stack>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <Stack gap={4}>
              {recentActivities.map((activity) => (
                <Flex key={activity.id} align="start" gap={3}>
                  {getActivityIcon(activity.type)}
                  <Box flex={1}>
                    <Text fontSize="sm" fontWeight="medium">
                      {activity.member}
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      {activity.action}
                    </Text>
                    <Text fontSize="xs" color="gray.500">
                      {activity.timestamp}
                    </Text>
                  </Box>
                </Flex>
              ))}
            </Stack>
          </CardContent>
        </Card>
      </div>

      {/* Task Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Task Details</DialogTitle>
          </DialogHeader>
          {selectedTask && (
            <Stack gap={4}>
              <Box>
                <Text fontWeight="medium" mb={2}>Task: {selectedTask.title}</Text>
                <Text fontSize="sm" color="gray.600" mb={2}>
                  Assigned to: {selectedTask.assignee}
                </Text>
                <Flex align="center" gap={2} mb={2}>
                  <Text fontSize="sm">Progress:</Text>
                  <Progress value={selectedTask.progress} size="sm" flex={1} />
                  <Text fontSize="sm">{selectedTask.progress}%</Text>
                </Flex>
                <Text fontSize="sm" color="gray.600" mb={2}>
                  Due Date: {selectedTask.dueDate}
                </Text>
                <Flex align="center" gap={2}>
                  <Text fontSize="sm">Priority:</Text>
                  {getPriorityBadge(selectedTask.priority)}
                </Flex>
              </Box>
              
              <Text fontSize="sm" color="gray.600">
                Status: {selectedTask.status === "overdue" ? (
                  <Badge colorScheme="red">Overdue</Badge>
                ) : (
                  <Badge colorScheme="blue">In Progress</Badge>
                )}
              </Text>
              
              <Flex gap={2} justify="flex-end">
                <Button variant="outline" onClick={() => setIsDetailDialogOpen(false)}>
                  Close
                </Button>
                <Button>
                  Update Task
                </Button>
              </Flex>
            </Stack>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default TeamMonitoring;
