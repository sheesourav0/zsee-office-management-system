import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/chakra/Card";
import { Button } from "@/components/chakra/Button";
import { Input } from "@/components/chakra/Input";
import { Textarea } from "@/components/chakra/Textarea";
import { Badge } from "@/components/chakra/Badge";
import { Alert } from "@/components/chakra/Alert";
import { Label } from "@/components/chakra/Label";
import { Select } from "@/components/chakra/Select";
import { Box, Text, VStack } from "@chakra-ui/react";
import { Plus, CheckCircle, XCircle, Clock, AlertTriangle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Task {
  id: string;
  title: string;
  description: string;
  assignee: string;
  status: "open" | "in progress" | "completed" | "blocked";
  priority: "high" | "medium" | "low";
  dueDate: string;
}

const initialTasks: Task[] = [
  {
    id: "1",
    title: "Design Payment Page",
    description: "Create wireframes and UI design for the payment processing page.",
    assignee: "John Doe",
    status: "in progress",
    priority: "high",
    dueDate: "2024-03-15",
  },
  {
    id: "2",
    title: "Implement User Authentication",
    description: "Set up user authentication and authorization using OAuth 2.0.",
    assignee: "Jane Smith",
    status: "completed",
    priority: "high",
    dueDate: "2024-03-10",
  },
  {
    id: "3",
    title: "Develop API Endpoints",
    description: "Create RESTful API endpoints for data retrieval and manipulation.",
    assignee: "Mike Johnson",
    status: "open",
    priority: "medium",
    dueDate: "2024-03-22",
  },
  {
    id: "4",
    title: "Write Unit Tests",
    description: "Write unit tests for all components and functions.",
    assignee: "Emily White",
    status: "blocked",
    priority: "low",
    dueDate: "2024-03-29",
  },
];

const TeamMonitoring = () => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [newTask, setNewTask] = useState<Omit<Task, "id"> | null>(null);
  const [showAddTaskForm, setShowAddTaskForm] = useState(false);

  const handleAddTask = () => {
    setShowAddTaskForm(true);
    setNewTask({
      title: "",
      description: "",
      assignee: "",
      status: "open",
      priority: "medium",
      dueDate: "",
    });
  };

  const handleSaveTask = () => {
    if (!newTask) return;

    if (!newTask.title || !newTask.description || !newTask.assignee || !newTask.dueDate) {
      toast.error("Please fill in all fields.");
      return;
    }

    const newTaskWithId: Task = { ...newTask, id: Date.now().toString() };
    setTasks([...tasks, newTaskWithId]);
    setShowAddTaskForm(false);
    setNewTask(null);
    toast.success("Task added successfully!");
  };

  const handleCancelTask = () => {
    setShowAddTaskForm(false);
    setNewTask(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>, field: string) => {
    if (!newTask) return;
    setNewTask({ ...newTask, [field]: e.target.value });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case "in progress":
        return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>;
      case "open":
        return <Badge className="bg-yellow-100 text-yellow-800">Open</Badge>;
      case "blocked":
        return <Badge className="bg-red-100 text-red-800">Blocked</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Alert status="info" className="mb-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4" />
          <Text>Real-time monitoring of team activities and work progress</Text>
        </div>
      </Alert>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Tasks Overview</CardTitle>
            <Button onClick={handleAddTask}>
              <Plus className="mr-2 h-4 w-4" />
              Add Task
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <VStack spacing={4} align="stretch">
            {tasks.map((task) => (
              <Box key={task.id} className="p-4 rounded-md shadow-sm border">
                <HStack justify="space-between">
                  <Text fontWeight="bold">{task.title}</Text>
                  {getStatusBadge(task.status)}
                </HStack>
                <Text fontSize="sm" color="gray.500">
                  {task.description}
                </Text>
                <HStack justify="space-between" mt={2}>
                  <Text>
                    Assignee: <Text fontWeight="medium">{task.assignee}</Text>
                  </Text>
                  <Text>
                    Due Date: <Text fontWeight="medium">{task.dueDate}</Text>
                  </Text>
                </HStack>
              </Box>
            ))}
          </VStack>
        </CardContent>
      </Card>

      {showAddTaskForm && newTask && (
        <Dialog open={showAddTaskForm} onOpenChange={setShowAddTaskForm}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New Task</DialogTitle>
            </DialogHeader>
            <VStack spacing={4} align="stretch">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={newTask.title}
                onChange={(e) => handleInputChange(e, "title")}
                placeholder="Task Title"
              />

              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newTask.description}
                onChange={(e) => handleInputChange(e, "description")}
                placeholder="Task Description"
              />

              <Label htmlFor="assignee">Assignee</Label>
              <Input
                id="assignee"
                value={newTask.assignee}
                onChange={(e) => handleInputChange(e, "assignee")}
                placeholder="Assignee"
              />

              <Label htmlFor="status">Status</Label>
              <Select id="status" value={newTask.status} onChange={(e) => handleInputChange(e, "status")}>
                <option value="open">Open</option>
                <option value="in progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="blocked">Blocked</option>
              </Select>

              <Label htmlFor="priority">Priority</Label>
              <Select id="priority" value={newTask.priority} onChange={(e) => handleInputChange(e, "priority")}>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </Select>

              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                type="date"
                id="dueDate"
                value={newTask.dueDate}
                onChange={(e) => handleInputChange(e, "dueDate")}
              />
            </VStack>
            <DialogFooter>
              <Button variant="ghost" onClick={handleCancelTask}>
                Cancel
              </Button>
              <Button onClick={handleSaveTask}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default TeamMonitoring;
