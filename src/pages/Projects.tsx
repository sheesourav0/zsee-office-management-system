
import { useState, useEffect } from "react";
import { Button } from "@/components/chakra/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/chakra/Card";
import { Tabs, TabList, Tab } from "@/components/chakra/Tabs";
import { Input } from "@/components/chakra/Input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/chakra/Dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/chakra/Table";
import { Badge } from "@/components/chakra/Badge";
import { Progress } from "@/components/chakra/Progress";
import { Plus, Search } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import AddProjectForm from "@/components/projects/AddProjectForm";

// Simulated data - in a real app, this would come from an API
const generateMockProjects = () => {
  return [
    {
      id: "1",
      name: "Amni WTP",
      totalBudget: 7500000,
      spent: 4875000,
      remaining: 2625000,
      status: "in-progress",
      progress: 65,
      startDate: "2023-01-15",
      endDate: "2023-07-30",
      paymentsCount: 10,
      pendingPayments: 3
    },
    {
      id: "2",
      name: "YACHULI",
      totalBudget: 3500000,
      spent: 2800000,
      remaining: 700000,
      status: "in-progress",
      progress: 80,
      startDate: "2023-02-10",
      endDate: "2023-05-20",
      paymentsCount: 12,
      pendingPayments: 2
    },
    {
      id: "3",
      name: "Sample Testing",
      totalBudget: 450000,
      spent: 450000,
      remaining: 0,
      status: "completed",
      progress: 100,
      startDate: "2023-02-01",
      endDate: "2023-03-15",
      paymentsCount: 4,
      pendingPayments: 0
    },
    {
      id: "4",
      name: "Piyong IoT",
      totalBudget: 1200000,
      spent: 360000,
      remaining: 840000,
      status: "in-progress",
      progress: 30,
      startDate: "2023-03-20",
      endDate: "2023-08-10",
      paymentsCount: 5,
      pendingPayments: 4
    },
    {
      id: "5",
      name: "Machuika",
      totalBudget: 2200000,
      spent: 990000,
      remaining: 1210000,
      status: "in-progress",
      progress: 45,
      startDate: "2023-03-01",
      endDate: "2023-09-30",
      paymentsCount: 8,
      pendingPayments: 5
    }
  ];
};

const Projects = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  useEffect(() => {
    const allProjects = generateMockProjects();
    setProjects(allProjects);
    filterProjects(allProjects, statusFilter, searchQuery);
  }, [statusFilter, searchQuery]);

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
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case "in-progress":
        return <Badge className="bg-yellow-100 text-yellow-800">In Progress</Badge>;
      case "on-hold":
        return <Badge className="bg-orange-100 text-orange-800">On Hold</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const handleAddProjectSuccess = () => {
    setIsAddDialogOpen(false);
    toast.success("Project added successfully!");
    // In a real app, we would refresh projects from the API
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-bold">Projects</h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Project
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Project Management</CardTitle>
          <CardDescription>Manage all construction projects</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <Tabs defaultValue="all" value={statusFilter} onValueChange={setStatusFilter}>
              <TabList>
                <Tab value="all">All</Tab>
                <Tab value="in-progress">In Progress</Tab>
                <Tab value="completed">Completed</Tab>
                <Tab value="on-hold">On Hold</Tab>
              </TabList>
            </Tabs>
            
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search projects..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project Name</TableHead>
                  <TableHead>Budget</TableHead>
                  <TableHead>Spent</TableHead>
                  <TableHead>Remaining</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payments</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProjects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell className="font-medium">{project.name}</TableCell>
                    <TableCell>₹{project.totalBudget.toLocaleString()}</TableCell>
                    <TableCell>₹{project.spent.toLocaleString()}</TableCell>
                    <TableCell>₹{project.remaining.toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={project.progress} className="h-2 w-20" />
                        <span className="text-xs">{project.progress}%</span>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(project.status)}</TableCell>
                    <TableCell>
                      {project.paymentsCount} (
                        <span className={project.pendingPayments > 0 ? "text-red-500" : "text-green-500"}>
                          {project.pendingPayments} pending
                        </span>
                      )
                    </TableCell>
                    <TableCell>{project.startDate}</TableCell>
                    <TableCell>{project.endDate}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Project</DialogTitle>
          </DialogHeader>
          <AddProjectForm onSuccess={handleAddProjectSuccess} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Projects;
