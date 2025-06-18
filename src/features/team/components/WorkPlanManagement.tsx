import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/chakra/Card";
import { Button } from "@/components/chakra/Button";
import { Input } from "@/components/chakra/Input";
import { Textarea } from "@/components/chakra/Textarea";
import { Badge } from "@/components/chakra/Badge";
import { Label } from "@/components/chakra/Label";
import { Select } from "@/components/chakra/Select";
import { DatePicker } from "@/components/chakra/DatePicker";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/chakra/Dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/chakra/Table";
import { VStack, HStack, Text } from "@chakra-ui/react";
import { Plus, Calendar, Users, Clock, Eye, Edit, Trash } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { WorkPlan, WorkPlanType } from "@/features/team/types/teamTypes";

const mockWorkPlans: WorkPlan[] = [
  {
    id: "1",
    title: "Site Survey at Naharlagun",
    type: "daily",
    description: "Complete site survey for the new tower installation",
    assignedTo: ["John Doe", "Jane Smith"],
    startDate: "2023-07-15",
    endDate: "2023-07-15",
    status: "completed",
    priority: "high",
    notes: "Survey completed successfully. Site is suitable for tower installation."
  },
  {
    id: "2",
    title: "Weekly Team Progress Review",
    type: "weekly",
    description: "Review progress of all ongoing projects",
    assignedTo: ["John Doe", "Project Managers"],
    startDate: "2023-07-10",
    endDate: "2023-07-14",
    status: "in-progress",
    priority: "medium",
    notes: "3 out of 5 project reviews completed."
  },
  {
    id: "3",
    title: "Monthly Infrastructure Planning",
    type: "monthly",
    description: "Plan infrastructure requirements for the next quarter",
    assignedTo: ["Jane Smith", "Technical Team"],
    startDate: "2023-07-01",
    endDate: "2023-07-31",
    status: "pending",
    priority: "high",
    notes: "Waiting for budget approval before proceeding."
  },
  {
    id: "4",
    title: "Equipment Installation at Itanagar",
    type: "daily",
    description: "Install networking equipment at the client site",
    assignedTo: ["Technical Team"],
    startDate: "2023-07-20",
    endDate: "2023-07-20",
    status: "pending",
    priority: "medium",
    notes: "Equipment has been delivered to the site."
  }
];

const WorkPlanManagement = () => {
  const [workPlans, setWorkPlans] = useState<WorkPlan[]>(mockWorkPlans);
  const [filteredPlans, setFilteredPlans] = useState<WorkPlan[]>(mockWorkPlans);
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [showViewDialog, setShowViewDialog] = useState<boolean>(false);
  const [selectedPlan, setSelectedPlan] = useState<WorkPlan | null>(null);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);

  useEffect(() => {
    filterWorkPlans();
  }, [selectedType, selectedStatus, searchTerm, workPlans]);

  const filterWorkPlans = () => {
    let filtered = [...workPlans];
    
    if (selectedType !== "all") {
      filtered = filtered.filter(plan => plan.type === selectedType);
    }
    
    if (selectedStatus !== "all") {
      filtered = filtered.filter(plan => plan.status === selectedStatus);
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        plan => 
          plan.title.toLowerCase().includes(term) || 
          plan.description.toLowerCase().includes(term) ||
          plan.assignedTo.some(person => person.toLowerCase().includes(term))
      );
    }
    
    setFilteredPlans(filtered);
  };

  const handleAddWorkPlan = (newPlan: Omit<WorkPlan, 'id'>) => {
    const plan = {
      ...newPlan,
      id: Date.now().toString()
    };
    
    setWorkPlans(prev => [...prev, plan]);
    setShowAddForm(false);
    toast.success("Work plan added successfully");
  };

  const handleUpdateWorkPlan = (updatedPlan: WorkPlan) => {
    setWorkPlans(prev => 
      prev.map(plan => plan.id === updatedPlan.id ? updatedPlan : plan)
    );
    setShowViewDialog(false);
    setSelectedPlan(null);
    setIsEditMode(false);
    toast.success("Work plan updated successfully");
  };

  const handleDeleteWorkPlan = (id: string) => {
    setWorkPlans(prev => prev.filter(plan => plan.id !== id));
    setShowViewDialog(false);
    setSelectedPlan(null);
    toast.success("Work plan deleted successfully");
  };

  const viewWorkPlan = (plan: WorkPlan) => {
    setSelectedPlan(plan);
    setIsEditMode(false);
    setShowViewDialog(true);
  };

  const editWorkPlan = (plan: WorkPlan) => {
    setSelectedPlan(plan);
    setIsEditMode(true);
    setShowViewDialog(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case "in-progress":
        return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge className="bg-red-100 text-red-800">High</Badge>;
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>;
      case "low":
        return <Badge className="bg-green-100 text-green-800">Low</Badge>;
      default:
        return <Badge variant="outline">Normal</Badge>;
    }
  };

  const getTypeIcon = (type: WorkPlanType) => {
    switch (type) {
      case "daily":
        return <Calendar className="h-4 w-4" />;
      case "weekly":
        return <Clock className="h-4 w-4" />;
      case "monthly":
        return <Users className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters and Actions */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <HStack spacing={4}>
          <div>
            <Label htmlFor="type-filter">Type</Label>
            <Select
              id="type-filter"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="status-filter">Status</Label>
            <Select
              id="status-filter"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="search">Search</Label>
            <Input
              id="search"
              placeholder="Search work plans..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </HStack>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Work Plan
        </Button>
      </div>

      {/* Work Plans Table */}
      <Card>
        <CardHeader>
          <CardTitle>Work Plans</CardTitle>
          <CardDescription>Manage daily, weekly, and monthly work plans for your team</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Date Range</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPlans.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6">
                    No work plans found. Create your first work plan to get started.
                  </TableCell>
                </TableRow>
              ) : (
                filteredPlans.map((plan) => (
                  <TableRow key={plan.id}>
                    <TableCell className="font-medium">{plan.title}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getTypeIcon(plan.type)}
                        <span className="capitalize">{plan.type}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {plan.assignedTo.length > 1 
                        ? `${plan.assignedTo[0]} +${plan.assignedTo.length - 1}` 
                        : plan.assignedTo[0]}
                    </TableCell>
                    <TableCell>
                      {plan.startDate === plan.endDate 
                        ? plan.startDate 
                        : `${plan.startDate} - ${plan.endDate}`}
                    </TableCell>
                    <TableCell>{getStatusBadge(plan.status)}</TableCell>
                    <TableCell>{getPriorityBadge(plan.priority)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => viewWorkPlan(plan)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => editWorkPlan(plan)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDeleteWorkPlan(plan.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add/Edit Work Plan Dialog */}
      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Work Plan</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" placeholder="Enter work plan title" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select id="type" defaultValue="daily">
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                placeholder="Enter work plan description" 
                rows={3} 
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start-date">Start Date</Label>
                <DatePicker 
                  placeholder="Select start date"
                  date={new Date()}
                  setDate={() => {}}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end-date">End Date</Label>
                <DatePicker 
                  placeholder="Select end date"
                  date={new Date()}
                  setDate={() => {}}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select id="status" defaultValue="pending">
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select id="priority" defaultValue="medium">
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="assigned-to">Assigned To</Label>
              <Input id="assigned-to" placeholder="Enter team members (comma separated)" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea 
                id="notes" 
                placeholder="Additional notes or instructions" 
                rows={2} 
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowAddForm(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              // Mock implementation - in a real app, you'd collect form data
              const mockNewPlan = {
                title: "New Work Plan",
                type: "daily" as WorkPlanType,
                description: "Description of the new work plan",
                assignedTo: ["John Doe"],
                startDate: "2023-08-01",
                endDate: "2023-08-01",
                status: "pending",
                priority: "medium",
                notes: ""
              };
              handleAddWorkPlan(mockNewPlan);
            }}>
              Add Work Plan
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Work Plan Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? "Edit Work Plan" : "Work Plan Details"}
            </DialogTitle>
          </DialogHeader>
          {selectedPlan && (
            <div className="space-y-4 py-4">
              {isEditMode ? (
                // Edit Mode Form
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-title">Title</Label>
                      <Input 
                        id="edit-title" 
                        defaultValue={selectedPlan.title} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-type">Type</Label>
                      <Select 
                        id="edit-type" 
                        defaultValue={selectedPlan.type}
                      >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="edit-description">Description</Label>
                    <Textarea 
                      id="edit-description" 
                      defaultValue={selectedPlan.description} 
                      rows={3} 
                    />
                  </div>
                  
                  {/* Additional edit fields would go here */}
                  
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setIsEditMode(false);
                        setShowViewDialog(false);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button onClick={() => {
                      // Mock update - in a real app, collect form data
                      const updatedPlan = {
                        ...selectedPlan,
                        title: selectedPlan.title + " (Updated)",
                      };
                      handleUpdateWorkPlan(updatedPlan);
                    }}>
                      Save Changes
                    </Button>
                  </div>
                </div>
              ) : (
                // View Mode
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold">{selectedPlan.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        {getTypeIcon(selectedPlan.type)}
                        <span className="capitalize text-sm text-gray-600">
                          {selectedPlan.type} Plan
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {getStatusBadge(selectedPlan.status)}
                      {getPriorityBadge(selectedPlan.priority)}
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-2">Description</h4>
                    <p className="text-gray-700">{selectedPlan.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Date Range</h4>
                      <p className="text-gray-700">
                        {selectedPlan.startDate === selectedPlan.endDate 
                          ? selectedPlan.startDate 
                          : `${selectedPlan.startDate} - ${selectedPlan.endDate}`}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Assigned To</h4>
                      <p className="text-gray-700">
                        {selectedPlan.assignedTo.join(", ")}
                      </p>
                    </div>
                  </div>
                  
                  {selectedPlan.notes && (
                    <div>
                      <h4 className="font-medium mb-2">Notes</h4>
                      <p className="text-gray-700">{selectedPlan.notes}</p>
                    </div>
                  )}
                  
                  <div className="flex justify-end gap-2 pt-4">
                    <Button 
                      variant="outline" 
                      onClick={() => setShowViewDialog(false)}
                    >
                      Close
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setIsEditMode(true)}
                    >
                      Edit
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="text-red-600 hover:text-red-700" 
                      onClick={() => handleDeleteWorkPlan(selectedPlan.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WorkPlanManagement;
